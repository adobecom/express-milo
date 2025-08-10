export const REPO_API_ENDPOINT = 'https://platform-cs-stage.adobe.io';
export const API_KEY = "AdobeExpressWeb";
export const DEFAULT_STORAGE_PATH = 'assets';
/**
 * Centralized error codes and messages for the UploadService
 */
export const ERROR_CODES = {
    UPLOAD_FAILED: {
      code: 'UPLOAD_FAILED',
      message: 'Failed to upload asset. Please try again.'
    },
    URL_GENERATION_FAILED: {
      code: 'URL_GENERATION_FAILED',
      message: 'Failed to generate pre-signed URL'
    },
    REPOSITORY_ID_REQUIRED: {
      code: 'REPOSITORY_ID_REQUIRED',
      message: 'Repository ID is required for normal token uploads'
    },
    REPOSITORY_ID_REQUIRED_FOR_DIRECTORY: {
      code: 'REPOSITORY_ID_REQUIRED_FOR_DIRECTORY',
      message: 'Repository ID required for directory operations'
    }
  } as const;

  export const UPLOAD_EVENTS = {
    UPLOAD_STATUS: 'x-express-upload-status'
  } as const;