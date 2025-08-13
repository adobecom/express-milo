declare global {
  interface Window {
    tempAccessToken: string;
    adobeIMS: {
      getAccessToken: () => {
        token: string;
        expire: number;
        isGuestToken: boolean;
      };
      isSignedInUser: () => boolean;
    };
  }
}

export {};
