/**
 * Domain vocabulary shared by the lawyer dashboard and the registrar portal.
 *
 * Hierarchy: Court system → Division → Complex → Courtroom → Judge (current
 * assignment). A judge's link to a courtroom changes over time (transfers,
 * leave, retirement), so it is modelled as an assignment with a date range.
 *
 * Naming: "chambers" always means a JUDGE's chambers (the private office
 * behind the courtroom). A law firm is a "firm", never "chambers".
 */

// ── Structure ──────────────────────────────────────────────────────────────

export type CourtSystem = "LSHC" | "FHC" | "NICN" | "MAGISTRATE";

export const COURT_SYSTEM_LABEL: Record<CourtSystem, string> = {
  LSHC: "High Court of Lagos State",
  FHC: "Federal High Court",
  NICN: "National Industrial Court",
  MAGISTRATE: "Magistrate Court",
};

export interface IJudicialDivision {
  id: string;
  name: string;
  state: string;
  court_system: CourtSystem;
}

export interface ICourtComplex {
  id: string;
  name: string;
  division_id: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface IJudge {
  id: string;
  /** "Hon. Justice" for High Court judges, "His/Her Worship" for magistrates. */
  title: string;
  name: string;
}

export interface IJudgeAssignment {
  id: string;
  courtroom_id: string;
  judge: IJudge;
  start_date: string;
  /** Null while the assignment is current. */
  end_date?: string | null;
}

export interface ICourtroom {
  id: string;
  name: string;
  complex_id: string;
  division_id: string;
  court_system?: CourtSystem;
  /** Denormalised for display. */
  complex_name?: string;
  division_name?: string;
  /** Current assignment, if any. */
  judge?: IJudge | null;
  /** Legacy flat field; prefer `judge`. */
  judge_name?: string;
  /** Usual start of sitting, "09:00". */
  default_sitting_time?: string;
}

// ── The sitting: a courtroom on a given day ────────────────────────────────

/**
 * Sitting state machine per courtroom-day. "No status yet" is `null`.
 *
 *   (unknown) → SITTING | SITTING_LATE | NOT_SITTING
 *   SITTING / SITTING_LATE → ON_BENCH ⇄ IN_RECESS → ROSE
 *
 * A registrar post (OFFICIAL) always overrides crowd reports; crowd reports
 * reach VERIFIED only through consensus.
 */
export const COURT_STATUSES = [
  "SITTING",
  "SITTING_LATE",
  "ON_BENCH",
  "IN_RECESS",
  "ROSE",
  "NOT_SITTING",
] as const;
export type CourtStatus = (typeof COURT_STATUSES)[number];

/** The four micro-statuses a Spotter can tap (PRD M2). */
export const SPOTTER_STATUSES = [
  "ON_BENCH",
  "SITTING_LATE",
  "IN_RECESS",
  "NOT_SITTING",
] as const satisfies readonly CourtStatus[];

export const COURT_STATUS_LABEL: Record<CourtStatus, string> = {
  SITTING: "Sitting today",
  SITTING_LATE: "Sitting late",
  ON_BENCH: "Judge on bench",
  IN_RECESS: "In recess",
  ROSE: "Court rose",
  NOT_SITTING: "Not sitting",
};

/** Valid next states from each state, for the registrar's controls. */
export const COURT_STATUS_TRANSITIONS: Record<
  CourtStatus | "UNKNOWN",
  CourtStatus[]
> = {
  UNKNOWN: ["SITTING", "SITTING_LATE", "NOT_SITTING"],
  SITTING: ["ON_BENCH", "SITTING_LATE", "NOT_SITTING"],
  SITTING_LATE: ["ON_BENCH", "NOT_SITTING"],
  ON_BENCH: ["IN_RECESS", "ROSE"],
  IN_RECESS: ["ON_BENCH", "ROSE"],
  ROSE: ["ON_BENCH"],
  NOT_SITTING: ["SITTING", "SITTING_LATE"],
};

export const NOT_SITTING_REASONS = [
  "INDISPOSED",
  "ON_LEAVE",
  "OFFICIAL_ENGAGEMENT",
  "CHAMBERS_MEETING",
  "TRAINING",
  "PUBLIC_HOLIDAY",
  "STRIKE",
  "VACATION",
  "OTHER",
] as const;
export type NotSittingReason = (typeof NOT_SITTING_REASONS)[number];

export const NOT_SITTING_REASON_LABEL: Record<NotSittingReason, string> = {
  INDISPOSED: "Judge indisposed",
  ON_LEAVE: "Judge on leave",
  OFFICIAL_ENGAGEMENT: "Official engagement",
  CHAMBERS_MEETING: "Meeting in chambers",
  TRAINING: "Judicial training",
  PUBLIC_HOLIDAY: "Public holiday",
  STRIKE: "Staff strike",
  VACATION: "Court vacation",
  OTHER: "Other",
};

export type VerificationLevel = "UNVERIFIED" | "VERIFIED" | "OFFICIAL";
export type ReportSource = "REGISTRAR" | "SPOTTER";

export interface ICourtroomStatus {
  courtroom_id: string;
  status: CourtStatus;
  verification: VerificationLevel;
  source?: ReportSource;
  report_count: number;
  reported_at: string;
  /** Why the court isn't sitting / is late. */
  reason?: NotSittingReason | null;
  /** For SITTING_LATE / SITTING: expected start, "11:30". */
  expected_start?: string | null;
  /** For ON_LEAVE etc.: last day the judge is away, YYYY-MM-DD. */
  until_date?: string | null;
  /** Free-text detail, e.g. "resumes 11:30 after chambers meeting". */
  note?: string | null;
}

/** One raw report behind a status: from a registrar or a spotter. */
export interface IStatusReport {
  id: string;
  courtroom_id: string;
  status: CourtStatus;
  source: ReportSource;
  reporter_name: string;
  verification: VerificationLevel;
  note?: string | null;
  created_at: string;
}

// ── Cases & the cause list ─────────────────────────────────────────────────

/** What is supposed to happen to a case on a given day. */
export const BUSINESS_TYPES = [
  "MENTION",
  "HEARING",
  "MOTION",
  "ADOPTION",
  "RULING",
  "JUDGMENT",
] as const;
export type BusinessOfDay = (typeof BUSINESS_TYPES)[number];

export const BUSINESS_LABEL: Record<BusinessOfDay, string> = {
  MENTION: "Mention",
  HEARING: "Hearing / trial",
  MOTION: "Motion",
  ADOPTION: "Adoption of written addresses",
  RULING: "Ruling",
  JUDGMENT: "Judgment",
};

/** What actually happened to a listed case. */
export const APPEARANCE_OUTCOMES = [
  "PENDING",
  "CALLED",
  "STOOD_DOWN",
  "HEARD",
  "ADJOURNED",
  "RESERVED",
  "STRUCK_OUT",
] as const;
export type AppearanceOutcome = (typeof APPEARANCE_OUTCOMES)[number];

export const OUTCOME_LABEL: Record<AppearanceOutcome, string> = {
  PENDING: "Not yet called",
  CALLED: "Being heard",
  STOOD_DOWN: "Stood down",
  HEARD: "Heard",
  ADJOURNED: "Adjourned",
  RESERVED: "Judgment reserved",
  STRUCK_OUT: "Struck out",
};

export interface ICase {
  id: string;
  /** As written by whoever entered it: "LD/1234/2023", "ld 1234 23"… */
  suit_number: string;
  /** Canonical form used for matching. */
  suit_number_normalized: string;
  title: string;
  courtroom_id: string;
}

/** A case listed on a specific day's cause list (a "case appearance"). */
export interface ICauseListItem {
  id: string;
  item_number: number;
  suit_number: string;
  suit_number_normalized?: string;
  /** "Adeyemi v. Lekki Pearl Estates Ltd" */
  title?: string;
  /** Legacy OCR field; same as `title`. */
  parties?: string;
  business?: BusinessOfDay;
  claimant_counsel?: string;
  defendant_counsel?: string;
  /** Legacy OCR field. */
  counsel?: string[];
  outcome?: AppearanceOutcome;
  /** Set when ADJOURNED / RESERVED. YYYY-MM-DD. */
  next_date?: string | null;
  next_business?: BusinessOfDay | null;
  note?: string | null;
}

export interface ICauseList {
  id: string;
  courtroom_id: string;
  /** YYYY-MM-DD */
  date: string;
  status: "DRAFT" | "PUBLISHED";
  published_at?: string | null;
  source: "REGISTRAR" | "OCR";
  items: ICauseListItem[];
  /** item id currently being heard. */
  current_item_id?: string | null;
}

export interface ICauseListScan {
  id: string;
  courtroom_id: string;
  image_url: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  extracted_items: ICauseListItem[];
  /** Suit numbers that matched a watchlist. */
  matched_suit_numbers?: string[];
  created_at: string;
}

/** Live "order of business" in the Virtual Dock (PRD M5). */
export interface IDockEntry {
  courtroom_id: string;
  current_item: number;
  total_items: number;
  updated_at: string;
  source: ReportSource;
  current_title?: string | null;
  current_suit_number?: string | null;
}

// ── Broadcasts ─────────────────────────────────────────────────────────────

export interface IBroadcast {
  id: string;
  courtroom_id?: string | null;
  division_id: string;
  severity?: "INFO" | "URGENT";
  message: string;
  created_at: string;
  created_by: string;
  author_name?: string;
  courtroom_name?: string | null;
  expires_at?: string | null;
}

// ── Calendar & the judge's diary ───────────────────────────────────────────

/** A period when regular courts don't sit: vacations, public holidays. */
export interface ICalendarPeriod {
  id: string;
  name: string;
  kind: "VACATION" | "PUBLIC_HOLIDAY" | "OTHER";
  start_date: string;
  end_date: string;
  /** Null = every court system. */
  court_system?: CourtSystem | null;
}

/** One day of a judge's diary, for "taking a date". */
export interface IDiaryDay {
  date: string;
  booked: number;
  capacity: number;
  blocked: boolean;
  block_reason?: string | null;
}

// ── Lawyer-side ────────────────────────────────────────────────────────────

/** A lawyer's watched matter (PRD M1). */
export interface IWatchlistCase {
  id: string;
  suit_number: string;
  title?: string;
  division_id: string;
  courtroom_id: string;
  scheduled_date: string;
  /** Position on today's cause list, once a list or scan matched it. */
  cause_list_item?: number;
  /** "CLAIMANT" | "DEFENDANT" — which side the lawyer is on. */
  side?: "CLAIMANT" | "DEFENDANT";
  created_at: string;
  // Enriched on read:
  courtroom?: ICourtroom;
  status?: ICourtroomStatus | null;
  appearance?: ICauseListItem | null;
  dock?: IDockEntry | null;
  history?: (ICauseListItem & { date: string })[];
}

export type BriefHoldingMatterType = "ADJOURNMENT" | "MENTION" | "DATE_TAKING";

export type BriefHoldingStatus =
  "OPEN" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DISPUTED";

/** A "Next-Door Counsel" request (PRD M4). */
export interface IBriefHoldingRequest {
  id: string;
  suit_number: string;
  title?: string;
  courtroom_id: string;
  complex_id: string;
  courtroom_name?: string;
  complex_name?: string;
  matter_type: BriefHoldingMatterType;
  instructions?: string;
  fee_amount: number;
  currency: "NGN";
  status: BriefHoldingStatus;
  requested_by: string;
  requester_name?: string;
  requester_firm?: string;
  accepted_by?: string;
  holder_name?: string;
  scheduled_date: string;
  session_notes?: string;
  created_at: string;
}

export interface IRemoteDateRequest {
  id: string;
  suit_number: string;
  title?: string;
  courtroom_id: string;
  courtroom_name?: string;
  proposed_dates: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  approved_date?: string;
  requested_by: string;
  requester_name?: string;
  note?: string | null;
  created_at: string;
}

export interface IPulseCreditLedgerEntry {
  id: string;
  amount: number;
  reason: "EARLY_VERIFIED_REPORT" | "REDEEMED_DISCOUNT" | "REDEEMED_ANALYTICS";
  created_at: string;
  note?: string;
}

export interface INotification {
  id: string;
  title: string;
  body: string;
  kind:
    | "STATUS_VERIFIED"
    | "STATUS_OFFICIAL"
    | "CAUSE_LIST_MATCH"
    | "CAUSE_LIST_PUBLISHED"
    | "BROADCAST"
    | "BRIEF"
    | "REMOTE_DATE"
    | "ADJOURNED"
    | "CALLED";
  read: boolean;
  link?: string;
  created_at: string;
}

/** Pushed on the live event stream; clients refetch what the event touches. */
export interface ILiveEvent {
  type:
    | "STATUS"
    | "CAUSE_LIST"
    | "DOCK"
    | "BROADCAST"
    | "REMOTE_DATE"
    | "BRIEF"
    | "NOTIFICATION"
    | "ADMIN";
  courtroom_id?: string;
  /** Present on NOTIFICATION events addressed to the connected user. */
  notification?: INotification;
  at: string;
}

// ── Alerts & activity (what the registrar's actions reached) ───────────────

export type AlertKind =
  | "STATUS"
  | "BROADCAST"
  | "ADJOURNMENT"
  | "CALLED"
  | "CAUSE_LIST"
  | "REMOTE_DATE";

/** One SMS/WhatsApp dispatch triggered by a registrar action. */
export interface IAlertDispatch {
  id: string;
  courtroom_id: string | null;
  kind: AlertKind;
  message: string;
  /** Unique counsel reached. */
  recipients: number;
  sms: number;
  whatsapp: number;
  delivered: number;
  failed: number;
  actor: string;
  created_at: string;
}

export interface IActivity {
  id: string;
  actor: string;
  action: string;
  target: string;
  courtroom_id?: string | null;
  created_at: string;
}
