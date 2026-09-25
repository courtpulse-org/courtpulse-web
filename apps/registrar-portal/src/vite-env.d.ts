/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_FRONTEND_URL?: string;
  readonly VITE_APP_WS_URL?: string;
  readonly VITE_APP_LAWYER_APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
