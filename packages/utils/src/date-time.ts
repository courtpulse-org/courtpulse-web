const LAGOS_TZ = "Africa/Lagos";

/** All court times display in WAT regardless of the device's zone. */
export function formatCourtTime(value: string | Date) {
  return new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: LAGOS_TZ,
  }).format(new Date(value));
}

export function formatCourtDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: LAGOS_TZ,
  }).format(new Date(value));
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
