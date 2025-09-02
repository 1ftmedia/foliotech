/// <reference types="vite/client" />

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, handler: (...args: any[]) => void) => void;
    removeListener: (event: string, handler: (...args: any[]) => void) => void;
  };
  FlutterwaveCheckout: (config: any) => void;
}

interface ImportMetaEnv {
  readonly VITE_FLUTTERWAVE_PUBLIC_KEY: string;
  readonly FLUTTERWAVE_SECRET_KEY: string;
  readonly FLUTTERWAVE_ENCRYPTION_KEY: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}