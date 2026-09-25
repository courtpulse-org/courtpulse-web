import {
  useMutation,
  useQuery,
  type MutationConfig,
  type QueryConfigType,
} from "@/lib/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import {
  createWatchlistCase,
  deleteWatchlistCase,
  getTodayMatches,
  getWatchlist,
  getWatchlistCase,
} from "./service";

export const useGetWatchlist = (
  filter?: Parameters<typeof getWatchlist>[0],
  config?: QueryConfigType<typeof getWatchlist>,
) =>
  useQuery({
    queryKey: [customQueryKey.watchlist.getAll, filter],
    queryFn: () => getWatchlist(filter),
    ...config,
  });

export const useGetWatchlistCase = (
  id: string,
  config?: QueryConfigType<typeof getWatchlistCase>,
) =>
  useQuery({
    queryKey: [customQueryKey.watchlist.getById, id],
    queryFn: () => getWatchlistCase(id),
    enabled: !!id,
    ...config,
  });

export const useGetTodayMatches = (
  config?: QueryConfigType<typeof getTodayMatches>,
) =>
  useQuery({
    queryKey: [customQueryKey.watchlist.todayMatches],
    queryFn: getTodayMatches,
    refetchInterval: 60_000,
    ...config,
  });

export const useCreateWatchlistCase = (
  config?: MutationConfig<typeof createWatchlistCase>,
) =>
  useMutation({
    mutationFn: createWatchlistCase,
    mutationKey: ["create-watchlist-case"],
    meta: {
      successMessage: "Matter added to your watchlist.",
      invalidatesQueryKeys: [[customQueryKey.watchlist.getAll]],
      ...config?.meta,
    },
    ...config,
  });

export const useDeleteWatchlistCase = (
  config?: MutationConfig<typeof deleteWatchlistCase>,
) =>
  useMutation({
    mutationFn: deleteWatchlistCase,
    mutationKey: ["delete-watchlist-case"],
    meta: {
      successMessage: "Matter removed.",
      invalidatesQueryKeys: [[customQueryKey.watchlist.getAll]],
      ...config?.meta,
    },
    ...config,
  });
