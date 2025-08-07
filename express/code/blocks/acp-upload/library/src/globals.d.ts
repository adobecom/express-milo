declare global {
  interface Window {
    adobeIMS: {
      getAccessToken: () => string;
      isSignedInUser: () => boolean;
    };
  }
}

export {};
