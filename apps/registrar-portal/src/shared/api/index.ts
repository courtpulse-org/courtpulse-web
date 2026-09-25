import { useQuery } from "@tanstack/react-query";
import * as api from "@/mock/api";
import { customQueryKey as K } from "@/shared/constants/query-keys";
import { useRegistrarMutation } from "./mutation";

export type {
  RegistrarCourtroom,
  PostStatusPayload,
  ItemInput,
  OutcomePayload,
} from "@/mock/api";
export {
  DEMO_ACCOUNTS,
  courtroomLabel,
  todayLagos,
  addWorkingDays,
} from "@/mock/api";
export { useRegistrarMutation };

// ── Reads ────────────────────────────────────────────────────────────────

export const useMyCourtrooms = (date: string) =>
  useQuery({
    queryKey: [K.courtrooms.mine, date],
    queryFn: () => api.getMyCourtrooms(date),
    refetchInterval: 20_000,
  });

export const useCourtroomSummary = (id: string, date: string) =>
  useQuery({
    queryKey: [K.courtrooms.summary, id, date],
    queryFn: () => api.getCourtroomSummary(id, date),
    enabled: !!id,
  });

export const useStatusTimeline = (id: string, date: string) =>
  useQuery({
    queryKey: [K.courtrooms.timeline, id, date],
    queryFn: () => api.getStatusTimeline(id, date),
    enabled: !!id,
  });

export const useCauseList = (id: string, date: string) =>
  useQuery({
    queryKey: [K.causeList.byCourtroom, id, date],
    queryFn: () => api.getCauseList(id, date),
    enabled: !!id,
  });

export const useDiary = (id: string, days = 30) =>
  useQuery({
    queryKey: [K.diary.byCourtroom, id, days],
    queryFn: () => api.getDiary(id, days),
    enabled: !!id,
  });

export const useBroadcasts = () =>
  useQuery({ queryKey: [K.broadcasts.all], queryFn: api.getBroadcasts });
export const useDateRequests = () =>
  useQuery({ queryKey: [K.dateRequests.all], queryFn: api.getDateRequests });
export const useAlerts = () =>
  useQuery({ queryKey: [K.alerts.all], queryFn: api.getAlerts });
export const useActivity = () =>
  useQuery({ queryKey: [K.activity.all], queryFn: api.getActivity });
export const useAllCourtrooms = () =>
  useQuery({ queryKey: [K.courtrooms.all], queryFn: api.getAllCourtrooms });
export const useDivisions = () =>
  useQuery({
    queryKey: [K.courtrooms.divisions],
    queryFn: api.getDivisions,
    staleTime: Infinity,
  });

// ── Registrar actions ────────────────────────────────────────────────────

export const usePostStatus = () =>
  useRegistrarMutation(api.postStatus, { title: "Status posted" });
export const useDismissCrowdReport = () =>
  useRegistrarMutation(api.dismissCrowdReport, { title: "Report dismissed" });
export const useAddItems = () =>
  useRegistrarMutation(api.addItems, { title: "Cause list updated" });
export const useUpdateItem = () =>
  useRegistrarMutation(api.updateItem, { title: "Matter updated" });
export const useRemoveItem = () =>
  useRegistrarMutation(api.removeItem, { title: "Matter removed" });
export const useMoveItem = () =>
  useRegistrarMutation(api.moveItem, { announce: false });
export const usePublishList = () =>
  useRegistrarMutation(api.publishList, { title: "Cause list published" });
export const useUnpublishList = () =>
  useRegistrarMutation(api.unpublishList, { title: "Moved back to draft" });
export const useCallItem = () =>
  useRegistrarMutation(api.callItem, { title: "Matter called" });
export const useCallNext = () =>
  useRegistrarMutation(api.callNext, { title: "Next matter called" });
export const useSetOutcome = () =>
  useRegistrarMutation(api.setOutcome, { title: "Outcome recorded" });
export const useBulkAdjourn = () =>
  useRegistrarMutation(api.bulkAdjourn, { title: "Dates given" });
export const useReadCauseListPhoto = () =>
  useRegistrarMutation(api.readCauseListPhoto, { announce: false });
export const useSetDiaryBlock = () =>
  useRegistrarMutation(api.setDiaryBlock, { title: "Diary updated" });
export const useCreateBroadcast = () =>
  useRegistrarMutation(api.createBroadcast, { title: "Broadcast sent" });
export const useExpireBroadcast = () =>
  useRegistrarMutation(api.expireBroadcast, { title: "Broadcast ended" });
export const useDecideDateRequest = () =>
  useRegistrarMutation(api.decideDateRequest, { title: "Decision sent" });

// ── Admin ────────────────────────────────────────────────────────────────

export const useAdminOverview = () =>
  useQuery({ queryKey: [K.admin.overview], queryFn: api.getAdminOverview });
export const useRegistrars = () =>
  useQuery({ queryKey: [K.admin.registrars], queryFn: api.getRegistrars });
export const useLawyers = () =>
  useQuery({ queryKey: [K.admin.lawyers], queryFn: api.getLawyers });
export const useJudges = () =>
  useQuery({ queryKey: [K.admin.judges], queryFn: api.getJudges });
export const useJudgeAssignments = (courtroomId: string) =>
  useQuery({
    queryKey: [K.admin.assignments, courtroomId],
    queryFn: () => api.getJudgeAssignments(courtroomId),
    enabled: !!courtroomId,
  });
export const useCalendar = () =>
  useQuery({ queryKey: [K.admin.calendar], queryFn: api.getCalendar });
export const useConsensus = () =>
  useQuery({ queryKey: [K.admin.consensus], queryFn: api.getConsensus });

export const useInviteRegistrar = () =>
  useRegistrarMutation(api.inviteRegistrar, { title: "Invitation created" });
export const useSetRegistrarCourtrooms = () =>
  useRegistrarMutation(api.setRegistrarCourtrooms, {
    title: "Courtrooms updated",
  });
export const useVerifyUser = () =>
  useRegistrarMutation(api.verifyUser, { title: "Verified" });
export const useAssignJudge = () =>
  useRegistrarMutation(api.assignJudge, { title: "Judge assigned" });
export const useAddCalendarPeriod = () =>
  useRegistrarMutation(api.addCalendarPeriod, { title: "Added to calendar" });
export const useRemoveCalendarPeriod = () =>
  useRegistrarMutation(api.removeCalendarPeriod, {
    title: "Removed from calendar",
  });
export const useUpdateConsensus = () =>
  useRegistrarMutation(api.updateConsensus, { title: "Rules saved" });
