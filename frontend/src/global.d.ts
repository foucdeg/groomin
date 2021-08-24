declare global {
  interface Window {
    /** Facebook login API - may be blocked or fail to load */
    gtag?: (method: string, name: string, props: Record<string, string>) => void;
  }
}

export {};
