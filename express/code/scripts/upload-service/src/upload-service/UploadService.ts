import type { AdobeRepoAPISession } from '@dcx/repo-api-session';
import type { 
  AdobeAsset,
  AdobeHTTPService,
  UploadProgressCallback,
  SliceableData,
} from '@dcx/common-types';
import {
  type UploadServiceConfig,
  type UploadOptions,
  type UploadResult,
  type PreSignedUrlOptions,
  type AuthConfig,
  UploadStatus,
} from '../types';
import { createRepoAPISession } from '@dcx/repo-api-session';
import { getPresignedUrl, RepoResponseResult, RepositoryLinksCache } from '@dcx/assets';
import { DEFAULT_STORAGE_PATH, ERROR_CODES } from '../consts';
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
   * Upload an asset to storage
   * @param options - Upload options including file, path, and metadata
   * @returns Promise resolving to upload result
   */
  async uploadAsset(options: UploadOptions): Promise<UploadResult> {
    /**
     * Reset the upload status to idle when the upload is completed or failed.
     */
    this.uploadStatus = UploadStatus.IDLE;
    
    try {
      const {
        file,
        fileName,
        contentType,
        path = DEFAULT_STORAGE_PATH,
        createIntermediates,
        onProgress = this.getUploadProgress(),
        additionalHeaders = {},
        repoMetaPatch,
        resourceDesignator
      } = options;

      const fileData = this.convertToSliceableData(file);
      const fileSize = this.getFileSize(file);
      const fullPath = this.buildPath(path, this.generateFileName(fileName));

      let result: RepoResponseResult<AdobeAsset>;
      let preSignedUrl: string | undefined;
      switch (this.authConfig.tokenType) {
        case 'guest': {
          result = await this.session.createAssetForGuest(
            fullPath,
            contentType,
            resourceDesignator,
            additionalHeaders,
            fileData,
            fileSize,
            repoMetaPatch,
            onProgress
          );
          preSignedUrl = await this.generatePreSignedUrl({ asset: result.result });
          break;
        }
        case 'user':
        default: {
          if (!this.config.repositoryId) {
            throw this.handleError(
              ERROR_CODES.REPOSITORY_ID_REQUIRED.code,
              new Error(ERROR_CODES.REPOSITORY_ID_REQUIRED.message)
            );
          }

          const parentDir = await this.getOrCreateParentDirectory(path);
          
          result = await this.session.createAsset(
            parentDir,
            fileName,
            createIntermediates || true,
            contentType,
            resourceDesignator,
            additionalHeaders,
            fileData,
            fileSize,
            repoMetaPatch
          );
          }
        }

      if(this._uploadBytesCompleted) {
        this.uploadStatus = UploadStatus.COMPLETED;
      }

      const asset = result.result;
      return {
        asset,
        readablePreSignedUrl: preSignedUrl,
        shareablePreSignedUrl: this.generateShareablePreSignedUrl(preSignedUrl)
      };

    } catch (error) {
      throw this.handleError(
        ERROR_CODES.UPLOAD_FAILED.code,
        error
      );
    }
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
    window.dispatchEvent(new UploadStatusEvent({ status }));
  }

  /**
   * Get upload progress for an ongoing upload
   * @returns Promise resolving to upload progress information
   */
  getUploadProgress(): UploadProgressCallback {
    return (bytesCompleted, totalBytes) => {
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
   * Get or create a parent directory for an asset
   * @param path - The path to the asset
   * @returns The parent directory asset
   */
  private async getOrCreateParentDirectory(path: string): Promise<AdobeAsset> {
    if (!this.config.repositoryId) {
      throw this.handleError(
        ERROR_CODES.REPOSITORY_ID_REQUIRED_FOR_DIRECTORY.code,
        new Error(ERROR_CODES.REPOSITORY_ID_REQUIRED_FOR_DIRECTORY.message)
      );
    }

    const parentDir: AdobeAsset = {
      repositoryId: this.config.repositoryId,
      path: path || '/',
      links: {}
    };

    return parentDir;
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

    console.error(`UploadService Error [${errorCode.code}]:`, errorMessage, originalError);
    
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