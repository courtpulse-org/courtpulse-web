import { defineRoute } from "@repo/utils";

// Routes sectioned by feature module. Each entry has `.path` for the router
// and `.generate(params, query)` for building links.

const AuthRoutes = {
  login: defineRoute("/auth/login" as const),
  verifyOtp: defineRoute("/auth/verify" as const),
  signup: defineRoute("/auth/signup" as const),
} as const;

const OverviewRoutes = {
  base: defineRoute("/" as const),
} as const;

// Module 1 — Self-serve case watchlist
const WatchlistRoutes = {
  base: defineRoute("/watchlist" as const),
  new: defineRoute("/watchlist/new" as const),
  details: defineRoute("/watchlist/:id" as const),
} as const;

// Module 1 — AI cause list scanner
const CauseListRoutes = {
  base: defineRoute("/cause-list" as const),
  scan: defineRoute("/cause-list/scan" as const),
  scanResult: defineRoute("/cause-list/scans/:id" as const),
} as const;

// Module 2 — Crowdsourced verification ("Waze for Courts")
const PulseRoutes = {
  base: defineRoute("/pulse" as const),
  courtroom: defineRoute("/pulse/courtrooms/:id" as const),
} as const;

// Module 4 — "Next-Door Counsel" brief-holding marketplace
const BriefHoldingRoutes = {
  base: defineRoute("/briefs" as const),
  new: defineRoute("/briefs/new" as const),
  mine: defineRoute("/briefs/mine" as const),
  details: defineRoute("/briefs/:id" as const),
} as const;

// Module 5 — Virtual dock & remote date-taking
const VirtualDockRoutes = {
  base: defineRoute("/dock" as const),
  courtroom: defineRoute("/dock/:courtroomId" as const),
  remoteDate: defineRoute("/dock/:courtroomId/remote-date" as const),
} as const;

// Gamification — Pulse Credits wallet + escrow
const WalletRoutes = {
  base: defineRoute("/wallet" as const),
  credits: defineRoute("/wallet/credits" as const),
  escrow: defineRoute("/wallet/escrow" as const),
} as const;

const NotificationRoutes = {
  base: defineRoute("/notifications" as const),
} as const;

const SettingsRoutes = {
  base: defineRoute("/settings" as const),
  profile: defineRoute("/settings/profile" as const),
  notifications: defineRoute("/settings/notifications" as const),
} as const;

export const RouteConstants = {
  auth: AuthRoutes,
  overview: OverviewRoutes,
  watchlist: WatchlistRoutes,
  causeList: CauseListRoutes,
  pulse: PulseRoutes,
  briefs: BriefHoldingRoutes,
  dock: VirtualDockRoutes,
  wallet: WalletRoutes,
  notifications: NotificationRoutes,
  settings: SettingsRoutes,
} as const;

export type AppRoutes = typeof RouteConstants;
