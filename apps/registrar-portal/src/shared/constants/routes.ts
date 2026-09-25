import { defineRoute } from "@repo/utils";

const AuthRoutes = {
  login: defineRoute("/auth/login" as const),
  // Registrars are onboarded by email invitation (PRD §2).
  acceptInvite: defineRoute("/auth/invite/:token" as const),
} as const;

// Module 3 — Registrar console: 1-tap status for the registrar's courtrooms.
const ConsoleRoutes = {
  base: defineRoute("/" as const),
} as const;

// Module 3 — Direct broadcasts
const BroadcastRoutes = {
  base: defineRoute("/broadcasts" as const),
  new: defineRoute("/broadcasts/new" as const),
} as const;

// Module 5 — Live order of business + remote date confirmations
const DockRoutes = {
  base: defineRoute("/dock" as const),
  courtroom: defineRoute("/dock/:courtroomId" as const),
  remoteDates: defineRoute("/remote-dates" as const),
} as const;

// Module 1 — Registrars can also upload the official cause list
const CauseListRoutes = {
  base: defineRoute("/cause-list" as const),
} as const;

// System Admin — verification, disputes, escrow
const AdminRoutes = {
  base: defineRoute("/admin" as const),
  registrars: defineRoute("/admin/registrars" as const),
  lawyers: defineRoute("/admin/lawyers" as const),
  disputes: defineRoute("/admin/disputes" as const),
  escrow: defineRoute("/admin/escrow" as const),
  consensus: defineRoute("/admin/consensus" as const),
} as const;

const SettingsRoutes = {
  base: defineRoute("/settings" as const),
} as const;

export const RouteConstants = {
  auth: AuthRoutes,
  console: ConsoleRoutes,
  broadcasts: BroadcastRoutes,
  dock: DockRoutes,
  causeList: CauseListRoutes,
  admin: AdminRoutes,
  settings: SettingsRoutes,
} as const;
