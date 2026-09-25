import type { ApiResponse, CourtStatus, ICourtroomStatus } from "@repo/types";
import { axios } from "@/lib/axios";
import { QUERY_PATH } from "@/shared/constants/query-paths";

export interface CheckIn {
  courtroom_id: string;
  complex_id: string;
  checked_in_at: string;
}

/** A Spotter must be checked in to a courtroom before reporting from it. */
export const checkIn = async (data: {
  courtroom_id: string;
  latitude?: number;
  longitude?: number;
}) => {
  const response = await axios.post<ApiResponse<CheckIn>>(
    QUERY_PATH.pulse.checkIn,
    data,
  );
  return response.data;
};

export const checkOut = async () => {
  const response = await axios.post<ApiResponse<null>>(
    QUERY_PATH.pulse.checkOut,
  );
  return response.data;
};

export const getMyCheckIn = async () => {
  const response = await axios.get<ApiResponse<CheckIn | null>>(
    QUERY_PATH.pulse.myCheckIn,
  );
  return response.data;
};

/** 1-tap micro-status. The consensus engine decides verification. */
export const reportStatus = async (data: {
  courtroom_id: string;
  status: CourtStatus;
}) => {
  const response = await axios.post<ApiResponse<ICourtroomStatus>>(
    QUERY_PATH.pulse.report,
    data,
  );
  return response.data;
};
