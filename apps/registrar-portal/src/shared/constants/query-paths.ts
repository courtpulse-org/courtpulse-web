/** Backend endpoint paths, relative to VITE_API_BASE_URL. */
export const QUERY_PATH = {
  auth: {
    login: "auth/staff/login",
    acceptInvite: "auth/staff/invite/:token/accept",
    me: "auth/me",
  },
  courts: {
    divisions: "courts/divisions",
    complexes: "courts/complexes",
    courtrooms: "courts/courtrooms",
    courtroomStatus: "courts/courtrooms/:id/status",
    liveBoard: "courts/live",
  },
  registrar: {
    myCourtrooms: "registrar/courtrooms",
    postStatus: "registrar/courtrooms/:id/status",
    broadcasts: "registrar/broadcasts",
    dock: "registrar/dock/:courtroomId",
    remoteDates: "registrar/remote-dates",
    decideRemoteDate: "registrar/remote-dates/:id/decision",
    causeLists: "registrar/cause-lists",
  },
  admin: {
    registrars: "admin/registrars",
    inviteRegistrar: "admin/registrars/invite",
    verifyRegistrar: "admin/registrars/:id/verify",
    lawyers: "admin/lawyers",
    verifyLawyer: "admin/lawyers/:id/verify",
    disputes: "admin/disputes",
    resolveDispute: "admin/disputes/:id/resolve",
    escrow: "admin/escrow",
    consensus: "admin/consensus-config",
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
