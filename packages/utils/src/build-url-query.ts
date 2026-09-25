/**
 * Appends `filter` to `baseUrl` as a query string. Skips null/undefined/empty
 * values; arrays are comma-joined unless listed in `options.indexed`.
 */
export function buildUrlWithQueryParams(
  baseUrl: string,
  filter: any,
  options?: { indexed?: string[] },
): string {
  const indexedKeys = new Set(options?.indexed ?? []);
  const parts: string[] = [];

  for (const key of Object.keys(filter || {})) {
    const value = filter[key];
    if (
      value === undefined ||
      value === null ||
      Number.isNaN(value) ||
      value === ""
    ) {
      continue;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      if (indexedKeys.has(key)) {
        value.forEach((item, i) => {
          parts.push(
            `${encodeURIComponent(key)}[${i}]=${encodeURIComponent(String(item))}`,
          );
        });
      } else {
        parts.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(value.join(","))}`,
        );
      }
    } else {
      parts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      );
    }
  }

  return parts.length ? `${baseUrl}?${parts.join("&")}` : baseUrl;
}
