import {
  useMutation,
  useQuery,
  type MutationConfig,
  type QueryConfigType,
} from "@/lib/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import {
  fundEscrow,
  getCreditsLedger,
  getEscrowLedger,
  getWalletSummary,
} from "./service";

export const useGetWalletSummary = (
  config?: QueryConfigType<typeof getWalletSummary>,
) =>
  useQuery({
    queryKey: [customQueryKey.wallet.summary],
    queryFn: getWalletSummary,
    ...config,
  });

export const useGetCreditsLedger = (
  config?: QueryConfigType<typeof getCreditsLedger>,
) =>
  useQuery({
    queryKey: [customQueryKey.wallet.credits],
    queryFn: getCreditsLedger,
    ...config,
  });

export const useGetEscrowLedger = (
  config?: QueryConfigType<typeof getEscrowLedger>,
) =>
  useQuery({
    queryKey: [customQueryKey.wallet.escrow],
    queryFn: getEscrowLedger,
    ...config,
  });

export const useFundEscrow = (config?: MutationConfig<typeof fundEscrow>) =>
  useMutation({
    mutationFn: fundEscrow,
    mutationKey: ["fund-escrow"],
    meta: { errorMessage: "We couldn't start the payment.", ...config?.meta },
    ...config,
  });
