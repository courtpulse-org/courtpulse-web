import {
  useMutation,
  useQuery,
  type MutationConfig,
  type QueryConfigType,
} from "@/lib/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import {
  getNotificationPreferences,
  getNotifications,
  markNotificationRead,
  updateNotificationPreferences,
} from "./service";

export const useGetNotifications = (
  config?: QueryConfigType<typeof getNotifications>,
) =>
  useQuery({
    queryKey: [customQueryKey.notifications.getAll],
    queryFn: getNotifications,
    refetchInterval: 30_000,
    ...config,
  });

export const useMarkNotificationRead = (
  config?: MutationConfig<typeof markNotificationRead>,
) =>
  useMutation({
    mutationFn: markNotificationRead,
    mutationKey: ["mark-notification-read"],
    meta: {
      silent: true,
      invalidatesQueryKeys: [[customQueryKey.notifications.getAll]],
      ...config?.meta,
    },
    ...config,
  });

export const useGetNotificationPreferences = (
  config?: QueryConfigType<typeof getNotificationPreferences>,
) =>
  useQuery({
    queryKey: [customQueryKey.notifications.preferences],
    queryFn: getNotificationPreferences,
    ...config,
  });

export const useUpdateNotificationPreferences = (
  config?: MutationConfig<typeof updateNotificationPreferences>,
) =>
  useMutation({
    mutationFn: updateNotificationPreferences,
    mutationKey: ["update-notification-preferences"],
    meta: {
      successMessage: "Alert preferences saved.",
      invalidatesQueryKeys: [[customQueryKey.notifications.preferences]],
      ...config?.meta,
    },
    ...config,
  });
