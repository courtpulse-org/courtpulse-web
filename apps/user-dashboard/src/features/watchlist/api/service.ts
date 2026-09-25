import type { ApiResponse, IBaseFilter, IWatchlistCase } from "@repo/types";
import { buildUrlWithQueryParams } from "@repo/utils";
import { axios } from "@/lib/axios";
import { QUERY_PATH, withParams } from "@/shared/constants/query-paths";

export interface CreateWatchlistCasePayload {
  suit_number: string;
  title?: string;
  division_id: string;
  courtroom_id: string;
  scheduled_date: string;
}

export const getWatchlist = async (filter?: IBaseFilter) => {
  const response = await axios.get<ApiResponse<IWatchlistCase[]>>(
    buildUrlWithQueryParams(QUERY_PATH.watchlist.base, filter),
  );
  return response.data;
};

export const getWatchlistCase = async (id: string) => {
  const response = await axios.get<ApiResponse<IWatchlistCase>>(
    withParams(QUERY_PATH.watchlist.byId, { id }),
  );
  return response.data;
};

export const getTodayMatches = async () => {
  const response = await axios.get<ApiResponse<IWatchlistCase[]>>(
    QUERY_PATH.watchlist.todayMatches,
  );
  return response.data;
};

export const createWatchlistCase = async (data: CreateWatchlistCasePayload) => {
  const response = await axios.post<ApiResponse<IWatchlistCase>>(
    QUERY_PATH.watchlist.base,
    data,
  );
  return response.data;
};

export const deleteWatchlistCase = async (id: string) => {
  const response = await axios.delete<ApiResponse<null>>(
    withParams(QUERY_PATH.watchlist.byId, { id }),
  );
  return response.data;
};
