import {
  useMutation,
  useQuery,
  type MutationConfig,
  type QueryConfigType,
} from "@/lib/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import {
  getConsensusConfig,
  getDisputes,
  getEscrowOverview,
  getLawyers,
  getRegistrars,
  inviteRegistrar,
  resolveDispute,
  updateConsensusConfig,
  verifyLawyer,
  verifyRegistrar,
} from "./service";

const K = customQueryKey.admin;

export const useGetRegistrars = (
  config?: QueryConfigType<typeof getRegistrars>,
) => useQuery({ queryKey: [K.registrars], queryFn: getRegistrars, ...config });

export const useInviteRegistrar = (
  config?: MutationConfig<typeof inviteRegistrar>,
) =>
  useMutation({
    mutationFn: inviteRegistrar,
    meta: {
      successMessage: "Invitation sent.",
      invalidatesQueryKeys: [[K.registrars]],
      ...config?.meta,
    },
    ...config,
  });

export const useVerifyRegistrar = (
  config?: MutationConfig<typeof verifyRegistrar>,
) =>
  useMutation({
    mutationFn: verifyRegistrar,
    meta: {
      successMessage: "Registrar verified.",
      invalidatesQueryKeys: [[K.registrars]],
      ...config?.meta,
    },
    ...config,
  });

export const useGetLawyers = (config?: QueryConfigType<typeof getLawyers>) =>
  useQuery({ queryKey: [K.lawyers], queryFn: getLawyers, ...config });

export const useVerifyLawyer = (config?: MutationConfig<typeof verifyLawyer>) =>
  useMutation({
    mutationFn: verifyLawyer,
    meta: {
      successMessage: "Lawyer verified.",
      invalidatesQueryKeys: [[K.lawyers]],
      ...config?.meta,
    },
    ...config,
  });

export const useGetDisputes = (config?: QueryConfigType<typeof getDisputes>) =>
  useQuery({ queryKey: [K.disputes], queryFn: getDisputes, ...config });

export const useResolveDispute = (
  config?: MutationConfig<typeof resolveDispute>,
) =>
  useMutation({
    mutationFn: resolveDispute,
    meta: {
      successMessage: "Dispute resolved.",
      invalidatesQueryKeys: [[K.disputes], [K.escrow]],
      ...config?.meta,
    },
    ...config,
  });

export const useGetEscrowOverview = (
  config?: QueryConfigType<typeof getEscrowOverview>,
) => useQuery({ queryKey: [K.escrow], queryFn: getEscrowOverview, ...config });

export const useGetConsensusConfig = (
  config?: QueryConfigType<typeof getConsensusConfig>,
) =>
  useQuery({ queryKey: [K.consensus], queryFn: getConsensusConfig, ...config });

export const useUpdateConsensusConfig = (
  config?: MutationConfig<typeof updateConsensusConfig>,
) =>
  useMutation({
    mutationFn: updateConsensusConfig,
    meta: {
      successMessage: "Consensus rules updated.",
      invalidatesQueryKeys: [[K.consensus]],
      ...config?.meta,
    },
    ...config,
  });
