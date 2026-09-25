import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getToken, removeToken } from "@/lib/storage";
import { RouteConstants } from "@/shared/constants/routes";
import { encodeRedirectPath, getSafeCurrentPath } from "@/utils/redirect";

export function rejectErrorInterceptor(error: AxiosError) {
  return Promise.reject(error);
}

// Append bearer token to headers
export function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  const token = getToken().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

// A 401 is the contract for "session over": drop the token and send the user
// to login, remembering where they were.
export async function refreshTokenInterceptor(error: AxiosError) {
  if (error?.response?.status === 401) {
    removeToken();

    const currentPath = getSafeCurrentPath();
    const isOnAuthRoute = currentPath.startsWith("/auth/");

    if (!isOnAuthRoute) {
      const loginUrl = `${window.location.origin}${RouteConstants.auth.login.path}`;
      if (currentPath === "/") {
        window.location.assign(loginUrl);
      } else {
        const encoded = encodeRedirectPath(currentPath);
        window.location.assign(
          `${loginUrl}?redirect=${encodeURIComponent(encoded)}`,
        );
      }
    }
  }
  return Promise.reject(error);
}
