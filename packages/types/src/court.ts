/**
 * Domain vocabulary shared by the lawyer dashboard and the registrar portal.
 * The two apps never import each other, so anything both need to agree on —
 * a status label, an enum value the backend accepts — lives here.
 */

/** The 1-tap micro-statuses a Spotter or Registrar can post (PRD §3, M2/M3). */
export const COURT_STATUSES = [
  "NOT_SITTING",
  "SITTING_LATE",
  "ON_BENCH",
  "IN_RECESS",
] as const;
export type CourtStatus = (typeof COURT_STATUSES)[number];

export const COURT_STATUS_LABEL: Record<CourtStatus, string> = {
  NOT_SITTING: "Court Not Sitting",
  SITTING_LATE: "Sitting Late",
  ON_BENCH: "Judge on Bench",
  IN_RECESS: "Court in Recess",
};

/**
 * Consensus level of a courtroom status. One report = UNVERIFIED; two or
 * three independent reports of the same status in the same courtroom promote
 * it to VERIFIED. A registrar post is OFFICIAL and skips consensus.
 */
export type VerificationLevel = "UNVERIFIED" | "VERIFIED" | "OFFICIAL";

export interface IJudicialDivision {
  id: string;
  name: string;
  state: string;
}

export interface ICourtComplex {
  id: string;
  name: string;
  division_id: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface ICourtroom {
  id: string;
  name: string;
  complex_id: string;
  division_id: string;
  judge_name?: string;
}

export interface ICourtroomStatus {
  courtroom_id: string;
  status: CourtStatus;
  verification: VerificationLevel;
  report_count: number;
  reported_at: string;
  /** Free-text detail from a registrar broadcast, e.g. "resumes 11:30". */
  note?: string;
}

export interface IBroadcast {
  id: string;
  courtroom_id?: string;
  division_id: string;
  message: string;
  created_at: string;
  created_by: string;
  expires_at?: string;
}

/** A lawyer's watched matter (PRD §3, M1). */
export interface IWatchlistCase {
  id: string;
  suit_number: string;
  title?: string;
  division_id: string;
  courtroom_id: string;
  scheduled_date: string;
  /** Position on today's cause list, once an OCR scan or registrar matched it. */
  cause_list_item?: number;
  created_at: string;
}

export interface ICauseListScan {
  id: string;
  courtroom_id: string;
  image_url: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  extracted_items: ICauseListItem[];
  created_at: string;
}

export interface ICauseListItem {
  item_number: number;
  suit_number: string;
  parties?: string;
  counsel?: string[];
}

/** Live "order of business" entry in the Virtual Dock (PRD §3, M5). */
export interface IDockEntry {
  courtroom_id: string;
  current_item: number;
  total_items: number;
  updated_at: string;
  source: "REGISTRAR" | "SPOTTER";
}

export type BriefHoldingMatterType = "ADJOURNMENT" | "MENTION" | "DATE_TAKING";

export type BriefHoldingStatus =
  "OPEN" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DISPUTED";

/** A "Next-Door Counsel" request (PRD §3, M4). */
export interface IBriefHoldingRequest {
  id: string;
  suit_number: string;
  courtroom_id: string;
  complex_id: string;
  matter_type: BriefHoldingMatterType;
  instructions?: string;
  fee_amount: number;
  currency: "NGN";
  status: BriefHoldingStatus;
  requested_by: string;
  accepted_by?: string;
  scheduled_date: string;
  session_notes?: string;
  created_at: string;
}

export interface IRemoteDateRequest {
  id: string;
  suit_number: string;
  courtroom_id: string;
  proposed_dates: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  approved_date?: string;
  requested_by: string;
  created_at: string;
}

export interface IPulseCreditLedgerEntry {
  id: string;
  amount: number;
  reason: "EARLY_VERIFIED_REPORT" | "REDEEMED_DISCOUNT" | "REDEEMED_ANALYTICS";
  created_at: string;
}
