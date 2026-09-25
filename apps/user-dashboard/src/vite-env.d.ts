/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_FRONTEND_URL?: string;
  readonly VITE_APP_WS_URL?: string;
  readonly VITE_APP_REGISTRAR_PORTAL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
