import {
  useMutation,
  useQuery,
  type MutationConfig,
  type QueryConfigType,
} from "@/lib/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import { checkIn, checkOut, getMyCheckIn, reportStatus } from "./service";

export const useGetMyCheckIn = (
  config?: QueryConfigType<typeof getMyCheckIn>,
) =>
  useQuery({
    queryKey: [customQueryKey.pulse.myCheckIn],
    queryFn: getMyCheckIn,
    ...config,
  });

export const useCheckIn = (config?: MutationConfig<typeof checkIn>) =>
  useMutation({
    mutationFn: checkIn,
    mutationKey: ["pulse-check-in"],
    meta: {
      successMessage: "You're checked in. Tap a status when it changes.",
      invalidatesQueryKeys: [[customQueryKey.pulse.myCheckIn]],
      ...config?.meta,
    },
    ...config,
  });

export const useCheckOut = (config?: MutationConfig<typeof checkOut>) =>
  useMutation({
    mutationFn: checkOut,
    mutationKey: ["pulse-check-out"],
    meta: {
      invalidatesQueryKeys: [[customQueryKey.pulse.myCheckIn]],
      ...config?.meta,
    },
    ...config,
  });

export const useReportStatus = (config?: MutationConfig<typeof reportStatus>) =>
  useMutation({
    mutationFn: reportStatus,
    mutationKey: ["pulse-report-status"],
    meta: {
      successMessage: "Thanks — your report is in.",
      invalidatesQueryKeys: [
        [customQueryKey.courts.courtroomStatus],
        [customQueryKey.courts.liveBoard],
      ],
      ...config?.meta,
    },
    ...config,
  });
