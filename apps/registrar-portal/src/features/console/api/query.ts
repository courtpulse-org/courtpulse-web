import {
  useMutation,
  useQuery,
  type MutationConfig,
  type QueryConfigType,
} from "@/lib/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import {
  createBroadcast,
  decideRemoteDate,
  getBroadcasts,
  getDock,
  getMyCourtrooms,
  getRemoteDateRequests,
  postOfficialStatus,
  updateDock,
  uploadOfficialCauseList,
} from "./service";

export const useGetMyCourtrooms = (
  config?: QueryConfigType<typeof getMyCourtrooms>,
) =>
  useQuery({
    queryKey: [customQueryKey.registrar.myCourtrooms],
    queryFn: getMyCourtrooms,
    refetchInterval: 15_000,
    ...config,
  });

export const usePostOfficialStatus = (
  config?: MutationConfig<typeof postOfficialStatus>,
) =>
  useMutation({
    mutationFn: postOfficialStatus,
    mutationKey: ["post-official-status"],
    meta: {
      successMessage: "Status posted. Counsel are being alerted.",
      invalidatesQueryKeys: [[customQueryKey.registrar.myCourtrooms]],
      ...config?.meta,
    },
    ...config,
  });

export const useGetBroadcasts = (
  config?: QueryConfigType<typeof getBroadcasts>,
) =>
  useQuery({
    queryKey: [customQueryKey.registrar.broadcasts],
    queryFn: getBroadcasts,
    ...config,
  });

export const useCreateBroadcast = (
  config?: MutationConfig<typeof createBroadcast>,
) =>
  useMutation({
    mutationFn: createBroadcast,
    mutationKey: ["create-broadcast"],
    meta: {
      successMessage: "Broadcast sent by SMS, WhatsApp and push.",
      invalidatesQueryKeys: [[customQueryKey.registrar.broadcasts]],
      ...config?.meta,
    },
    ...config,
  });

export const useGetDock = (
  courtroomId: string,
  config?: QueryConfigType<typeof getDock>,
) =>
  useQuery({
    queryKey: [customQueryKey.registrar.dock, courtroomId],
    queryFn: () => getDock(courtroomId),
    enabled: !!courtroomId,
    ...config,
  });

export const useUpdateDock = (config?: MutationConfig<typeof updateDock>) =>
  useMutation({
    mutationFn: updateDock,
    mutationKey: ["update-dock"],
    meta: {
      invalidatesQueryKeys: [[customQueryKey.registrar.dock]],
      ...config?.meta,
    },
    ...config,
  });

export const useGetRemoteDateRequests = (
  config?: QueryConfigType<typeof getRemoteDateRequests>,
) =>
  useQuery({
    queryKey: [customQueryKey.registrar.remoteDates],
    queryFn: getRemoteDateRequests,
    ...config,
  });

export const useDecideRemoteDate = (
  config?: MutationConfig<typeof decideRemoteDate>,
) =>
  useMutation({
    mutationFn: decideRemoteDate,
    mutationKey: ["decide-remote-date"],
    meta: {
      successMessage: "Decision sent to counsel.",
      invalidatesQueryKeys: [[customQueryKey.registrar.remoteDates]],
      ...config?.meta,
    },
    ...config,
  });

export const useUploadOfficialCauseList = (
  config?: MutationConfig<typeof uploadOfficialCauseList>,
) =>
  useMutation({
    mutationFn: uploadOfficialCauseList,
    mutationKey: ["upload-official-cause-list"],
    meta: {
      successMessage: "Cause list uploaded. Matching against watchlists…",
      ...config?.meta,
    },
    ...config,
  });
