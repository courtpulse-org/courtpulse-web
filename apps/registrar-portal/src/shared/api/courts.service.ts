import type {
  ApiResponse,
  ICourtComplex,
  ICourtroom,
  ICourtroomStatus,
  IJudicialDivision,
} from "@repo/types";
import { buildUrlWithQueryParams } from "@repo/utils";
import { axios } from "@/lib/axios";
import { QUERY_PATH, withParams } from "@/shared/constants/query-paths";

export const getDivisions = async () => {
  const response = await axios.get<ApiResponse<IJudicialDivision[]>>(
    QUERY_PATH.courts.divisions,
  );
  return response.data;
};

export const getComplexes = async (filter?: { division_id?: string }) => {
  const response = await axios.get<ApiResponse<ICourtComplex[]>>(
    buildUrlWithQueryParams(QUERY_PATH.courts.complexes, filter),
  );
  return response.data;
};

export const getCourtrooms = async (filter?: {
  division_id?: string;
  complex_id?: string;
}) => {
  const response = await axios.get<ApiResponse<ICourtroom[]>>(
    buildUrlWithQueryParams(QUERY_PATH.courts.courtrooms, filter),
  );
  return response.data;
};

export const getCourtroomStatus = async (courtroomId: string) => {
  const response = await axios.get<ApiResponse<ICourtroomStatus>>(
    withParams(QUERY_PATH.courts.courtroomStatus, { id: courtroomId }),
  );
  return response.data;
};

export interface LiveBoardRow {
  courtroom: ICourtroom;
  status: ICourtroomStatus | null;
  /** True when one of the user's watched matters is listed here today. */
  has_watched_case: boolean;
}

/** Every courtroom the user cares about today, with its latest status. */
export const getLiveBoard = async (filter?: { division_id?: string }) => {
  const response = await axios.get<ApiResponse<LiveBoardRow[]>>(
    buildUrlWithQueryParams(QUERY_PATH.courts.liveBoard, filter),
  );
  return response.data;
};
