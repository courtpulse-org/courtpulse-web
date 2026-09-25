import { defineRoute } from "@repo/utils";

const AuthRoutes = {
  login: defineRoute("/auth/login" as const),
  // Registrars are onboarded by email invitation (PRD §2).
  acceptInvite: defineRoute("/auth/invite/:token" as const),
} as const;

const TodayRoutes = {
  base: defineRoute("/" as const),
} as const;

const CourtroomRoutes = {
  base: defineRoute("/courtrooms" as const),
  details: defineRoute("/courtrooms/:id" as const),
} as const;

const BroadcastRoutes = {
  base: defineRoute("/broadcasts" as const),
} as const;

const DateRequestRoutes = {
  base: defineRoute("/date-requests" as const),
} as const;

const DiaryRoutes = {
  base: defineRoute("/diary" as const),
} as const;

const AlertRoutes = {
  base: defineRoute("/alerts" as const),
} as const;

const AdminRoutes = {
  base: defineRoute("/admin" as const),
  registrars: defineRoute("/admin/registrars" as const),
  courts: defineRoute("/admin/courts" as const),
  calendar: defineRoute("/admin/calendar" as const),
  lawyers: defineRoute("/admin/lawyers" as const),
  consensus: defineRoute("/admin/consensus" as const),
} as const;

const SettingsRoutes = {
  base: defineRoute("/settings" as const),
} as const;

export const RouteConstants = {
  auth: AuthRoutes,
  today: TodayRoutes,
  courtrooms: CourtroomRoutes,
  broadcasts: BroadcastRoutes,
  dateRequests: DateRequestRoutes,
  diary: DiaryRoutes,
  alerts: AlertRoutes,
  admin: AdminRoutes,
  settings: SettingsRoutes,
} as const;
