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
    isVerified: Boolean(userData?.is_verified),
  };
}
