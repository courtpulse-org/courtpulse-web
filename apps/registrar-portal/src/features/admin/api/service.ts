import type { ApiResponse, IBriefHoldingRequest, IUser } from "@repo/types";
import { axios } from "@/lib/axios";
import { QUERY_PATH, withParams } from "@/shared/constants/query-paths";

export interface IDispute {
  id: string;
  brief: IBriefHoldingRequest;
  raised_by: string;
  reason: string;
  status: "OPEN" | "RESOLVED";
  created_at: string;
}

export interface IEscrowOverview {
  total_held: number;
  total_released_today: number;
  pending_payouts: number;
}

export interface IConsensusConfig {
  /** Independent matching reports needed to promote a status to VERIFIED. */
  min_reports: number;
  /** Reports older than this don't count toward consensus. */
  window_minutes: number;
  /** Credits awarded to the first N reporters of a verified status. */
  credit_first_n: number;
  credit_amount: number;
}

export const getRegistrars = async () =>
  (await axios.get<ApiResponse<IUser[]>>(QUERY_PATH.admin.registrars)).data;

export const inviteRegistrar = async (data: {
  email: string;
  courtroom_ids: string[];
}) =>
  (await axios.post<ApiResponse<null>>(QUERY_PATH.admin.inviteRegistrar, data))
    .data;

export const verifyRegistrar = async (id: string) =>
  (
    await axios.post<ApiResponse<IUser>>(
      withParams(QUERY_PATH.admin.verifyRegistrar, { id }),
    )
  ).data;

export const getLawyers = async () =>
  (await axios.get<ApiResponse<IUser[]>>(QUERY_PATH.admin.lawyers)).data;

export const verifyLawyer = async (id: string) =>
  (
    await axios.post<ApiResponse<IUser>>(
      withParams(QUERY_PATH.admin.verifyLawyer, { id }),
    )
  ).data;

export const getDisputes = async () =>
  (await axios.get<ApiResponse<IDispute[]>>(QUERY_PATH.admin.disputes)).data;

export const resolveDispute = async (data: {
  id: string;
  outcome: "RELEASE_TO_HOLDER" | "REFUND_REQUESTER";
  note?: string;
}) => {
  const { id, ...body } = data;
  return (
    await axios.post<ApiResponse<IDispute>>(
      withParams(QUERY_PATH.admin.resolveDispute, { id }),
      body,
    )
  ).data;
};

export const getEscrowOverview = async () =>
  (await axios.get<ApiResponse<IEscrowOverview>>(QUERY_PATH.admin.escrow)).data;

export const getConsensusConfig = async () =>
  (await axios.get<ApiResponse<IConsensusConfig>>(QUERY_PATH.admin.consensus))
    .data;

export const updateConsensusConfig = async (data: IConsensusConfig) =>
  (
    await axios.put<ApiResponse<IConsensusConfig>>(
      QUERY_PATH.admin.consensus,
      data,
    )
  ).data;
