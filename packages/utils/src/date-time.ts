const LAGOS_TZ = "Africa/Lagos";

/** Today's date in Lagos as YYYY-MM-DD (court "today" is always WAT). */
export function todayLagos(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: LAGOS_TZ }).format(now);
}

/** Adds days to a YYYY-MM-DD string, returning YYYY-MM-DD. */
export function addDays(date: string, days: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function isWeekend(date: string) {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return day === 0 || day === 6;
}

/** All court times display in WAT regardless of the device's zone. */
export function formatCourtTime(value: string | Date) {
  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: LAGOS_TZ,
  }).format(new Date(value));
}

/** "Tue, 14 Oct 2026" — accepts ISO timestamps or YYYY-MM-DD. */
export function formatCourtDate(value: string | Date) {
  const d =
    typeof value === "string" && value.length === 10
      ? new Date(`${value}T12:00:00Z`)
      : new Date(value);
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: LAGOS_TZ,
  }).format(d);
}

/** "14 Oct" */
export function formatShortDate(value: string | Date) {
  const d =
    typeof value === "string" && value.length === 10
      ? new Date(`${value}T12:00:00Z`)
      : new Date(value);
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    timeZone: LAGOS_TZ,
  }).format(d);
}

/** "Tuesday, 23 September" */
export function formatLongDate(value: string | Date = new Date()) {
  const d =
    typeof value === "string" && value.length === 10
      ? new Date(`${value}T12:00:00Z`)
      : new Date(value);
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: LAGOS_TZ,
  }).format(d);
}

/** "11:30" → "11:30 AM" */
export function formatClock(hhmm?: string | null) {
  if (!hhmm) return "";
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** "3 min ago" — for status timestamps on the live board. */
export function timeAgo(value: string | Date) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return formatCourtDate(value);
}

/** Court sits in the morning; the PRD's engagement window is 7:30–10:30 WAT. */
export function isMorningCourtHours(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    timeZone: LAGOS_TZ,
  }).formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const t = hour * 60 + minute;
  return t >= 7 * 60 + 30 && t <= 10 * 60 + 30;
}

export function greetingForNow(now = new Date()) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: LAGOS_TZ,
    }).format(now),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
