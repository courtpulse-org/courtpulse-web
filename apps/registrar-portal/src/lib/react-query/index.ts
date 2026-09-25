import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import type {
  UseQueryOptions,
  UseMutationOptions,
  DefaultOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toaster } from "@repo/ui/elements";
import { getErrorMessage } from "@repo/utils";

export type MutationMeta = {
  successMessage?: string;
  errorMessage?: string;
  /** Opt out of the global error toast for mutations with inline error UI. */
  silent?: boolean;
  /** Each inner array is one query key, e.g. [['watchlist'], ['cases', id]] */
  invalidatesQueryKeys?: readonly (readonly unknown[])[];
};

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: MutationMeta;
  }
}

const defaultOptions: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    staleTime: 60_000,
    gcTime: 3_600_000,
    structuralSharing: true,
  },
  mutations: {
    retry: false,
    gcTime: 0,
  },
};

export const queryClient = new QueryClient({
  defaultOptions,
  // Queries surface failure inline, not as a toast. Opt in per query with
  // `meta: { toastOnError: true }`.
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (!query.meta?.toastOnError) return;
      toaster.create({
        description:
          getErrorMessage(error) || "Something went wrong. Please try again.",
        type: "error",
      });
    },
  }),
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      if (mutation.meta?.successMessage) {
        toaster.create({
          description: mutation.meta.successMessage,
          type: "success",
        });
      }
      mutation.meta?.invalidatesQueryKeys?.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey: queryKey as unknown[] });
      });
    },
    onError: (error, _variables, _context, mutation) => {
      if (mutation?.meta?.silent) return;
      // The server's message wins; `meta.errorMessage` is the fallback.
      const configured = mutation?.meta?.errorMessage;
      toaster.create({
        description:
          getErrorMessage(error) ||
          (typeof configured === "string" && configured
            ? configured
            : "Something went wrong. Please try again."),
        type: "error",
      });
    },
  }),
});

export type QueryConfigType<Fn extends (...args: any) => Promise<any>> = Omit<
  UseQueryOptions<Awaited<ReturnType<Fn>>, AxiosError>,
  "queryKey" | "queryFn"
>;

export type MutationConfig<Fn extends (...args: any) => Promise<any>> = Omit<
  UseMutationOptions<Awaited<ReturnType<Fn>>, AxiosError, Parameters<Fn>[0]>,
  "mutationFn"
>;

export {
  useMutation,
  useQueries,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

// Custom useQuery wrapper that defaults to 'any' instead of 'unknown'
import {
  useQuery as useQueryOriginal,
  type UseQueryOptions as UseQueryOptionsOriginal,
  type UseQueryResult,
} from "@tanstack/react-query";

export function useQuery<
  TQueryFnData = any,
  TError = AxiosError,
  TData = TQueryFnData,
>(
  options: UseQueryOptionsOriginal<TQueryFnData, TError, TData>,
): UseQueryResult<TData, TError> {
  return useQueryOriginal(options);
}
