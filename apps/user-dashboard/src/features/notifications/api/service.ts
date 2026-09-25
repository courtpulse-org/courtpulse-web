import type { ApiResponse, INotificationPreferences } from "@repo/types";
import { axios } from "@/lib/axios";
import { QUERY_PATH, withParams } from "@/shared/constants/query-paths";

export interface INotification {
  id: string;
  title: string;
  body: string;
  kind:
    | "STATUS_VERIFIED"
    | "CAUSE_LIST_MATCH"
    | "BROADCAST"
    | "BRIEF"
    | "REMOTE_DATE";
  read: boolean;
  link?: string;
  created_at: string;
}

export const getNotifications = async () => {
  const response = await axios.get<ApiResponse<INotification[]>>(
    QUERY_PATH.notifications.base,
  );
  return response.data;
};

export const markNotificationRead = async (id: string) => {
  const response = await axios.post<ApiResponse<null>>(
    withParams(QUERY_PATH.notifications.markRead, { id }),
  );
  return response.data;
};

export const getNotificationPreferences = async () => {
  const response = await axios.get<ApiResponse<INotificationPreferences>>(
    QUERY_PATH.notifications.preferences,
  );
  return response.data;
};

export const updateNotificationPreferences = async (
  data: INotificationPreferences,
) => {
  const response = await axios.put<ApiResponse<INotificationPreferences>>(
    QUERY_PATH.notifications.preferences,
    data,
  );
  return response.data;
};
