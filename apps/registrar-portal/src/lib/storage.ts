import { AppStorage, createTokenHelpers } from "@repo/utils";

type PortalStorageKeys =
  "access_token" | "refresh_token" | "redirect_path" | "active_courtroom";

// Distinct prefix from the lawyer dashboard so the two sessions never
// collide in a shared browser (a court clerk may also be enrolled at the bar).
export const storage = new AppStorage<PortalStorageKeys>(
  "courtpulse_registrar_",
);

export const { getToken, setAccessToken, setRefreshToken, removeToken } =
  createTokenHelpers(storage);
