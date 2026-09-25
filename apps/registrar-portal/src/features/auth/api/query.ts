import {
  useMutation,
  useQuery,
  type MutationConfig,
  type QueryConfigType,
} from "@/lib/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import { acceptInvite, getMe, staffLogin } from "./service";

export const useGetMe = (config?: QueryConfigType<typeof getMe>) =>
  useQuery({
    queryKey: [customQueryKey.auth.getMe],
    queryFn: getMe,
    ...config,
  });

export const useStaffLogin = (config?: MutationConfig<typeof staffLogin>) =>
  useMutation({
    mutationFn: staffLogin,
    mutationKey: ["staff-login"],
    meta: { errorMessage: "Incorrect email or password.", ...config?.meta },
    ...config,
  });

export const useAcceptInvite = (config?: MutationConfig<typeof acceptInvite>) =>
  useMutation({
    mutationFn: acceptInvite,
    mutationKey: ["accept-invite"],
    meta: {
      successMessage: "Account created. An admin will verify you shortly.",
      ...config?.meta,
    },
    ...config,
  });
