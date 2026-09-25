import type {
  ApiResponse,
  CourtStatus,
  IBroadcast,
  ICourtroom,
  ICourtroomStatus,
  IDockEntry,
  IRemoteDateRequest,
} from "@repo/types";
import { axios } from "@/lib/axios";
import { QUERY_PATH, withParams } from "@/shared/constants/query-paths";

export interface RegistrarCourtroom {
  courtroom: ICourtroom;
  status: ICourtroomStatus | null;
}

export const getMyCourtrooms = async () => {
  const response = await axios.get<ApiResponse<RegistrarCourtroom[]>>(
    QUERY_PATH.registrar.myCourtrooms,
  );
  return response.data;
};

/** Official post — skips crowd consensus and alerts immediately. */
export const postOfficialStatus = async (data: {
  courtroom_id: string;
  status: CourtStatus;
  note?: string;
}) => {
  const { courtroom_id, ...body } = data;
  const response = await axios.post<ApiResponse<ICourtroomStatus>>(
    withParams(QUERY_PATH.registrar.postStatus, { id: courtroom_id }),
    body,
  );
  return response.data;
};

export const getBroadcasts = async () => {
  const response = await axios.get<ApiResponse<IBroadcast[]>>(
    QUERY_PATH.registrar.broadcasts,
  );
  return response.data;
};

export const createBroadcast = async (data: {
  division_id: string;
  courtroom_id?: string;
  message: string;
}) => {
  const response = await axios.post<ApiResponse<IBroadcast>>(
    QUERY_PATH.registrar.broadcasts,
    data,
  );
  return response.data;
};

export const getDock = async (courtroomId: string) => {
  const response = await axios.get<ApiResponse<IDockEntry | null>>(
    withParams(QUERY_PATH.registrar.dock, { courtroomId }),
  );
  return response.data;
};

export const updateDock = async (data: {
  courtroom_id: string;
  current_item: number;
  total_items: number;
}) => {
  const { courtroom_id, ...body } = data;
  const response = await axios.put<ApiResponse<IDockEntry>>(
    withParams(QUERY_PATH.registrar.dock, { courtroomId: courtroom_id }),
    body,
  );
  return response.data;
};

export const getRemoteDateRequests = async () => {
  const response = await axios.get<ApiResponse<IRemoteDateRequest[]>>(
    QUERY_PATH.registrar.remoteDates,
  );
  return response.data;
};

export const decideRemoteDate = async (data: {
  id: string;
  decision: "APPROVED" | "REJECTED";
  approved_date?: string;
}) => {
  const { id, ...body } = data;
  const response = await axios.post<ApiResponse<IRemoteDateRequest>>(
    withParams(QUERY_PATH.registrar.decideRemoteDate, { id }),
    body,
  );
  return response.data;
};

export const uploadOfficialCauseList = async (data: {
  courtroom_id: string;
  image: File;
}) => {
  const form = new FormData();
  form.append("courtroom_id", data.courtroom_id);
  form.append("image", data.image);
  const response = await axios.post<ApiResponse<{ id: string }>>(
    QUERY_PATH.registrar.causeLists,
    form,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};
