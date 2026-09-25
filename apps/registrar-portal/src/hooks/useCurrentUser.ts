import { useGetMe } from "@/features/auth/api";
import { useAuth } from "./useAuth";

export function useCurrentUser() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isError, error, isSuccess } = useGetMe({
    enabled: isAuthenticated,
  });

  const userData = data?.data;
  const fullName = userData
    ? `${userData.first_name} ${userData.last_name}`.trim()
    : "";

  return {
    isLoading,
    isError,
    error,
    isSuccess,
    userData,
    fullName,
    isAdmin: userData?.role === "ADMIN",
    isRegistrar: userData?.role === "REGISTRAR",
    /** Lawyers have their own app; they must not land in the portal. */
    isStaff: userData?.role === "ADMIN" || userData?.role === "REGISTRAR",
  };
}
