import type {
  ApiResponse,
  BriefHoldingMatterType,
  IBaseFilter,
  IBriefHoldingRequest,
} from "@repo/types";
import { buildUrlWithQueryParams } from "@repo/utils";
import { axios } from "@/lib/axios";
import { QUERY_PATH, withParams } from "@/shared/constants/query-paths";

export interface CreateBriefPayload {
  suit_number: string;
  courtroom_id: string;
  matter_type: BriefHoldingMatterType;
  scheduled_date: string;
  /** Kobo. Deposited into escrow on creation. */
  fee_amount: number;
  instructions?: string;
}

/** Open requests inside the complex the user is checked in to (geo-fenced). */
export const getNearbyBriefs = async (filter?: IBaseFilter) => {
  const response = await axios.get<ApiResponse<IBriefHoldingRequest[]>>(
    buildUrlWithQueryParams(QUERY_PATH.briefs.nearby, filter),
  );
  return response.data;
};

/** Requests the user posted or accepted. */
export const getMyBriefs = async (filter?: IBaseFilter) => {
  const response = await axios.get<ApiResponse<IBriefHoldingRequest[]>>(
    buildUrlWithQueryParams(QUERY_PATH.briefs.mine, filter),
  );
  return response.data;
};

export const getBrief = async (id: string) => {
  const response = await axios.get<ApiResponse<IBriefHoldingRequest>>(
    withParams(QUERY_PATH.briefs.byId, { id }),
  );
  return response.data;
};

export const createBrief = async (data: CreateBriefPayload) => {
  const response = await axios.post<ApiResponse<IBriefHoldingRequest>>(
    QUERY_PATH.briefs.base,
    data,
  );
  return response.data;
};

export const acceptBrief = async (id: string) => {
  const response = await axios.post<ApiResponse<IBriefHoldingRequest>>(
    withParams(QUERY_PATH.briefs.accept, { id }),
  );
  return response.data;
};

/** Standing-in counsel uploads session notes; escrow releases on success. */
export const completeBrief = async (data: {
  id: string;
  session_notes: string;
}) => {
  const response = await axios.post<ApiResponse<IBriefHoldingRequest>>(
    withParams(QUERY_PATH.briefs.complete, { id: data.id }),
    { session_notes: data.session_notes },
  );
  return response.data;
};

export const cancelBrief = async (id: string) => {
  const response = await axios.post<ApiResponse<IBriefHoldingRequest>>(
    withParams(QUERY_PATH.briefs.cancel, { id }),
  );
  return response.data;
};
