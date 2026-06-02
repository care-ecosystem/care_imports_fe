import * as fs from "fs";
import * as path from "path";

const AUTH_FILE = path.resolve("tests/.auth/user.json");

interface LocalStorageItem {
  name: string;
  value: string;
}

interface StorageState {
  cookies: unknown[];
  origins: Array<{
    origin: string;
    localStorage: LocalStorageItem[];
  }>;
}

/**
 * Reads the Playwright storage state and returns auth tokens + raw state for mutations.
 */
export function getAuthState(): {
  accessToken: string;
  refreshToken: string;
  storageState: StorageState;
} {
  if (!fs.existsSync(AUTH_FILE)) {
    throw new Error(`Auth file not found at ${AUTH_FILE}`);
  }

  const storageState: StorageState = JSON.parse(
    fs.readFileSync(AUTH_FILE, "utf-8"),
  );

  if (!storageState.origins?.length) {
    throw new Error("No origins found in storage state");
  }

  const localStorage = storageState.origins[0].localStorage ?? [];

  const accessToken =
    localStorage.find((i) => i.name === "care_access_token")?.value ?? "";
  const refreshToken =
    localStorage.find((i) => i.name === "care_refresh_token")?.value ?? "";

  return { accessToken, refreshToken, storageState };
}

/**
 * Writes the storage state back to disk (e.g. after token refresh).
 */
export function saveStorageState(storageState: StorageState): void {
  fs.writeFileSync(AUTH_FILE, JSON.stringify(storageState, null, 2));
}

/**
 * Gets the API base URL from environment or defaults.
 */
export function getApiBaseUrl(): string {
  return process.env.REACT_CARE_API_URL || "http://localhost:8000";
}

/**
 * Returns authorization headers with bearer token.
 */
export function getAuthHeaders(): Record<string, string> {
  const { accessToken } = getAuthState();
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

/**
 * Fetches results from a paginated API endpoint.
 *
 * For facility-scoped endpoints, pass `facilityId` to auto-prefix the path
 * with `/api/v1/facility/{id}/`. For non-facility-scoped endpoints, omit it
 * and provide the full path (e.g. `/api/v1/product_knowledge/`).
 */
interface FetchApiOptions {
  facilityId?: string;
  params?: Record<string, string>;
}

interface FetchRequest {
  get: (
    url: string,
    options?: { headers?: Record<string, string> },
  ) => Promise<{
    ok: () => boolean;
    json: () => Promise<unknown>;
    status: () => number;
    text: () => Promise<string>;
  }>;
}

/** Fetch a paginated list endpoint — returns `T[]`. */
export async function fetchApiResults<T = Record<string, unknown>>(
  request: FetchRequest,
  path: string,
  options?: FetchApiOptions & { paginated?: true },
): Promise<T[]>;
/** Fetch a single-object (retrieve) endpoint — returns `T`. */
export async function fetchApiResults<T = Record<string, unknown>>(
  request: FetchRequest,
  path: string,
  options: FetchApiOptions & { paginated: false },
): Promise<T>;
export async function fetchApiResults<T = Record<string, unknown>>(
  request: FetchRequest,
  path: string,
  options: FetchApiOptions & { paginated?: boolean } = {},
): Promise<T[] | T> {
  const apiUrl = getApiBaseUrl();
  const headers = getAuthHeaders();

  const basePath = options.facilityId
    ? `/api/v1/facility/${options.facilityId}/${path.replace(/^\//, "")}`
    : path;

  const url = new URL(basePath, apiUrl);
  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      url.searchParams.set(key, value);
    }
  }

  const response = await request.get(url.toString(), { headers });
  if (!response.ok()) {
    throw new Error(
      `API request failed: ${response.status()} ${await response.text()}`,
    );
  }

  const data = await response.json();
  if (options.paginated === false) {
    return data as T;
  }
  return (data as { results: T[] }).results;
}
