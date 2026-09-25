import {
  useMutation,
  useQuery,
  type MutationConfig,
  type QueryConfigType,
} from "@/lib/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import { getMe, registerLawyer, requestOtp, verifyOtp } from "./service";

export const useGetMe = (config?: QueryConfigType<typeof getMe>) =>
  useQuery({
    queryKey: [customQueryKey.auth.getMe],
    queryFn: getMe,
    ...config,
  });

export const useRequestOtp = (config?: MutationConfig<typeof requestOtp>) =>
  useMutation({
    mutationFn: requestOtp,
    mutationKey: ["request-otp"],
    meta: {
      errorMessage: "We couldn't send a code to that number.",
      ...config?.meta,
    },
    ...config,
  });

export const useVerifyOtp = (config?: MutationConfig<typeof verifyOtp>) =>
  useMutation({
    mutationFn: verifyOtp,
    mutationKey: ["verify-otp"],
    meta: {
      errorMessage: "That code didn't match. Please try again.",
      ...config?.meta,
    },
    ...config,
  });

export const useRegisterLawyer = (
  config?: MutationConfig<typeof registerLawyer>,
) =>
  useMutation({
    mutationFn: registerLawyer,
    mutationKey: ["register-lawyer"],
    meta: {
      errorMessage: "We couldn't create your account.",
      ...config?.meta,
    },
    ...config,
  });
