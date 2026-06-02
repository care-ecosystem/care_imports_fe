import { FullConfig } from "@playwright/test";
import { getApiBaseUrl, getAuthState, saveStorageState } from "./helpers/api";

/**
 * Refresh authentication tokens using native fetch.
 */
async function refreshTokens() {
  let refreshToken: string;
  let storageState: ReturnType<typeof getAuthState>["storageState"];

  try {
    ({ refreshToken, storageState } = getAuthState());
  } catch {
    console.log("⚠️ Auth file or tokens not found, skipping token refresh");
    return;
  }

  if (!refreshToken) {
    console.log("⚠️ No refresh token found, skipping token refresh");
    return;
  }

  const apiUrl = getApiBaseUrl();

  console.log("🔄 Refreshing authentication tokens...");

  try {
    const response = await fetch(`${apiUrl}/api/v1/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      const localStorage = storageState.origins[0].localStorage;

      const accessEntry = localStorage.find(
        (i) => i.name === "care_access_token",
      );
      const refreshEntry = localStorage.find(
        (i) => i.name === "care_refresh_token",
      );

      if (accessEntry) accessEntry.value = data.access;
      if (refreshEntry && data.refresh) refreshEntry.value = data.refresh;

      saveStorageState(storageState);
      console.log("✅ Tokens refreshed successfully");
    } else {
      console.log(`⚠️ Token refresh failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error("❌ Error refreshing tokens:", error);
  }
}

/**
 * Global setup that runs once before all tests.
 * Refreshes authentication tokens.
 */
async function globalSetup(_config: FullConfig) {
  await refreshTokens();
}

export default globalSetup;
