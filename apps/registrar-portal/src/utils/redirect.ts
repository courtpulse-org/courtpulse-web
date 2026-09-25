// Only same-origin paths survive the login round-trip; anything with a
// scheme or a protocol-relative `//` is dropped so a crafted link can't
// bounce a user to another site after they sign in.
export function encodeRedirectPath(path: string) {
  return btoa(path);
}

export function decodeRedirectPath(encoded: string | null): string | null {
  if (!encoded) return null;
  try {
    const path = atob(encoded);
    if (!path.startsWith("/") || path.startsWith("//")) return null;
    return path;
  } catch {
    return null;
  }
}

export function getSafeCurrentPath() {
  return window.location.pathname + window.location.search;
}
