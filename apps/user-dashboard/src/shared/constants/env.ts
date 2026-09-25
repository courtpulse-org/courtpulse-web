export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  FRONTEND_URL: import.meta.env.VITE_APP_FRONTEND_URL,
  /** Real-time channel for courtroom status pushes (PRD §5: ≤15s). */
  WS_URL: import.meta.env.VITE_APP_WS_URL,
  REGISTRAR_PORTAL_URL: import.meta.env.VITE_APP_REGISTRAR_PORTAL_URL,
};
