/**
 * Suit numbers encode court/division, sometimes case type, serial and year —
 * `LD/1234/2023`, `ID/567GCM/2024`, `FHC/L/CS/890/2023` — and lawyers write
 * them inconsistently ("ld 1234 23", "LD-1234-2023", "LD/01234/2023").
 * Matching (watchlists, OCR, cause lists) always goes through this.
 */
export function normalizeSuitNumber(raw: string): string {
  if (!raw) return "";
  const parts = raw
    .toUpperCase()
    .replace(/[.\\_–—-]+/g, "/")
    .replace(/\s+/g, "/")
    .split("/")
    .filter(Boolean)
    .map((p) => p.replace(/^0+(?=\d)/, "")); // strip leading zeros in serials

  // Two-digit trailing year → four digits ("23" → "2023").
  const last = parts[parts.length - 1];
  if (last && /^\d{2}$/.test(last) && parts.length > 2) {
    parts[parts.length - 1] = `20${last}`;
  }
  return parts.join("/");
}

export function suitNumbersMatch(a: string, b: string) {
  return normalizeSuitNumber(a) === normalizeSuitNumber(b);
}

/** Loose shape check — at least a prefix, a serial and a year. */
export function looksLikeSuitNumber(raw: string) {
  return /^[A-Z]{1,5}(\/[A-Z0-9]+){1,4}\/(19|20)\d{2}$/.test(
    normalizeSuitNumber(raw),
  );
}
