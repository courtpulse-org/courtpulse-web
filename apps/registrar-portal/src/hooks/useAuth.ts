import { useCallback } from "react";
import { useQueryClient } from "@/lib/react-query";
import {
  getToken,
  removeToken,
  setAccessToken,
  setRefreshToken,
} from "@/lib/storage";
import { RouteConstants } from "@/shared/constants/routes";
import { customQueryKey } from "@/shared/constants/query-keys";
import { encodeRedirectPath } from "@/utils/redirect";

export function useAuth() {
  const queryClient = useQueryClient();

  const isAuthenticated = !!getToken().accessToken;

  const login = useCallback(
    (accessToken: string, refreshToken?: string) => {
      setAccessToken(accessToken);
      if (refreshToken) setRefreshToken(refreshToken);
      queryClient.invalidateQueries({ queryKey: [customQueryKey.auth.getMe] });
    },
    [queryClient],
  );

  const logout = useCallback(
    (options?: { redirectPath?: string }) => {
      removeToken();
      queryClient.clear();
      const base = `${window.location.origin}${RouteConstants.auth.login.path}`;
      const path = options?.redirectPath;
      const shouldPreserve = path && path !== "/" && !path.startsWith("/auth/");
      if (shouldPreserve) {
        window.location.assign(
          `${base}?redirect=${encodeURIComponent(encodeRedirectPath(path))}`,
        );
      } else {
        window.location.assign(base);
      }
    },
    [queryClient],
  );

  return { isAuthenticated, login, logout };
}
