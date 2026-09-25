import { useEffect, useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "@repo/ui/elements";
import { useAuth, useCurrentUser } from "@/hooks";
import { RouteConstants } from "@/shared/constants/routes";
import { encodeRedirectPath } from "@/utils/redirect";

export default function ProtectedRoutes() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { isLoading, isSuccess, isError } = useCurrentUser();

  const currentPath = location.pathname + location.search;
  const shouldPreserveRedirect =
    currentPath !== "/" && !currentPath.startsWith("/auth/");

  const loginRedirectTo = useMemo(() => {
    if (!shouldPreserveRedirect) return RouteConstants.auth.login.path;
    const encoded = encodeRedirectPath(currentPath);
    return `${RouteConstants.auth.login.path}?redirect=${encodeURIComponent(encoded)}`;
  }, [shouldPreserveRedirect, currentPath]);

  useEffect(() => {
    if (isAuthenticated && isError) {
      logout(
        shouldPreserveRedirect ? { redirectPath: currentPath } : undefined,
      );
    }
  }, [isAuthenticated, isError, logout, shouldPreserveRedirect, currentPath]);

  if (!isAuthenticated) {
    return <Navigate to={loginRedirectTo} state={{ from: location }} replace />;
  }

  if (isLoading) return <Loader full />;

  if (isSuccess) return <Outlet />;

  return <Loader full />;
}
