import {
  useMutation,
  useQuery,
  type MutationConfig,
  type QueryConfigType,
} from "@/lib/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import {
  acceptBrief,
  cancelBrief,
  completeBrief,
  createBrief,
  getBrief,
  getMyBriefs,
  getNearbyBriefs,
} from "./service";

const invalidateLists = [
  [customQueryKey.briefs.nearby],
  [customQueryKey.briefs.mine],
  [customQueryKey.briefs.getById],
  [customQueryKey.wallet.summary],
];

export const useGetNearbyBriefs = (
  filter?: Parameters<typeof getNearbyBriefs>[0],
  config?: QueryConfigType<typeof getNearbyBriefs>,
) =>
  useQuery({
    queryKey: [customQueryKey.briefs.nearby, filter],
    queryFn: () => getNearbyBriefs(filter),
    refetchInterval: 30_000,
    ...config,
  });

export const useGetMyBriefs = (
  filter?: Parameters<typeof getMyBriefs>[0],
  config?: QueryConfigType<typeof getMyBriefs>,
) =>
  useQuery({
    queryKey: [customQueryKey.briefs.mine, filter],
    queryFn: () => getMyBriefs(filter),
    ...config,
  });

export const useGetBrief = (
  id: string,
  config?: QueryConfigType<typeof getBrief>,
) =>
  useQuery({
    queryKey: [customQueryKey.briefs.getById, id],
    queryFn: () => getBrief(id),
    enabled: !!id,
    ...config,
  });

export const useCreateBrief = (config?: MutationConfig<typeof createBrief>) =>
  useMutation({
    mutationFn: createBrief,
    mutationKey: ["create-brief"],
    meta: {
      successMessage: "Request posted. Nearby counsel have been alerted.",
      invalidatesQueryKeys: invalidateLists,
      ...config?.meta,
    },
    ...config,
  });

export const useAcceptBrief = (config?: MutationConfig<typeof acceptBrief>) =>
  useMutation({
    mutationFn: acceptBrief,
    mutationKey: ["accept-brief"],
    meta: {
      successMessage: "You're holding this brief.",
      invalidatesQueryKeys: invalidateLists,
      ...config?.meta,
    },
    ...config,
  });

export const useCompleteBrief = (
  config?: MutationConfig<typeof completeBrief>,
) =>
  useMutation({
    mutationFn: completeBrief,
    mutationKey: ["complete-brief"],
    meta: {
      successMessage: "Session notes submitted. Escrow will release shortly.",
      invalidatesQueryKeys: invalidateLists,
      ...config?.meta,
    },
    ...config,
  });

export const useCancelBrief = (config?: MutationConfig<typeof cancelBrief>) =>
  useMutation({
    mutationFn: cancelBrief,
    mutationKey: ["cancel-brief"],
    meta: {
      successMessage: "Request cancelled.",
      invalidatesQueryKeys: invalidateLists,
      ...config?.meta,
    },
    ...config,
  });
