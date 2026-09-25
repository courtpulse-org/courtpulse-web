import { todayLagos, useDateRequests, useMyCourtrooms } from "@/shared/api";
import type { BadgeKey } from "./sidebar-config";

export function useNavBadges(): Record<BadgeKey, number> {
  const requests = useDateRequests();
  const rooms = useMyCourtrooms(todayLagos());
  return {
    dateRequests: (requests.data?.data ?? []).filter(
      (r) => r.status === "PENDING",
    ).length,
    unposted: (rooms.data?.data ?? []).filter((r) => !r.status).length,
  };
}
