export const customQueryKey = {
  auth: {
    getMe: "get-me",
  },
  courts: {
    divisions: "get-divisions",
    complexes: "get-complexes",
    courtrooms: "get-courtrooms",
    courtroomStatus: "get-courtroom-status",
    liveBoard: "get-live-board",
  },
  watchlist: {
    getAll: "get-watchlist",
    getById: "get-watchlist-case",
    todayMatches: "get-watchlist-today",
  },
  causeList: {
    scans: "get-cause-list-scans",
    scanById: "get-cause-list-scan",
  },
  pulse: {
    myCheckIn: "get-my-check-in",
  },
  briefs: {
    getAll: "get-briefs",
    getById: "get-brief",
    mine: "get-my-briefs",
    nearby: "get-nearby-briefs",
  },
  dock: {
    byCourtroom: "get-dock",
    remoteDateRequests: "get-remote-date-requests",
  },
  wallet: {
    summary: "get-wallet",
    credits: "get-credits-ledger",
    escrow: "get-escrow-ledger",
  },
  notifications: {
    getAll: "get-notifications",
    preferences: "get-notification-preferences",
  },
} as const;
