import type { IAlertDispatch } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { announceAlert } from "@/shared/utils/alerts";

/**
 * Registrar actions touch several views at once (today board, list, dock,
 * alert log), so every successful mutation refreshes all cached queries. If
 * the result carries an `alert`, the registrar sees who it reached.
 */
export function useRegistrarMutation<TVars, TData extends { data: unknown }>(
  fn: (vars: TVars) => Promise<TData>,
  options: { title?: string; announce?: boolean } = {},
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: (result) => {
      queryClient.invalidateQueries();
      if (options.announce === false) return;
      const alert = (result.data as { alert?: IAlertDispatch | null } | null)
        ?.alert;
      announceAlert(alert, options.title);
    },
  });
}
