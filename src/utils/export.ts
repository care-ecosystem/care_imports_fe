import { request } from "@/apis/request";

/**
 * Strip the facility-scoped slug prefix `f-{facilityId}-` from a slug.
 * If the slug doesn't match the prefix pattern, it is returned as-is.
 */
export function stripFacilitySlugPrefix(slug: string): string {
  // Match f-<uuid>- prefix (UUID v4 format)
  const match = slug.match(
    /^f-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/,
  );
  if (match) {
    return slug.slice(match[0].length);
  }
  return slug;
}

/**
 * Escape a value for CSV output.
 * Wraps in double-quotes and escapes internal double-quotes.
 */
export const csvEscape = (value: string): string =>
  `"${value.replace(/"/g, '""')}"`;

/**
 * Build a CSV string from headers and rows.
 */
export function toCsvString(headers: string[], rows: string[][]): string {
  const headerLine = headers.map(csvEscape).join(",");
  const dataLines = rows.map((row) => row.map(csvEscape).join(","));
  return [headerLine, ...dataLines].join("\n");
}

/**
 * Trigger a CSV file download in the browser.
 */
export function downloadCsv(filename: string, csvText: string): void {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Standard paginated response shape from the API.
 */
export interface PaginatedResponse<T> {
  count: number;
  results: T[];
  next?: string | null;
}

/**
 * Fetch all pages from a paginated API endpoint.
 * Returns the full list of results.
 */
export async function fetchAllPages<T>(
  path: string,
  pageSize = 100,
): Promise<{ results: T[]; count: number }> {
  const allResults: T[] = [];
  let offset = 0;
  let totalCount = 0;

  const separator = path.includes("?") ? "&" : "?";

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const url = `${path}${separator}limit=${pageSize}&offset=${offset}`;
    const page = await request<PaginatedResponse<T>>(url, { method: "GET" });

    totalCount = page.count;
    allResults.push(...page.results);

    if (allResults.length >= totalCount || page.results.length < pageSize) {
      break;
    }
    offset += pageSize;
  }

  return { results: allResults, count: totalCount };
}
