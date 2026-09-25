export function capitalize(value: string) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/** "SITTING_LATE" -> "Sitting late" */
export function humanizeEnum(value: string) {
  return capitalize(value.replaceAll("_", " "));
}

export function getInitials(first?: string, last?: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

/**
 * Normalises a Nigerian phone number to E.164 (+234…). Accepts "0803…",
 * "803…", "234803…" and "+234803…".
 */
export function normalizeNigerianPhone(input: string) {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("234")) return `+${digits}`;
  if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
  return `+234${digits}`;
}

/** Masks a phone for display: +2348031234567 -> +234 803 *** 4567 */
export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) return phone;
  return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} *** ${digits.slice(-4)}`;
}
