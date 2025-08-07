declare global {
  interface Window {
    adobeIMS: {
      getAccessToken: () => string;
    };
  }
}

export {};
