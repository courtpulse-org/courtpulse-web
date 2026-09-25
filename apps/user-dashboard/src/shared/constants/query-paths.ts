/** Backend endpoint paths, relative to VITE_API_BASE_URL. */
export const QUERY_PATH = {
  auth: {
    requestOtp: "auth/otp/request",
    verifyOtp: "auth/otp/verify",
    register: "auth/register/lawyer",
    me: "auth/me",
    logout: "auth/logout",
  },
  courts: {
    divisions: "courts/divisions",
    complexes: "courts/complexes",
    courtrooms: "courts/courtrooms",
    courtroomStatus: "courts/courtrooms/:id/status",
    liveBoard: "courts/live",
  },
  watchlist: {
    base: "watchlist",
    byId: "watchlist/:id",
    todayMatches: "watchlist/today",
  },
  causeList: {
    scans: "cause-lists/scans",
    scanById: "cause-lists/scans/:id",
  },
  pulse: {
    checkIn: "pulse/check-in",
    checkOut: "pulse/check-out",
    report: "pulse/reports",
    myCheckIn: "pulse/check-in/me",
  },
  briefs: {
    base: "briefs",
    byId: "briefs/:id",
    accept: "briefs/:id/accept",
    complete: "briefs/:id/complete",
    cancel: "briefs/:id/cancel",
    mine: "briefs/mine",
    nearby: "briefs/nearby",
  },
  dock: {
    byCourtroom: "dock/:courtroomId",
    remoteDateRequests: "dock/remote-dates",
  },
  wallet: {
    summary: "wallet",
    credits: "wallet/credits",
    escrow: "wallet/escrow",
    fund: "wallet/escrow/fund",
  },
  notifications: {
    base: "notifications",
    markRead: "notifications/:id/read",
    preferences: "notifications/preferences",
  },
  users: {
    me: "users/me",
  },
} as const;

/** Replace `:param` segments in a QUERY_PATH string. */
export function withParams(
  path: string,
  params: Record<string, string | number>,
) {
  return path.replace(/:([a-zA-Z0-9_]+)/g, (_, key) =>
    encodeURIComponent(String(params[key])),
  );
}
