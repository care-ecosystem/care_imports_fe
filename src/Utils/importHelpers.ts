/**
 * Shared types for import pages.
 */

export interface PaginatedResponse<T> {
  results: T[];
  count?: number;
}

export interface ImportResults {
  processed: number;
  created: number;
  updated: number;
  failed: number;
  skipped: number;
  failures: {
    rowIndex: number;
    title?: string;
    name?: string;
    reason: string;
  }[];
}

/**
 * Shared utility functions for import pages.
 */

export const normalize = (value: string) => value.trim().toLowerCase();

export const csvEscape = (value: string) => `"${value.replace(/"/g, '""')}"`;

/**
 * Remove trailing ".0" suffixes from medical codes (e.g. LOINC codes).
 * "1975.0-2" → "1975-2"
 */
export const formatCode = (code: string | undefined) =>
  code && code.includes(".0") ? code.replace(".0", "") : code;

/**
 * Fetch all items from a paginated API endpoint.
 * Returns all results collected across pages.
 *
 * @param apiRoute - The API route definition (must return PaginatedResponse)
 * @param options - Path params and optional base query params
 * @param pageSize - Number of items per page (default: 200)
 */
export async function batchFetchAll<T>(
  apiRoute: unknown,
  options?: {
    pathParams?: Record<string, string>;
    queryParams?: Record<string, unknown>;
  },
  pageSize = 200,
): Promise<T[]> {
  // Import request lazily to avoid circular deps
  const { request } = await import("@/apis/request");

  const allResults: T[] = [];
  let offset = 0;

  while (true) {
    const response = (await (request as Function)(apiRoute, {
      ...options,
      queryParams: { ...options?.queryParams, limit: pageSize, offset },
    })) as { count: number; results: T[] };

    allResults.push(...response.results);
    offset += pageSize;
    if (offset >= response.count) break;
  }

  return allResults;
}
