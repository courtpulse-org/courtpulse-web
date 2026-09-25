// Small helpers shared by the seed and the server. Kept dependency-free.

const LAGOS_TZ = "Africa/Lagos";

export const todayLagos = (now = new Date()): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone: LAGOS_TZ }).format(now);

export const addDays = (date: string, days: number): string => {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

export const isWeekend = (date: string) => {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  return day === 0 || day === 6;
};

/** Next weekday on/after `date` + `days`. */
export const addWorkingDays = (date: string, days: number): string => {
  let d = date;
  let left = days;
  while (left > 0) {
    d = addDays(d, 1);
    if (!isWeekend(d)) left -= 1;
  }
  return d;
};

export const minutesAgo = (m: number) =>
  new Date(Date.now() - m * 60_000).toISOString();

let counter = 0;
export const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Same rules as @repo/utils normalizeSuitNumber. */
export function normalizeSuitNumber(raw: string) {
  if (!raw) return "";
  const parts = String(raw)
    .toUpperCase()
    .replace(/[.\\_–—-]+/g, "/")
    .replace(/\s+/g, "/")
    .split("/")
    .filter(Boolean)
    .map((p) => p.replace(/^0+(?=\d)/, ""));
  const last = parts[parts.length - 1];
  if (last && /^\d{2}$/.test(last) && parts.length > 2)
    parts[parts.length - 1] = `20${last}`;
  return parts.join("/");
}

/** Deterministic PRNG so every reseed on the same day produces the same lists. */
export function rng(seedStr: string) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export const pick = <T>(r: () => number, arr: T[]): T =>
  arr[Math.floor(r() * arr.length)] as T;
