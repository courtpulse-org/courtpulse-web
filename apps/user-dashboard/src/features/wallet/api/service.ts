import type { ApiResponse, IPulseCreditLedgerEntry } from "@repo/types";
import { axios } from "@/lib/axios";
import { QUERY_PATH } from "@/shared/constants/query-paths";

export interface WalletSummary {
  /** Kobo available in escrow wallet. */
  escrow_balance: number;
  /** Kobo currently locked against open brief-holding requests. */
  escrow_held: number;
  credits_balance: number;
}

export interface EscrowLedgerEntry {
  id: string;
  amount: number;
  type: "FUND" | "HOLD" | "RELEASE" | "REFUND" | "PAYOUT";
  reference?: string;
  created_at: string;
}

export const getWalletSummary = async () => {
  const response = await axios.get<ApiResponse<WalletSummary>>(
    QUERY_PATH.wallet.summary,
  );
  return response.data;
};

export const getCreditsLedger = async () => {
  const response = await axios.get<ApiResponse<IPulseCreditLedgerEntry[]>>(
    QUERY_PATH.wallet.credits,
  );
  return response.data;
};

export const getEscrowLedger = async () => {
  const response = await axios.get<ApiResponse<EscrowLedgerEntry[]>>(
    QUERY_PATH.wallet.escrow,
  );
  return response.data;
};

/** Returns a hosted checkout URL from the payment gateway. */
export const fundEscrow = async (data: { amount: number }) => {
  const response = await axios.post<ApiResponse<{ checkout_url: string }>>(
    QUERY_PATH.wallet.fund,
    data,
  );
  return response.data;
};
