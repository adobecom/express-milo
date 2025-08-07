import { type AuthConfig } from '../types';
import { UploadService } from './UploadService';
import { API_KEY, REPO_API_ENDPOINT } from '../consts';

export const initUploadService = (mode: AuthConfig['tokenType'], accessToken?: string) => {
  const authConfig: AuthConfig = {
    tokenType: mode,
    token: accessToken || window?.adobeIMS?.getAccessToken(),
    apiKey: API_KEY
  };
  
  return new UploadService({
    authConfig,
    endpoint: REPO_API_ENDPOINT
  });
};