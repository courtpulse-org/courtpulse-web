import { useEffect, useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Loader } from "@repo/ui/elements";
import { useAuth, useCurrentUser } from "@/hooks";
import { env } from "@/shared/constants/env";
import { RouteConstants } from "@/shared/constants/routes";
import { encodeRedirectPath } from "@/utils/redirect";

function WrongApp() {
  const { logout } = useAuth();
  return (
    <Flex h="100dvh" align="center" justify="center" bg="surface" p="6">
      <VStack gap="3" textAlign="center" maxW="26rem">
        <Heading textStyle="h2">This portal is for court staff</Heading>
        <Text color="gray.200" textStyle="small-regular">
          Lawyer accounts use the CourtPulse app.
        </Text>
        {env.LAWYER_APP_URL && (
          <Button asChild>
            <a href={env.LAWYER_APP_URL}>Go to CourtPulse</a>
          </Button>
        )}
        <Button variant="ghost" onClick={() => logout()}>
          Sign out
        </Button>
      </VStack>
    </Flex>
  );
}

export default function ProtectedRoutes() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { isLoading, isSuccess, isError, isStaff } = useCurrentUser();

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
  if (isSuccess && !isStaff) return <WrongApp />;
  if (isSuccess) return <Outlet />;
  return <Loader full />;
}
