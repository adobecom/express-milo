declare global {
  interface Window {
    tempAccessToken: string;
    adobeIMS: {
      getAccessToken: () => string;
      isSignedInUser: () => boolean;
    };
  }
}

export {};
