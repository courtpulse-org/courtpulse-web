import {
  useMutation,
  useQuery,
  type MutationConfig,
  type QueryConfigType,
} from "@/lib/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import {
  createRemoteDateRequest,
  getDock,
  getRemoteDateRequests,
} from "./service";

export const useGetDock = (
  courtroomId: string,
  config?: QueryConfigType<typeof getDock>,
) =>
  useQuery({
    queryKey: [customQueryKey.dock.byCourtroom, courtroomId],
    queryFn: () => getDock(courtroomId),
    enabled: !!courtroomId,
    refetchInterval: 15_000,
    ...config,
  });

export const useGetRemoteDateRequests = (
  config?: QueryConfigType<typeof getRemoteDateRequests>,
) =>
  useQuery({
    queryKey: [customQueryKey.dock.remoteDateRequests],
    queryFn: getRemoteDateRequests,
    ...config,
  });

export const useCreateRemoteDateRequest = (
  config?: MutationConfig<typeof createRemoteDateRequest>,
) =>
  useMutation({
    mutationFn: createRemoteDateRequest,
    mutationKey: ["create-remote-date-request"],
    meta: {
      successMessage: "Dates sent to the registrar for confirmation.",
      invalidatesQueryKeys: [[customQueryKey.dock.remoteDateRequests]],
      ...config?.meta,
    },
    ...config,
  });
