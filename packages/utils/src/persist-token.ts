import type { DurationType } from "@repo/types";
import type { AppStorage } from "./storage";

export function createTokenHelpers(appStorage: AppStorage<any>) {
  return {
    getToken() {
      const accessToken = appStorage.getValue<string>("access_token");
      const refreshToken = appStorage.getValue<string>("refresh_token");
      return { accessToken, refreshToken };
    },

    setAccessToken(token: string, duration?: DurationType) {
      appStorage.setValue("access_token", token, duration);
    },

    setRefreshToken(token: string, duration?: DurationType) {
      appStorage.setValue("refresh_token", token, duration);
    },

    removeToken() {
      appStorage.clearValue("access_token");
      appStorage.clearValue("refresh_token");
    },
  };
}
