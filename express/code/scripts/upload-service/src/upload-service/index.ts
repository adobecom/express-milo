import { type AuthConfig } from '../types';
import { UploadService } from './UploadService';
import { API_KEY, REPO_API_ENDPOINT } from '../consts';

export const initUploadService = () => {
  const authConfig: AuthConfig = {
    tokenType: window?.adobeIMS?.isSignedInUser() ? 'user' : 'guest',
    token: window?.adobeIMS?.getAccessToken()?.token,
    apiKey: API_KEY
  };

  return new UploadService({
    authConfig,
    endpoint: REPO_API_ENDPOINT
  });
};