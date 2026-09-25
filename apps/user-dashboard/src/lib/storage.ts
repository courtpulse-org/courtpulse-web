import { AppStorage, createTokenHelpers } from "@repo/utils";

type DashboardStorageKeys =
  | "access_token"
  | "refresh_token"
  | "redirect_path"
  | "pending_otp_phone"
  | "checked_in_courtroom";

// Distinct prefix from the registrar portal so the two sessions never
// collide in a shared browser.
export const storage = new AppStorage<DashboardStorageKeys>(
  "courtpulse_lawyer_",
);

export const { getToken, setAccessToken, setRefreshToken, removeToken } =
  createTokenHelpers(storage);
