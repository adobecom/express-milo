import type { AdobeRepoAPISession } from '@dcx/repo-api-session';
import type { 
  AdobeAsset,
  AdobeHTTPService,
  UploadProgressCallback,
  SliceableData,
  AdobeMinimalAsset,
  GetSliceCallback,
} from '@dcx/common-types';
import {
  type UploadServiceConfig,
  type UploadOptions,
  type UploadResult,
  type PreSignedUrlOptions,
  type AuthConfig,
  UploadStatus
} from '../types';
import { createRepoAPISession } from '@dcx/repo-api-session';
import { Directory, getPresignedUrl, RepoResponseResult, RepositoryLinksCache } from '@dcx/assets';
import { ERROR_CODES } from '../consts';
import { createHTTPService } from '@dcx/http';
import { UploadStatusEvent } from '../events';

/**
 * Service for uploading assets to Adobe Content Platform Storage
 * Supports both guest token and normal access token authentication
 */
export class UploadService {
  private session: AdobeRepoAPISession;
  private config: UploadServiceConfig;
  private httpService: AdobeHTTPService;
  private authConfig: AuthConfig;
  private _uploadStatus: UploadStatus = UploadStatus.IDLE;
  private _uploadBytesCompleted: boolean = false;
  private _uploadProgressPercentage: number = 0;

  /**
   * Create a new UploadService instance
   * @param config - Configuration for the upload service
   */
  constructor(config: UploadServiceConfig) {
    this.config = config;
    this.httpService = createHTTPService();
    this.authConfig = config.authConfig;
    this.session = this.prepareSession();
  }

  /**
   * Initialize repository for user token type
   */
  private async initializeUserRepository(): Promise<void> {
    try {
      const repository = await this.setupUserRepository();
      if (repository) {
        this.config.repository = repository;
      }
    } catch (error) {
      throw this.handleError(
        ERROR_CODES.REPOSITORY_REQUIRED.code,
        error
      );
    }
  }

  /**
   * Sets up the user repository for the upload service
   * This function does a couple of things:
   * 1. Gets the index document for the user
   * 2. Gets the children of the index document
   * 3. If there is only one child, that is the repository
   * 4. If there are multiple children, it finds the temp folder. If there is no temp folder, it uses the first child as the repository
   * 5. Returns the repository ID and path
   * @returns Promise resolving to the repository
   */
  private async setupUserRepository(): Promise<AdobeMinimalAsset | null> {
    const indexDocumentResponse = await this.session.getIndexDocument();
    const { assignedDirectories } = indexDocumentResponse.result;
    const indexRepoId = assignedDirectories?.[0]?.repositoryId;
    const indexAssetId = assignedDirectories?.[0]?.assetId;

    const dir = new Directory({ repositoryId: indexRepoId, assetId: indexAssetId }, this.httpService);
    const children = await dir.getPagedChildren();

    if(children?.result) {
      const directoryChildren = children.result.children;
      if(directoryChildren.length === 1) {
        const repository = directoryChildren[0];
        return {
          repositoryId: repository["repo:repositoryId"],
          path: repository["repo:path"]
        };
      } else {
        //Find the temp folder for the user from the children repositories
        let tempFolder = directoryChildren.find((child: any) => child["repo:name"] === "temp");
        if(!tempFolder) {
          tempFolder = directoryChildren[0];
        }
        return {
          repositoryId: tempFolder["repo:repositoryId"],
          path: tempFolder["repo:path"]
        };
      }
    }

    return null;
  }

  /**
   * Get the current upload status
   * @returns The current upload status
   */
  get uploadStatus(): UploadStatus {
    return this._uploadStatus;
  }

  /**
   * Set the upload status
   * @param status - The status to set
   */
  set uploadStatus(status: UploadStatus) {
    this._uploadStatus = status;
    this.dispatchStatusEvent(status);
  }

  /**
   * Initialize the upload service
   */
  async setIndexRepository(): Promise<void> {
    if(this.authConfig.tokenType === 'user') {
      await this.initializeUserRepository();
    }
  }

  /**
   * Upload an asset to storage
   * @param options - Upload options including file, path, and metadata
   * @returns Promise resolving to upload result
   */
  async uploadAsset(options: UploadOptions): Promise<UploadResult> {
    this.uploadStatus = UploadStatus.IDLE;

    try {
      const {
        file,
        fileName,
        path = this.config.basePath,
        onProgress = this.getUploadProgress()
      } = options;

      const fileData = this.convertToSliceableData(file);
      const fileSize = this.getFileSize(file);
      const fullPath = this.buildPath(path, this.generateFileName(fileName));

      let result: RepoResponseResult<AdobeAsset>;
      let preSignedUrl: string | undefined;

      switch (this.authConfig.tokenType) {
        case 'guest': {
          const guestResult = await this.createAssetForGuest(
            { ...options, onProgress },
            fileData,
            fileSize,
            fullPath
          );
          result = guestResult.result;
          preSignedUrl = guestResult.preSignedUrl;
          break;
        }
        case 'user':
        default: {
          const userResult = await this.createAssetForUser(
            options,
            fileData,
            fileSize,
            fullPath
          );
          result = userResult.result;
          break;
        }
      }

      if(this._uploadBytesCompleted) {
        this.uploadStatus = UploadStatus.COMPLETED;
      }

      const asset = result.result;
      return {
        asset
      };

    } catch (error) {
      throw this.handleError(
        ERROR_CODES.UPLOAD_FAILED.code,
        error
      );
    }
  }

  /**
   * Create asset for guest users
   * @param options - Upload options
   * @param fileData - Processed file data
   * @param fileSize - Size of the file
   * @param fullPath - Full path for the asset
   * @returns Promise resolving to asset creation result and pre-signed URL
   */
  private async createAssetForGuest(
    options: UploadOptions,
    fileData: SliceableData,
    fileSize: number,
    fullPath: string
  ): Promise<{ result: RepoResponseResult<AdobeAsset>; preSignedUrl?: string }> {
    const {
      contentType,
      resourceDesignator,
      additionalHeaders = {},
      repoMetaPatch,
      onProgress
    } = options;

    const result = await this.session.createAssetForGuest(
      fullPath,
      contentType,
      resourceDesignator,
      additionalHeaders,
      fileData,
      fileSize,
      repoMetaPatch,
      onProgress
    );

    return { result };
  }

  /**
   * Create asset for authenticated users
   * @param options - Upload options
   * @param fileData - Processed file data
   * @param fileSize - Size of the file
   * @param fullPath - Full path for the asset
   * @returns Promise resolving to asset creation result
   */
  private async createAssetForUser(
    options: UploadOptions,
    fileData: SliceableData,
    fileSize: number,
    fullPath: string
  ): Promise<{ result: RepoResponseResult<AdobeAsset> }> {
    const {
      contentType,
      resourceDesignator,
      additionalHeaders = {},
      repoMetaPatch,
      createIntermediates
    } = options;

    let result: RepoResponseResult<AdobeAsset>;

    if (!this.config.repository) {
      throw this.handleError(
        ERROR_CODES.REPOSITORY_REQUIRED.code,
        new Error(ERROR_CODES.REPOSITORY_REQUIRED.message)
      );
    }

    const parentDir = this.config.repository;
    
    try {
      this.uploadStatus = UploadStatus.UPLOADING;
      result = await this.session.createAsset(
        parentDir,
        fullPath,
        createIntermediates || true,
        contentType,
        resourceDesignator,
        additionalHeaders,
        fileData,
        fileSize,
        repoMetaPatch
      );
      this._uploadProgressPercentage = 100;
      this.uploadStatus = UploadStatus.COMPLETED;
    } catch (error) {
      throw this.handleError(
        ERROR_CODES.UPLOAD_FAILED.code,
        error
      );
    }

    return { result };
  }

  /**
   * Generate a pre-signed URL for downloading an asset
   * @param options - Options for URL generation
   * @returns Promise resolving to pre-signed URL result
   */
  async generatePreSignedUrl(options: PreSignedUrlOptions): Promise<string> {
    try {
      const {
        asset
      } = options;

      const { result: url } = await getPresignedUrl(this.httpService, asset);

      return url;

    } catch (error) {
      throw this.handleError(
        ERROR_CODES.URL_GENERATION_FAILED.code,
        error
      );
    }
  }

  /**
   * Generate a shareable pre-signed URL by base64 encoding the URL
   * This is useful for passing the URL via URL params
   * @param url - The pre-signed URL to share
   * @returns The shareable pre-signed URL
   */
  private generateShareablePreSignedUrl(url: string | undefined): string {
    if (!url) {
      return '';
    }
    return btoa(url);
  }

  /**
   * Generate a unique file name for the uploaded file
   * @param fileName - The original file name
   * @returns The unique file name
   */
  private generateFileName(fileName: string): string {
    const [name, extension] = fileName.split('.');
    const timestamp = Date.now();
    return `${name}-${timestamp}.${extension}`;
  }

  /**
   * Dispatch a status event
   * @param status - The status to dispatch
   */
  private dispatchStatusEvent(status: UploadStatus): void {
    window.dispatchEvent(new UploadStatusEvent({ status, progress: this._uploadProgressPercentage }));
  }

  /**
   * Get upload progress for an ongoing upload
   * @returns Promise resolving to upload progress information
   */
  getUploadProgress(): UploadProgressCallback {
    return (bytesCompleted, totalBytes) => {
      this._uploadProgressPercentage = Math.round((bytesCompleted / totalBytes) * 100);
      if(bytesCompleted === totalBytes) {
        this._uploadBytesCompleted = true;
      }
      this.uploadStatus = UploadStatus.UPLOADING;
    };
  }

  /**
   * Prepare the RAPI session for the upload service.
   */
  private prepareSession(): AdobeRepoAPISession {
    this.httpService.setAuthToken(this.authConfig.token);
    this.httpService.setApiKey(this.authConfig.apiKey);
    const session = createRepoAPISession(this.httpService, this.config.endpoint);
    session.setLinksCache(new RepositoryLinksCache());
    return session;
  }

  /**
   * Convert a file to a sliceable data object
   * @param file - The file to convert
   * @returns The sliceable data object
   */
  private convertToSliceableData(file: File | Blob | ArrayBuffer): SliceableData {
    if (file instanceof ArrayBuffer) {
      return new Uint8Array(file);
    }
    return file as SliceableData;
  }

  /**
   * Get the size of a file
   * @param file - The file to get the size of
   * @returns The size of the file
   */
  private getFileSize(file: File | Blob | ArrayBuffer): number {
    if (file instanceof ArrayBuffer) {
      return file.byteLength;
    }
    if ('size' in file) {
      return file.size;
    }
    return 0;
  }

  /**
   * Build a path for an asset for uploading.
   * @param path - The path to the asset
   * @param fileName - The name of the asset
   * @returns The full path to the asset
   */
  private buildPath(path: string, fileName: string): string {
    const basePath = this.config.basePath || '';
    const fullPath = [basePath, path, fileName]
      .filter(Boolean)
      .join('/')
      .replace(/\/+/g, '/');
    
    return fullPath.startsWith('/') ? fullPath.substring(1) : fullPath;
  }

  /**
   * Handle an error
   * @param code - The error code
   * @param originalError - The original error
   * @param message - The error message
   * @returns The error
   */
  private handleError(code: keyof typeof ERROR_CODES, originalError?: any, message?: string): Error {
    const errorCode = ERROR_CODES[code];

    if(errorCode.code === ERROR_CODES.UPLOAD_FAILED.code) {
      this.uploadStatus = UploadStatus.FAILED;
    }

    const errorMessage = message || errorCode.message;
    const error = new (class extends Error {
      constructor(
        message: string,
        public code: string,
        public originalError?: Error
      ) {
        super(message);
        this.name = 'UploadServiceError';
      }
    })(errorMessage, errorCode.code, originalError);

    if(this.config.environment === 'local' || this.config.environment === 'stage') {
      window.lana.log(`UploadService Error [${errorCode.code}]: ${errorMessage}`);
      window.lana.log(originalError);
    }
    
    return error;
  }

  /**
   * Update the service configuration
   * @param newConfig - New configuration to apply
   */
  updateConfig(newConfig: Partial<UploadServiceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.authConfig || newConfig.endpoint) {
      this.session = this.prepareSession();
    }
  }

  /**
   * Get the current configuration
   * @returns Current service configuration
   */
  getConfig(): UploadServiceConfig {
    return { ...this.config };
  }
} 