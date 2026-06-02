import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * Check if the "Import Master Data" button is visible on the upload screen.
 * Master data is only available when the build includes a bundled dataset
 * (REACT_MASTER_DATA_REPO env var is set).
 *
 * Waits for the master data hook to finish loading by waiting for either
 * the "Import Master Data" button or the "No bundled dataset" message.
 */
export async function isMasterDataAvailable(page: Page): Promise<boolean> {
  const importButton = page.getByRole("button", {
    name: /import master data/i,
  });
  const noDatasetText = page.getByText(/no bundled dataset/i);
  let increment = 5;
  while (increment > 0) {
    if (await importButton.isVisible()) {
      break;
    }
    if (await noDatasetText.isVisible()) {
      await page.waitForTimeout(5_000);
      increment--;
    }
  }
  return importButton.isVisible();
}

/**
 * Enter the master data file selector by clicking "Import Master Data".
 */
export async function openMasterDataSelector(page: Page) {
  await page.getByRole("button", { name: /import master data/i }).click();
  await expect(page.getByText(/select.*master data file/i)).toBeVisible({
    timeout: 5_000,
  });
}

/**
 * In the MasterDataFileSelector (single-select), click the first available file.
 * The selector fetches the CSV and transitions to the import flow.
 */
export async function selectFirstMasterFile(page: Page) {
  // Each file is rendered as a button with a FileText icon — click the first one
  const fileButtons = page
    .locator("button", { has: page.locator("svg") })
    .filter({
      hasText: /.csv/i,
    });
  await fileButtons.first().click();
}

/**
 * In the MasterDataFileSelector (multi-select, e.g. OD with selectCount=2),
 * select the first N files then click Continue.
 */
export async function selectMasterFiles(page: Page, count: number) {
  const fileButtons = page
    .locator("button", { has: page.locator("svg") })
    .filter({
      hasText: /.csv/i,
    });
  for (let i = 0; i < count; i++) {
    await fileButtons.nth(i).click();
  }
  await page
    .getByRole("button", { name: new RegExp(`continue with ${count}`, "i") })
    .click();
}

/**
 * Expect the MasterDataFileSelector Back button to return to the upload screen.
 */
export async function clickMasterDataBack(page: Page) {
  await page.getByRole("button", { name: /^back$/i }).click();
}
