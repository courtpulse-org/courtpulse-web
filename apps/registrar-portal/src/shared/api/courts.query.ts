import { useQuery, type QueryConfigType } from "@/lib/react-query";
import { customQueryKey } from "@/shared/constants/query-keys";
import {
  getComplexes,
  getCourtroomStatus,
  getCourtrooms,
  getDivisions,
  getLiveBoard,
} from "./courts.service";

export const useGetDivisions = (
  config?: QueryConfigType<typeof getDivisions>,
) =>
  useQuery({
    queryKey: [customQueryKey.courts.divisions],
    queryFn: getDivisions,
    staleTime: Infinity,
    ...config,
  });

export const useGetComplexes = (
  filter?: Parameters<typeof getComplexes>[0],
  config?: QueryConfigType<typeof getComplexes>,
) =>
  useQuery({
    queryKey: [customQueryKey.courts.complexes, filter],
    queryFn: () => getComplexes(filter),
    staleTime: Infinity,
    ...config,
  });

export const useGetCourtrooms = (
  filter?: Parameters<typeof getCourtrooms>[0],
  config?: QueryConfigType<typeof getCourtrooms>,
) =>
  useQuery({
    queryKey: [customQueryKey.courts.courtrooms, filter],
    queryFn: () => getCourtrooms(filter),
    staleTime: Infinity,
    ...config,
  });

export const useGetCourtroomStatus = (
  courtroomId: string,
  config?: QueryConfigType<typeof getCourtroomStatus>,
) =>
  useQuery({
    queryKey: [customQueryKey.courts.courtroomStatus, courtroomId],
    queryFn: () => getCourtroomStatus(courtroomId),
    // Polling fallback until the websocket channel lands; PRD wants ≤15s.
    refetchInterval: 15_000,
    ...config,
  });

export const useGetLiveBoard = (
  filter?: Parameters<typeof getLiveBoard>[0],
  config?: QueryConfigType<typeof getLiveBoard>,
) =>
  useQuery({
    queryKey: [customQueryKey.courts.liveBoard, filter],
    queryFn: () => getLiveBoard(filter),
    refetchInterval: 15_000,
    ...config,
  });
