import type { ApiResponse, IDockEntry, IRemoteDateRequest } from "@repo/types";
import { axios } from "@/lib/axios";
import { QUERY_PATH, withParams } from "@/shared/constants/query-paths";

export const getDock = async (courtroomId: string) => {
  const response = await axios.get<ApiResponse<IDockEntry | null>>(
    withParams(QUERY_PATH.dock.byCourtroom, { courtroomId }),
  );
  return response.data;
};

export const getRemoteDateRequests = async () => {
  const response = await axios.get<ApiResponse<IRemoteDateRequest[]>>(
    QUERY_PATH.dock.remoteDateRequests,
  );
  return response.data;
};

/** Only allowed once the courtroom's status is verified NOT_SITTING. */
export const createRemoteDateRequest = async (data: {
  suit_number: string;
  courtroom_id: string;
  proposed_dates: string[];
}) => {
  const response = await axios.post<ApiResponse<IRemoteDateRequest>>(
    QUERY_PATH.dock.remoteDateRequests,
    data,
  );
  return response.data;
};
