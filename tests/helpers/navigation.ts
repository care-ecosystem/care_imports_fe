import type { Page } from "@playwright/test";
import { getFacility } from "../utils/facility";

export type ImportTab =
  | "users"
  | "departments"
  | "locations"
  | "charge-item-definition"
  | "product-knowledge"
  | "product"
  | "observation-definition"
  | "activity-definition"
  | "valuesets"
  | "specimen-definitions";

/**
 * Navigate to an import tab and select a facility if required.
 * Users and ValueSets don't require a facility.
 */
export async function goToImport(
  page: Page,
  tab: ImportTab,
  options?: { facilityName?: string; disableFacilitySelect?: boolean },
) {
  await page.goto(`/admin/import/${tab}`);

  let reloadAttempts = 5;
  while (reloadAttempts > 0) {
    await page.waitForLoadState("networkidle");
    // If we see the "Page Not Found" heading, reload and check again
    const notFound = await page
      .getByRole("heading", { name: "Page Not Found" })
      .isVisible();
    if (!notFound) break;

    reloadAttempts--;
    await page.waitForTimeout(500);
    await page.reload();
  }
  await page.waitForLoadState("networkidle");

  // Most tabs require a facility selection — select the first one if not specified
  const noFacilityTabs: ImportTab[] = ["users", "valuesets"];
  if (!noFacilityTabs.includes(tab) && !options?.disableFacilitySelect) {
    if (!options?.facilityName) {
      const { name } = getFacility();
      options = { ...options, facilityName: name };
    }
    await selectFacility(page, options?.facilityName);
  }
}

/**
 * Select a facility from the facility dropdown.
 * If no facilityName is given, selects the first available facility.
 */
async function selectFacility(page: Page, facilityName?: string) {
  const trigger = page.getByRole("combobox");
  // Only select if the dropdown exists and no facility is already selected
  if (await trigger.isVisible({ timeout: 3_000 }).catch(() => false)) {
    await trigger.click();
    if (facilityName) {
      await page.getByRole("option", { name: facilityName }).click();
    } else {
      // Select the first option
      await page.getByRole("option").first().click();
    }
  }
}
