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
  registrar: {
    myCourtrooms: "get-my-courtrooms",
    broadcasts: "get-broadcasts",
    dock: "get-registrar-dock",
    remoteDates: "get-remote-date-requests",
  },
  admin: {
    registrars: "get-admin-registrars",
    lawyers: "get-admin-lawyers",
    disputes: "get-admin-disputes",
    escrow: "get-admin-escrow",
    consensus: "get-admin-consensus",
  },
} as const;
