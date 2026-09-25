import {
  useMutation,
  useQuery,
  type MutationConfig,
  type QueryConfigType,
} from "@/lib/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import { getScan, getScans, uploadScan } from "./service";

export const useGetScans = (config?: QueryConfigType<typeof getScans>) =>
  useQuery({
    queryKey: [customQueryKey.causeList.scans],
    queryFn: getScans,
    ...config,
  });

export const useGetScan = (
  id: string,
  config?: QueryConfigType<typeof getScan>,
) =>
  useQuery({
    queryKey: [customQueryKey.causeList.scanById, id],
    queryFn: () => getScan(id),
    enabled: !!id,
    // Keep polling while OCR is running.
    refetchInterval: (query) =>
      query.state.data?.data?.status === "PROCESSING" ? 3_000 : false,
    ...config,
  });

export const useUploadScan = (config?: MutationConfig<typeof uploadScan>) =>
  useMutation({
    mutationFn: uploadScan,
    mutationKey: ["upload-cause-list-scan"],
    meta: {
      successMessage: "Photo uploaded. Reading the cause list…",
      invalidatesQueryKeys: [[customQueryKey.causeList.scans]],
      ...config?.meta,
    },
    ...config,
  });
