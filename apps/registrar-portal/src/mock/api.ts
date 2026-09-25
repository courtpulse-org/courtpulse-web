import type {
  AlertKind,
  AppearanceOutcome,
  BusinessOfDay,
  CourtStatus,
  IActivity,
  IAlertDispatch,
  IBroadcast,
  ICalendarPeriod,
  ICauseList,
  ICauseListItem,
  ICourtroom,
  ICourtroomStatus,
  IDiaryDay,
  IAuthTokens,
  IDockEntry,
  IJudge,
  IJudgeAssignment,
  IRemoteDateRequest,
  IStatusReport,
  IUser,
  NotSittingReason,
} from "@repo/types";
import {
  COURT_STATUS_LABEL,
  NOT_SITTING_REASON_LABEL,
  OUTCOME_LABEL,
  BUSINESS_LABEL,
} from "@repo/types";
import { getToken } from "@/lib/storage";
import { getDb, resetDb, save } from "./db";
import {
  addDays,
  addWorkingDays,
  isWeekend,
  normalizeSuitNumber,
  pick,
  rng,
  todayLagos,
  uid,
} from "./lib";

// ── Plumbing ────────────────────────────────────────────────────────────────

/** Every call resolves after a short, slightly random delay, like a network. */
const wait = (ms = 220) =>
  new Promise((r) => setTimeout(r, ms + Math.random() * 180));

class MockApiError extends Error {
  response: { status: number; data: { message: string } };
  constructor(status: number, message: string) {
    super(message);
    this.response = { status, data: { message } };
  }
}

const fail = (status: number, message: string): never => {
  throw new MockApiError(status, message);
};

/** Same envelope as the NestJS backend, so hooks read `.data` either way. */
const ok = <T>(data: T) => ({
  success: true,
  status: "success",
  status_code: 200,
  message: "OK",
  data,
  timestamp: new Date().toISOString(),
});

const now = () => new Date().toISOString();

function me(): any {
  const token = getToken().accessToken;
  const id = token?.startsWith("demo-") ? token.slice(5) : null;
  const user = id ? getDb().users.find((u: any) => u.id === id) : null;
  if (!user) fail(401, "Your session has ended. Please sign in again.");
  return user;
}

const fullName = (u: any) => `${u.first_name} ${u.last_name}`;
const isAdmin = (u: any) => u.role === "ADMIN";

function myCourtroomIds(): string[] {
  const u = me();
  return isAdmin(u)
    ? getDb().courtrooms.map((c: any) => c.id)
    : (u.courtroom_ids ?? []);
}

function assertManages(courtroomId: string) {
  if (!myCourtroomIds().includes(courtroomId)) {
    fail(403, "You don't manage this courtroom.");
  }
}

function publicUser(u: any): IUser {
  const { password: _pw, ...rest } = u;
  void _pw;
  return rest;
}

// ── Courts ──────────────────────────────────────────────────────────────────

function judgeFor(courtroomId: string): IJudge | null {
  const db = getDb();
  const a = db.judge_assignments.find(
    (x: any) => x.courtroom_id === courtroomId && !x.end_date,
  );
  return a ? (db.judges.find((j: any) => j.id === a.judge_id) ?? null) : null;
}

export function enrichCourtroom(c: any): ICourtroom {
  const db = getDb();
  const complex = db.complexes.find((x: any) => x.id === c.complex_id);
  const division = db.divisions.find((x: any) => x.id === c.division_id);
  const judge = judgeFor(c.id);
  return {
    id: c.id,
    name: c.name,
    complex_id: c.complex_id,
    division_id: c.division_id,
    court_system: division?.court_system,
    complex_name: complex?.name,
    division_name: division?.name,
    judge,
    judge_name: judge ? `${judge.title} ${judge.name}` : undefined,
    default_sitting_time: c.default_sitting_time,
  };
}

function courtroomById(id: string) {
  const c = getDb().courtrooms.find((x: any) => x.id === id);
  if (!c) fail(404, "Courtroom not found");
  return c;
}

/** "Ikeja Court 5" */
function roomLabel(id: string) {
  const c = enrichCourtroom(courtroomById(id));
  const place =
    c.complex_name?.replace(/^(High Court|Federal High Court), /, "") ?? "";
  return c.complex_name?.startsWith("Federal")
    ? `FHC ${c.name}`
    : `${place} ${c.name}`;
}

const statusKey = (id: string, date: string) => `${id}|${date}`;

function statusFor(id: string, date = todayLagos()): ICourtroomStatus | null {
  return getDb().statuses[statusKey(id, date)] ?? null;
}

function listFor(
  courtroomId: string,
  date = todayLagos(),
  create = true,
): ICauseList {
  const db = getDb();
  let list = db.cause_lists.find(
    (l: any) => l.courtroom_id === courtroomId && l.date === date,
  );
  if (!list && create) {
    list = {
      id: uid("cl"),
      courtroom_id: courtroomId,
      date,
      status: "DRAFT",
      published_at: null,
      source: "REGISTRAR",
      items: [],
      current_item_id: null,
    };
    db.cause_lists.push(list);
  }
  return list;
}

function dockFor(list: ICauseList | null): IDockEntry | null {
  if (!list || list.items.length === 0) return null;
  const cur = list.items.find((i) => i.id === list.current_item_id);
  return {
    courtroom_id: list.courtroom_id,
    current_item: cur?.item_number ?? 0,
    total_items: list.items.length,
    updated_at: now(),
    source: "REGISTRAR",
    current_title: cur?.title ?? null,
    current_suit_number: cur?.suit_number ?? null,
  };
}

/** Counsel an alert about this courtroom reaches: subscribers + counsel on today's list. */
function reachFor(courtroomId: string) {
  const db = getDb();
  const list = listFor(courtroomId, todayLagos(), false);
  const onList = new Set<string>();
  list?.items.forEach((i) => {
    if (i.claimant_counsel) onList.add(i.claimant_counsel);
    if (i.defendant_counsel) onList.add(i.defendant_counsel);
  });
  const recipients = (db.subscribers[courtroomId] ?? 20) + onList.size;
  return {
    recipients,
    sms: recipients,
    whatsapp: Math.round(recipients * 0.82),
  };
}

/** Counsel on specific items (for per-matter notices). */
function reachForItems(items: ICauseListItem[]) {
  const counsel = new Set<string>();
  items.forEach((i) => {
    if (i.claimant_counsel) counsel.add(i.claimant_counsel);
    if (i.defendant_counsel) counsel.add(i.defendant_counsel);
  });
  const recipients = Math.max(counsel.size, items.length);
  return {
    recipients,
    sms: recipients,
    whatsapp: Math.round(recipients * 0.8),
  };
}

function dispatch(
  courtroomId: string | null,
  kind: AlertKind,
  message: string,
  reach = courtroomId
    ? reachFor(courtroomId)
    : { recipients: 0, sms: 0, whatsapp: 0 },
): IAlertDispatch {
  const alert: IAlertDispatch = {
    id: uid("al"),
    courtroom_id: courtroomId,
    kind,
    message,
    ...reach,
    delivered: reach.recipients,
    failed: 0,
    actor: fullName(me()),
    created_at: now(),
  };
  getDb().alerts.unshift(alert);
  return alert;
}

function logActivity(
  action: string,
  courtroomId: string | null,
  target?: string,
) {
  getDb().activity.unshift({
    id: uid("act"),
    actor: fullName(me()),
    action,
    target: target ?? (courtroomId ? roomLabel(courtroomId) : "All courts"),
    courtroom_id: courtroomId,
    created_at: now(),
  });
}

// ── Auth ────────────────────────────────────────────────────────────────────

export const DEMO_ACCOUNTS = [
  {
    label: "Court Registrar",
    name: "Grace Adeniyi",
    detail: "Ikeja Courts 1, 2 & 5",
    email: "registrar@courtpulse.ng",
    password: "Registrar12345!",
  },
  {
    label: "Court Registrar",
    name: "Samuel Etim",
    detail: "Igbosere Courts 3, 7 & 11",
    email: "s.etim@courtpulse.ng",
    password: "Registrar12345!",
  },
  {
    label: "Platform Admin",
    name: "Olumide Coker",
    detail: "All courts",
    email: "admin@courtpulse.ng",
    password: "Admin12345!",
  },
];

export async function login(data: { email: string; password: string }) {
  await wait(500);
  const u = getDb().users.find(
    (x: any) =>
      x.email?.toLowerCase() === data.email.trim().toLowerCase() &&
      x.role !== "LAWYER",
  );
  if (!u || u.password !== data.password)
    fail(401, "Incorrect email or password.");
  const tokens: IAuthTokens & { user: IUser } = {
    access_token: `demo-${u.id}`,
    user: publicUser(u),
  };
  return ok(tokens);
}

export async function acceptInvite(data: {
  token: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
}) {
  await wait(600);
  const db = getDb();
  const invite = db.invites.find((i: any) => i.token === data.token);
  const user = {
    id: uid("u-reg"),
    role: "REGISTRAR",
    first_name: data.first_name,
    last_name: data.last_name,
    phone: data.phone,
    email: invite?.email ?? `${data.first_name.toLowerCase()}@courtpulse.ng`,
    password: data.password,
    staff_title: "Court Registrar",
    courtroom_ids: invite?.courtroom_ids ?? [],
    is_verified: false,
    created_at: now(),
  };
  db.users.push(user);
  save();
  const tokens: IAuthTokens & { user: IUser } = {
    access_token: `demo-${user.id}`,
    user: publicUser(user),
  };
  return ok(tokens);
}

export async function getMe() {
  await wait(120);
  return ok(publicUser(me()));
}

export function resetDemoData() {
  resetDb();
}

// ── Today console ───────────────────────────────────────────────────────────

export interface RegistrarCourtroom {
  courtroom: ICourtroom;
  status: ICourtroomStatus | null;
  dock: IDockEntry | null;
  list: {
    id: string;
    status: ICauseList["status"];
    total: number;
    pending: number;
    done: number;
    adjourned: number;
  } | null;
  /** Latest spotter report that disagrees with the official status. */
  crowd_conflict: IStatusReport | null;
  pending_date_requests: number;
  reach: { recipients: number; sms: number; whatsapp: number };
  /** Non-sitting calendar period covering the date, if any. */
  calendar_period: ICalendarPeriod | null;
}

function calendarPeriodFor(
  courtroomId: string,
  date: string,
): ICalendarPeriod | null {
  const db = getDb();
  const system = enrichCourtroom(courtroomById(courtroomId)).court_system;
  return (
    db.calendar.find(
      (p: any) =>
        p.start_date <= date &&
        p.end_date >= date &&
        (!p.court_system || p.court_system === system),
    ) ?? null
  );
}

function summarise(courtroomId: string, date: string): RegistrarCourtroom {
  const db = getDb();
  const list = listFor(courtroomId, date, false);
  const status = statusFor(courtroomId, date);
  const items = list?.items ?? [];
  const conflict =
    status?.source === "REGISTRAR"
      ? (db.status_reports
          .filter(
            (r: any) =>
              r.courtroom_id === courtroomId &&
              r.date === date &&
              r.source === "SPOTTER" &&
              !r.dismissed &&
              r.created_at > status.reported_at &&
              r.status !== status.status,
          )
          .sort((a: any, b: any) =>
            b.created_at.localeCompare(a.created_at),
          )[0] ?? null)
      : null;
  return {
    courtroom: enrichCourtroom(courtroomById(courtroomId)),
    status,
    dock: date === todayLagos() ? dockFor(list) : null,
    list: list
      ? {
          id: list.id,
          status: list.status,
          total: items.length,
          pending: items.filter(
            (i) =>
              i.outcome === "PENDING" ||
              i.outcome === "STOOD_DOWN" ||
              i.outcome === "CALLED",
          ).length,
          done: items.filter((i) =>
            ["HEARD", "ADJOURNED", "RESERVED", "STRUCK_OUT"].includes(
              i.outcome ?? "",
            ),
          ).length,
          adjourned: items.filter((i) => i.outcome === "ADJOURNED").length,
        }
      : null,
    crowd_conflict: conflict,
    pending_date_requests: db.remote_dates.filter(
      (r: any) => r.courtroom_id === courtroomId && r.status === "PENDING",
    ).length,
    reach: reachFor(courtroomId),
    calendar_period: calendarPeriodFor(courtroomId, date),
  };
}

export async function getMyCourtrooms(date = todayLagos()) {
  await wait();
  return ok(myCourtroomIds().map((id) => summarise(id, date)));
}

export async function getCourtroomSummary(
  courtroomId: string,
  date = todayLagos(),
) {
  await wait(150);
  assertManages(courtroomId);
  return ok(summarise(courtroomId, date));
}

export interface PostStatusPayload {
  courtroom_id: string;
  date?: string;
  status: CourtStatus;
  reason?: NotSittingReason | null;
  expected_start?: string | null;
  until_date?: string | null;
  note?: string | null;
}

function statusMessage(p: PostStatusPayload, date: string) {
  const room = roomLabel(p.courtroom_id);
  const when = date === todayLagos() ? "today" : "on " + date;
  switch (p.status) {
    case "NOT_SITTING":
      return `${room} will NOT sit ${when}${p.reason ? ` — ${NOT_SITTING_REASON_LABEL[p.reason].toLowerCase()}` : ""}.${p.until_date ? ` Expected back ${p.until_date}.` : ""}${p.note ? ` ${p.note}` : ""}`;
    case "SITTING_LATE":
      return `${room} is sitting late ${when}${p.expected_start ? `, expected ${p.expected_start}` : ""}${p.reason ? ` (${NOT_SITTING_REASON_LABEL[p.reason].toLowerCase()})` : ""}.${p.note ? ` ${p.note}` : ""}`;
    case "SITTING":
      return `${room} is sitting ${when}${p.expected_start ? ` from ${p.expected_start}` : ""}.`;
    default:
      return `${room}: ${COURT_STATUS_LABEL[p.status]}.${p.note ? ` ${p.note}` : ""}`;
  }
}

export async function postStatus(p: PostStatusPayload) {
  await wait(350);
  assertManages(p.courtroom_id);
  const db = getDb();
  const date = p.date ?? todayLagos();
  const u = me();
  const status: ICourtroomStatus = {
    courtroom_id: p.courtroom_id,
    status: p.status,
    verification: "OFFICIAL",
    source: "REGISTRAR",
    report_count: 1,
    reported_at: now(),
    reason: p.reason ?? null,
    expected_start: p.expected_start ?? null,
    until_date: p.until_date ?? null,
    note: p.note ?? null,
  };
  db.statuses[statusKey(p.courtroom_id, date)] = status;
  db.status_reports.push({
    id: uid("sr"),
    courtroom_id: p.courtroom_id,
    date,
    status: p.status,
    source: "REGISTRAR",
    user_id: u.id,
    reporter_name: fullName(u),
    verification: "OFFICIAL",
    note: p.note ?? (p.reason ? NOT_SITTING_REASON_LABEL[p.reason] : null),
    created_at: status.reported_at,
  });
  const alert = dispatch(p.courtroom_id, "STATUS", statusMessage(p, date));
  logActivity(
    `posted ${COURT_STATUS_LABEL[p.status]}${date !== todayLagos() ? ` for ${date}` : ""}`,
    p.courtroom_id,
  );
  save();
  return ok({ status, alert });
}

export async function dismissCrowdReport(reportId: string) {
  await wait(150);
  const r = getDb().status_reports.find((x: any) => x.id === reportId);
  if (r) {
    assertManages(r.courtroom_id);
    r.dismissed = true;
    logActivity(
      `dismissed a spotter report (${COURT_STATUS_LABEL[r.status as CourtStatus]})`,
      r.courtroom_id,
    );
    save();
  }
  return ok(null);
}

export async function getStatusTimeline(
  courtroomId: string,
  date = todayLagos(),
) {
  await wait(150);
  const reports: IStatusReport[] = getDb()
    .status_reports.filter(
      (r: any) => r.courtroom_id === courtroomId && r.date === date,
    )
    .sort((a: any, b: any) => b.created_at.localeCompare(a.created_at));
  return ok(reports);
}

// ── Cause list ──────────────────────────────────────────────────────────────

export async function getCauseList(courtroomId: string, date = todayLagos()) {
  await wait(180);
  assertManages(courtroomId);
  const list = listFor(courtroomId, date);
  save();
  return ok(list);
}

function findItem(itemId: string) {
  for (const l of getDb().cause_lists as ICauseList[]) {
    const item = l.items.find((i) => i.id === itemId);
    if (item) return { list: l, item };
  }
  return fail(404, "Matter not found on any cause list");
}

function renumber(list: ICauseList) {
  list.items.forEach((it, idx) => (it.item_number = idx + 1));
}

export interface ItemInput {
  suit_number: string;
  title?: string;
  business?: BusinessOfDay;
  claimant_counsel?: string;
  defendant_counsel?: string;
  note?: string | null;
}

export async function addItems(data: {
  courtroom_id: string;
  date?: string;
  items: ItemInput[];
}) {
  await wait(250);
  assertManages(data.courtroom_id);
  const list = listFor(data.courtroom_id, data.date ?? todayLagos());
  for (const input of data.items) {
    list.items.push({
      id: uid("cli"),
      item_number: list.items.length + 1,
      suit_number: input.suit_number.trim(),
      suit_number_normalized: normalizeSuitNumber(input.suit_number),
      title: input.title?.trim(),
      business: input.business ?? "MENTION",
      claimant_counsel: input.claimant_counsel?.trim(),
      defendant_counsel: input.defendant_counsel?.trim(),
      outcome: "PENDING",
      next_date: null,
      next_business: null,
      note: input.note ?? null,
    });
  }
  logActivity(
    `added ${data.items.length} matter${data.items.length === 1 ? "" : "s"} to the cause list`,
    data.courtroom_id,
  );
  save();
  return ok(list);
}

export async function updateItem(data: { id: string } & Partial<ItemInput>) {
  await wait(200);
  const { list, item } = findItem(data.id);
  assertManages(list.courtroom_id);
  const { id: _id, ...patch } = data;
  void _id;
  Object.assign(item, patch);
  if (patch.suit_number)
    item.suit_number_normalized = normalizeSuitNumber(patch.suit_number);
  save();
  return ok(item);
}

export async function removeItem(itemId: string) {
  await wait(200);
  const { list } = findItem(itemId);
  assertManages(list.courtroom_id);
  list.items = list.items.filter((i) => i.id !== itemId);
  if (list.current_item_id === itemId) list.current_item_id = null;
  renumber(list);
  save();
  return ok(list);
}

export async function moveItem(data: { id: string; direction: "up" | "down" }) {
  await wait(120);
  const { list } = findItem(data.id);
  assertManages(list.courtroom_id);
  const idx = list.items.findIndex((i) => i.id === data.id);
  const target = data.direction === "up" ? idx - 1 : idx + 1;
  if (target >= 0 && target < list.items.length) {
    const [it] = list.items.splice(idx, 1);
    list.items.splice(target, 0, it!);
    renumber(list);
    save();
  }
  return ok(list);
}

export async function publishList(data: {
  courtroom_id: string;
  date?: string;
}) {
  await wait(400);
  assertManages(data.courtroom_id);
  const list = listFor(data.courtroom_id, data.date ?? todayLagos());
  if (list.items.length === 0)
    fail(400, "Add at least one matter before publishing.");
  list.status = "PUBLISHED";
  list.published_at = now();
  const alert = dispatch(
    data.courtroom_id,
    "CAUSE_LIST",
    `The cause list for ${roomLabel(data.courtroom_id)} (${list.date}) is published: ${list.items.length} matters. Check your item number on CourtPulse.`,
  );
  logActivity(
    `published the cause list (${list.items.length} matters)`,
    data.courtroom_id,
  );
  save();
  return ok({ list, alert });
}

export async function unpublishList(data: {
  courtroom_id: string;
  date?: string;
}) {
  await wait(200);
  assertManages(data.courtroom_id);
  const list = listFor(data.courtroom_id, data.date ?? todayLagos());
  list.status = "DRAFT";
  save();
  return ok(list);
}

/** Calls a matter: it becomes "now calling" and counsel on it are alerted. */
export async function callItem(itemId: string) {
  await wait(220);
  const { list, item } = findItem(itemId);
  assertManages(list.courtroom_id);
  const prev = list.items.find((i) => i.id === list.current_item_id);
  if (prev && prev.outcome === "CALLED" && prev.id !== item.id)
    prev.outcome = "HEARD";
  item.outcome = "CALLED";
  list.current_item_id = item.id;
  const alert = dispatch(
    list.courtroom_id,
    "CALLED",
    `${roomLabel(list.courtroom_id)} is now calling Item #${item.item_number}: ${item.suit_number}${item.title ? ` ${item.title}` : ""}.`,
    reachForItems([item]),
  );
  logActivity(`called Item #${item.item_number}`, list.courtroom_id);
  save();
  return ok({ list, alert });
}

/** Calls the next matter that hasn't been dealt with (stood-down ones last). */
export async function callNext(courtroomId: string) {
  const list = listFor(courtroomId);
  const curIdx = list.items.findIndex((i) => i.id === list.current_item_id);
  const after = list.items
    .slice(curIdx + 1)
    .find((i) => i.outcome === "PENDING");
  const any =
    after ??
    list.items.find((i) => i.outcome === "PENDING") ??
    list.items.find((i) => i.outcome === "STOOD_DOWN");
  if (!any) {
    await wait(100);
    return fail(400, "Every matter on today's list has been dealt with.");
  }
  return callItem(any.id);
}

export interface OutcomePayload {
  id: string;
  outcome: AppearanceOutcome;
  next_date?: string | null;
  next_business?: BusinessOfDay | null;
  note?: string | null;
  /** Send a hearing notice / update to counsel on this matter. */
  notify?: boolean;
}

export async function setOutcome(p: OutcomePayload) {
  await wait(250);
  const { list, item } = findItem(p.id);
  assertManages(list.courtroom_id);
  item.outcome = p.outcome;
  item.next_date =
    p.next_date ??
    (p.outcome === "ADJOURNED" || p.outcome === "RESERVED"
      ? item.next_date
      : null);
  item.next_business = p.next_business ?? item.next_business ?? null;
  if (p.note !== undefined) item.note = p.note;
  if (p.outcome !== "CALLED" && list.current_item_id === item.id)
    list.current_item_id = null;

  let alert: IAlertDispatch | null = null;
  if (p.notify !== false && p.outcome !== "PENDING") {
    const next = item.next_date
      ? ` to ${item.next_date}${item.next_business ? ` for ${BUSINESS_LABEL[item.next_business].toLowerCase()}` : ""}`
      : "";
    alert = dispatch(
      list.courtroom_id,
      p.outcome === "ADJOURNED" ? "ADJOURNMENT" : "CALLED",
      `${item.suit_number}${item.title ? ` ${item.title}` : ""}: ${OUTCOME_LABEL[p.outcome]}${next}.`,
      reachForItems([item]),
    );
  }
  logActivity(
    `marked Item #${item.item_number} ${OUTCOME_LABEL[p.outcome].toLowerCase()}`,
    list.courtroom_id,
  );
  save();
  return ok({ item, alert });
}

/** "Taking dates" for a whole list when the judge doesn't sit. */
export async function bulkAdjourn(data: {
  courtroom_id: string;
  assignments: {
    item_id: string;
    next_date: string;
    next_business?: BusinessOfDay | null;
  }[];
  note?: string | null;
  notify?: boolean;
}) {
  await wait(700);
  assertManages(data.courtroom_id);
  const list = listFor(data.courtroom_id);
  const touched: ICauseListItem[] = [];
  for (const a of data.assignments) {
    const item = list.items.find((i) => i.id === a.item_id);
    if (!item) continue;
    item.outcome = "ADJOURNED";
    item.next_date = a.next_date;
    item.next_business = a.next_business ?? item.business ?? null;
    item.note = data.note ?? item.note ?? null;
    touched.push(item);
  }
  list.current_item_id = null;
  const alert =
    data.notify === false
      ? null
      : dispatch(
          data.courtroom_id,
          "ADJOURNMENT",
          `Hearing notices: ${touched.length} matters in ${roomLabel(data.courtroom_id)} adjourned. Each counsel receives their matter's new date.`,
          reachForItems(touched),
        );
  logActivity(
    `adjourned ${touched.length} matters and sent hearing notices`,
    data.courtroom_id,
  );
  save();
  return ok({ list, alert });
}

/** Simulated OCR: "reads" a photo of a paper cause list into draft matters. */
export async function readCauseListPhoto(data: {
  courtroom_id: string;
  file: File;
}) {
  await wait(1600);
  assertManages(data.courtroom_id);
  const c = enrichCourtroom(courtroomById(data.courtroom_id));
  const r = rng(`${data.file.name}${data.file.size}`);
  const prefix =
    c.court_system === "FHC"
      ? "FHC/L/CS"
      : c.division_id === "div-lagos"
        ? "LD"
        : c.division_id === "div-ikeja"
          ? "ID"
          : "HC";
  const surnames = [
    "Adekunle",
    "Obi",
    "Lawal",
    "Nwosu",
    "Bello",
    "Okeke",
    "Ajayi",
    "Uche",
    "Adeola",
    "Sanni",
  ];
  const orgs = [
    "Coastal Energy Ltd",
    "Vinewood Homes Ltd",
    "Unity Micro Credit",
    "Maple Freight Ltd",
    "Sapphire Clinics Ltd",
  ];
  const businesses: BusinessOfDay[] = [
    "MENTION",
    "MENTION",
    "HEARING",
    "MOTION",
    "ADOPTION",
    "RULING",
  ];
  const count = 5 + Math.floor(r() * 5);
  const year = Number(todayLagos().slice(0, 4));
  const items: ItemInput[] = Array.from({ length: count }, () => ({
    suit_number: `${prefix}/${100 + Math.floor(r() * 3500)}${r() < 0.25 ? "GCM" : ""}/${year - Math.floor(r() * 4)}`,
    title: `${pick(r, surnames)} v. ${pick(r, orgs)}`,
    business: pick(r, businesses),
    claimant_counsel: `${pick(r, ["A.", "O.", "T.", "C."])} ${pick(r, surnames)}`,
    defendant_counsel: `${pick(r, ["B.", "F.", "K.", "N."])} ${pick(r, surnames)}`,
  }));
  // One line the "OCR" wasn't sure about, so the review step has something to fix.
  items[Math.min(2, items.length - 1)]!.suit_number = items[
    Math.min(2, items.length - 1)
  ]!.suit_number.replace("/", " ").toLowerCase();
  return ok({ items, confidence: 0.86 + r() * 0.1 });
}

// ── Diary ───────────────────────────────────────────────────────────────────

export async function getDiary(courtroomId: string, days = 30) {
  await wait(160);
  const db = getDb();
  const load = db.diary_load[courtroomId] ?? {};
  const out: IDiaryDay[] = [];
  let d = todayLagos();
  while (out.length < days) {
    d = addDays(d, 1);
    if (isWeekend(d)) continue;
    const period = calendarPeriodFor(courtroomId, d);
    const block = db.diary_blocks.find(
      (b: any) => b.courtroom_id === courtroomId && b.date === d,
    );
    const adjourned = (db.cause_lists as ICauseList[])
      .filter((l) => l.courtroom_id === courtroomId)
      .flatMap((l) => l.items)
      .filter((i) => i.next_date === d).length;
    const approved = db.remote_dates.filter(
      (x: any) =>
        x.courtroom_id === courtroomId &&
        x.status === "APPROVED" &&
        x.approved_date === d,
    ).length;
    out.push({
      date: d,
      booked: (load[d] ?? 0) + adjourned + approved,
      capacity: 15,
      blocked: Boolean(period || block),
      block_reason: period?.name ?? block?.reason ?? null,
    });
  }
  return ok(out);
}

export async function setDiaryBlock(data: {
  courtroom_id: string;
  date: string;
  reason?: string;
  blocked: boolean;
}) {
  await wait(200);
  assertManages(data.courtroom_id);
  const db = getDb();
  db.diary_blocks = db.diary_blocks.filter(
    (b: any) => !(b.courtroom_id === data.courtroom_id && b.date === data.date),
  );
  if (data.blocked)
    db.diary_blocks.push({
      courtroom_id: data.courtroom_id,
      date: data.date,
      reason: data.reason || "Not available",
    });
  logActivity(
    `${data.blocked ? "blocked" : "opened"} ${data.date} in the judge's diary`,
    data.courtroom_id,
  );
  save();
  return ok(null);
}

// ── Broadcasts ──────────────────────────────────────────────────────────────

function enrichBroadcast(b: any): IBroadcast {
  const author = getDb().users.find((u: any) => u.id === b.created_by);
  return {
    ...b,
    author_name: author ? fullName(author) : "Registry",
    courtroom_name: b.courtroom_id ? roomLabel(b.courtroom_id) : null,
  };
}

export async function getBroadcasts() {
  await wait();
  const u = me();
  const ids = myCourtroomIds();
  const divisions = new Set(ids.map((id) => courtroomById(id).division_id));
  return ok(
    (getDb().broadcasts as any[])
      .filter(
        (b) =>
          isAdmin(u) ||
          (b.courtroom_id
            ? ids.includes(b.courtroom_id)
            : divisions.has(b.division_id)),
      )
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map(enrichBroadcast),
  );
}

export async function createBroadcast(data: {
  courtroom_id?: string | null;
  division_id?: string;
  severity: "INFO" | "URGENT";
  message: string;
  expires_at?: string | null;
}) {
  await wait(400);
  const db = getDb();
  const u = me();
  let divisionId = data.division_id;
  if (data.courtroom_id) {
    assertManages(data.courtroom_id);
    divisionId = courtroomById(data.courtroom_id).division_id;
  }
  const b = {
    id: uid("bc"),
    division_id: divisionId,
    courtroom_id: data.courtroom_id ?? null,
    severity: data.severity,
    message: data.message.trim(),
    created_by: u.id,
    created_at: now(),
    expires_at: data.expires_at ?? null,
  };
  db.broadcasts.unshift(b);
  const reach = data.courtroom_id
    ? reachFor(data.courtroom_id)
    : myCourtroomIds()
        .filter((id) => courtroomById(id).division_id === divisionId)
        .map(reachFor)
        .reduce(
          (a, x) => ({
            recipients: a.recipients + x.recipients,
            sms: a.sms + x.sms,
            whatsapp: a.whatsapp + x.whatsapp,
          }),
          { recipients: 0, sms: 0, whatsapp: 0 },
        );
  const alert = dispatch(
    data.courtroom_id ?? null,
    "BROADCAST",
    b.message,
    reach,
  );
  logActivity(
    `sent ${data.severity === "URGENT" ? "an urgent" : "a"} broadcast`,
    data.courtroom_id ?? null,
    data.courtroom_id
      ? undefined
      : db.divisions.find((d: any) => d.id === divisionId)?.name + " division",
  );
  save();
  return ok({ broadcast: enrichBroadcast(b), alert });
}

export async function expireBroadcast(id: string) {
  await wait(200);
  const b = getDb().broadcasts.find((x: any) => x.id === id);
  if (b) {
    b.expires_at = now();
    save();
  }
  return ok(null);
}

// ── Remote date requests ────────────────────────────────────────────────────

export async function getDateRequests() {
  await wait();
  const db = getDb();
  const ids = myCourtroomIds();
  const rows: IRemoteDateRequest[] = (db.remote_dates as any[])
    .filter((r) => ids.includes(r.courtroom_id))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((r) => {
      const u = db.users.find((x: any) => x.id === r.requested_by);
      return {
        ...r,
        courtroom_name: roomLabel(r.courtroom_id),
        requester_name: u ? fullName(u) : "Counsel",
      };
    });
  return ok(rows);
}

export async function decideDateRequest(data: {
  id: string;
  decision: "APPROVED" | "REJECTED";
  approved_date?: string;
  note?: string;
}) {
  await wait(350);
  const db = getDb();
  const r = db.remote_dates.find((x: any) => x.id === data.id);
  if (!r) fail(404, "Request not found");
  assertManages(r.courtroom_id);
  r.status = data.decision;
  r.approved_date =
    data.decision === "APPROVED" ? data.approved_date : undefined;
  r.decision_note = data.note ?? null;
  // Record the new date on today's list, like a date taken in open court.
  const item = listFor(r.courtroom_id).items.find(
    (i) =>
      normalizeSuitNumber(i.suit_number) === normalizeSuitNumber(r.suit_number),
  );
  if (item && data.decision === "APPROVED") {
    item.outcome = "ADJOURNED";
    item.next_date = data.approved_date ?? null;
  }
  const alert = dispatch(
    r.courtroom_id,
    "REMOTE_DATE",
    data.decision === "APPROVED"
      ? `${r.suit_number}: new date ${data.approved_date} confirmed by the registry.`
      : `${r.suit_number}: date request declined.${data.note ? ` ${data.note}` : ""}`,
    { recipients: 2, sms: 2, whatsapp: 2 },
  );
  logActivity(
    `${data.decision === "APPROVED" ? "confirmed" : "declined"} a date request for ${r.suit_number}`,
    r.courtroom_id,
  );
  save();
  return ok({ request: r, alert });
}

// ── Alerts & activity ───────────────────────────────────────────────────────

export async function getAlerts() {
  await wait();
  const ids = new Set(myCourtroomIds());
  const u = me();
  const rows: IAlertDispatch[] = (getDb().alerts as IAlertDispatch[])
    .filter(
      (a) =>
        isAdmin(u) ||
        (a.courtroom_id ? ids.has(a.courtroom_id) : a.actor === fullName(u)),
    )
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  return ok(rows);
}

export async function getActivity() {
  await wait(160);
  const ids = new Set(myCourtroomIds());
  const u = me();
  const rows: IActivity[] = (getDb().activity as IActivity[])
    .filter((a) => isAdmin(u) || !a.courtroom_id || ids.has(a.courtroom_id))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  return ok(rows.slice(0, 40));
}

export function courtroomLabel(id: string) {
  return roomLabel(id);
}

// ── Admin ───────────────────────────────────────────────────────────────────

function assertAdmin() {
  if (!isAdmin(me())) fail(403, "Admins only.");
}

export async function getAdminOverview() {
  await wait();
  assertAdmin();
  const db = getDb();
  const today = todayLagos();
  const statuses = Object.entries(db.statuses)
    .filter(([k]) => k.endsWith(today))
    .map(([, v]) => v as ICourtroomStatus);
  const alertsToday = (db.alerts as IAlertDispatch[]).filter(
    (a) => a.created_at.slice(0, 10) >= addDays(today, -1),
  );
  return ok({
    courtrooms: db.courtrooms.length,
    reporting_today: statuses.length,
    official_today: statuses.filter((s) => s.verification === "OFFICIAL")
      .length,
    not_sitting_today: statuses.filter((s) => s.status === "NOT_SITTING")
      .length,
    registrars: db.users.filter((x: any) => x.role === "REGISTRAR").length,
    registrars_pending: db.users.filter(
      (x: any) => x.role === "REGISTRAR" && !x.is_verified,
    ).length,
    lawyers: 2480 + db.users.filter((x: any) => x.role === "LAWYER").length,
    lawyers_pending: db.users.filter(
      (x: any) => x.role === "LAWYER" && !x.is_verified,
    ).length,
    alerts_today: alertsToday.reduce((n, a) => n + a.recipients, 0),
    unmanaged_courtrooms: db.courtrooms.filter(
      (c: any) =>
        !db.users.some(
          (x: any) => x.role === "REGISTRAR" && x.courtroom_ids?.includes(c.id),
        ),
    ).length,
  });
}

export type AdminCourtroom = ICourtroom & {
  registrars: string[];
  status: ICourtroomStatus | null;
};

export async function getAllCourtrooms() {
  await wait();
  const db = getDb();
  return ok<AdminCourtroom[]>(
    db.courtrooms.map((c: any) => ({
      ...enrichCourtroom(c),
      registrars: db.users
        .filter(
          (u: any) => u.role === "REGISTRAR" && u.courtroom_ids?.includes(c.id),
        )
        .map((u: any) => fullName(u)),
      status: statusFor(c.id),
    })),
  );
}

export async function getDivisions() {
  await wait(100);
  const db = getDb();
  return ok({ divisions: db.divisions, complexes: db.complexes });
}

export async function getRegistrars() {
  await wait();
  assertAdmin();
  return ok<IUser[]>(
    getDb()
      .users.filter((u: any) => u.role === "REGISTRAR")
      .map(publicUser),
  );
}

export async function inviteRegistrar(data: {
  email: string;
  courtroom_ids: string[];
}) {
  await wait(400);
  assertAdmin();
  const token = uid("inv");
  getDb().invites.push({ ...data, token, created_at: now() });
  logActivity(`invited ${data.email} as a registrar`, null, data.email);
  save();
  return ok({ token, link: `${window.location.origin}/auth/invite/${token}` });
}

export async function setRegistrarCourtrooms(data: {
  id: string;
  courtroom_ids: string[];
}) {
  await wait(250);
  assertAdmin();
  const u = getDb().users.find((x: any) => x.id === data.id);
  if (u) u.courtroom_ids = data.courtroom_ids;
  save();
  return ok(publicUser(u));
}

export async function verifyUser(id: string) {
  await wait(250);
  assertAdmin();
  const u = getDb().users.find((x: any) => x.id === id);
  if (u) {
    u.is_verified = true;
    logActivity(
      `verified ${fullName(u)}`,
      null,
      u.role === "LAWYER" ? "Lawyer" : "Registrar",
    );
  }
  save();
  return ok(publicUser(u));
}

export async function getLawyers() {
  await wait();
  assertAdmin();
  return ok<IUser[]>(
    getDb()
      .users.filter((u: any) => u.role === "LAWYER")
      .map(publicUser),
  );
}

export async function getJudges() {
  await wait(120);
  return ok(getDb().judges as IJudge[]);
}

export async function getJudgeAssignments(courtroomId: string) {
  await wait(120);
  const db = getDb();
  const rows: IJudgeAssignment[] = db.judge_assignments
    .filter((a: any) => a.courtroom_id === courtroomId)
    .sort((a: any, b: any) => b.start_date.localeCompare(a.start_date))
    .map((a: any) => ({
      ...a,
      judge: db.judges.find((j: any) => j.id === a.judge_id),
    }));
  return ok(rows);
}

export async function assignJudge(data: {
  courtroom_id: string;
  judge_id?: string;
  new_judge_name?: string;
  start_date: string;
}) {
  await wait(300);
  assertAdmin();
  const db = getDb();
  let judgeId = data.judge_id;
  if (!judgeId && data.new_judge_name) {
    judgeId = uid("jdg");
    db.judges.push({
      id: judgeId,
      title: "Hon. Justice",
      name: data.new_judge_name.trim(),
    });
  }
  if (!judgeId) fail(400, "Choose a judge.");
  // End the current assignment for this courtroom, and the judge's old one.
  for (const a of db.judge_assignments) {
    if (
      !a.end_date &&
      (a.courtroom_id === data.courtroom_id || a.judge_id === judgeId)
    ) {
      a.end_date = addDays(data.start_date, -1);
    }
  }
  db.judge_assignments.push({
    id: uid("ja"),
    courtroom_id: data.courtroom_id,
    judge_id: judgeId,
    start_date: data.start_date,
    end_date: null,
  });
  const judge = db.judges.find((j: any) => j.id === judgeId);
  logActivity(`assigned ${judge.title} ${judge.name}`, data.courtroom_id);
  save();
  return ok(null);
}

export async function getCalendar() {
  await wait(140);
  return ok(
    [...(getDb().calendar as ICalendarPeriod[])].sort((a, b) =>
      a.start_date.localeCompare(b.start_date),
    ),
  );
}

export async function addCalendarPeriod(data: Omit<ICalendarPeriod, "id">) {
  await wait(250);
  assertAdmin();
  getDb().calendar.push({ ...data, id: uid("cal") });
  logActivity(
    `added "${data.name}" to the legal calendar`,
    null,
    "Legal calendar",
  );
  save();
  return ok(null);
}

export async function removeCalendarPeriod(id: string) {
  await wait(200);
  assertAdmin();
  const db = getDb();
  db.calendar = db.calendar.filter((p: any) => p.id !== id);
  save();
  return ok(null);
}

export async function getConsensus() {
  await wait(120);
  return ok(
    getDb().consensus as {
      min_reports: number;
      window_minutes: number;
      credit_first_n: number;
      credit_amount: number;
    },
  );
}

export async function updateConsensus(data: {
  min_reports: number;
  window_minutes: number;
  credit_first_n: number;
  credit_amount: number;
}) {
  await wait(250);
  assertAdmin();
  getDb().consensus = data;
  logActivity("updated the consensus rules", null, "Consensus");
  save();
  return ok(data);
}

export { todayLagos, addWorkingDays };
