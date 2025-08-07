import { type AuthConfig } from '../types';
import { UploadService } from './UploadService';
import { API_KEY, REPO_API_ENDPOINT } from '../consts';

export const initUploadService = () => {
  const accessToken = 'eyJhbGciOiJSUzI1NiIsIng1dSI6Imltc19uYTEtc3RnMS1rZXktZ3QtMS5jZXIiLCJraWQiOiJpbXNfbmExLXN0ZzEta2V5LWd0LTEiLCJ0eXAiOiJhdCtqd3QiLCJjcml0IjpbImVudiJdLCJlbnYiOiJpbXMtbmExLXN0ZzEifQ.eyJqdGkiOiIxNzU0NTUyNTg3NjAxXzY0ODAzZjc1LTE1MzQtNGQ0OS04NTQ3LTg1NTQyOWE1OTk1MV91dzIiLCJjbGllbnRfaWQiOiJBZG9iZUV4cHJlc3NXZWIiLCJzdWIiOiIxNzU0NTUyNTg3NjAxXzQ1OWI4YjBiLWY4MjMtNDIxNC05NjBjLTc0ZTY3ZTZiYjM2M0BHdWVzdElEIiwiaXNzIjoiaHR0cHM6Ly9pbXMtbmExLXN0ZzEuYWRvYmVsb2dpbi5jb20vaW1zIiwiaWF0IjoxNzU0NTUyNTg3LCJnZGkiOiIxNzU0NTUyNTg3NjAxXzM2YThkYThiLTU0YjctNDFmYi1hMTJhLTJhZWE5YWNlOWFmYSIsImV4cCI6MTc1NDU1NjE4NywiYXRwIjoiZ3Vlc3QiLCJzY2MiOiJJTiIsImdzZSI6MTc1NDYzODk4NywiZ2RlIjoxNzU2OTcxNzg3LCJzY29wZSI6Im9wZW5pZCBBZG9iZUlEIn0.S537e5g4ehbxKJQtAcvUso1_zey8xg9Ek3UQ10kw4u9LmdQGt6x6INHFwUI6WYGjSxfPCxHILYDUMk4X580pt59YPk6hgAMqIMopqYdD-Xq-tAHXDLxeNjrSdQSDUG6NBHpCqwQ_GthqE0aivSnoChACdOUXs4lrDsmnUh5X7uz5_jhM0s8prTusfKsxo-Ead16Iubo69JUdCAqjjr2LNsmHIOpeNNWxRgbPHOtwEd1kU9zmtGOInPPvwnAcQ9YTDDyh2ccJZos8qyE5NzHRo2vGNGWvg7OUesnzhQMtB7NQmFPafUF_ff50f8qh_BBtcuBxhhv82C8S3TQVxS59WQ';
  const authConfig: AuthConfig = {
    tokenType: window?.adobeIMS?.isSignedInUser() ? 'user' : 'guest',
    token: accessToken || window?.adobeIMS?.getAccessToken(),
    apiKey: API_KEY
  };
  
  return new UploadService({
    authConfig,
    endpoint: REPO_API_ENDPOINT
  });
};