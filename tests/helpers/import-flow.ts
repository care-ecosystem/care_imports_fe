import type { Download, Page } from "@playwright/test";
import { expect } from "@playwright/test";

/**
 * Click "Download Sample CSV" and return the Download object.
 * Works for both CsvUploader and custom upload UIs.
 */
export async function downloadSampleCsv(page: Page): Promise<Download> {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /download sample/i }).click(),
  ]);
  return download;
}

/**
 * Assert the review table is visible with expected valid/invalid counts.
 */
export async function expectReviewTable(
  page: Page,
  opts: { validCount?: number; invalidCount?: number; totalCount?: number },
) {
  // Wait for the review card to appear
  await expect(page.getByText(/^Review /)).toBeVisible({ timeout: 10_000 });

  if (opts.validCount !== undefined) {
    await expect(
      page.getByText(`${opts.validCount} valid`, { exact: true }),
    ).toBeVisible();
  }
  if (opts.invalidCount !== undefined && opts.invalidCount > 0) {
    await expect(page.getByText(`${opts.invalidCount} invalid`)).toBeVisible();
  }
  if (opts.totalCount !== undefined) {
    await expect(page.getByText(`${opts.totalCount} total`)).toBeVisible();
  }
}

/**
 * Click the import button (e.g. "Import 3 Users") to start the import.
 */
export async function clickImportButton(page: Page) {
  await page.getByRole("button", { name: /^import \d+/i }).click();
}

/**
 * Wait for import to complete and assert success.
 */
export async function expectImportSuccess(page: Page, resourceName?: string) {
  await expect(page.getByText(/import complete/i)).toBeVisible({
    timeout: 60_000,
  });
  if (resourceName) {
    await expect(page.getByText(/imported successfully/i)).toBeVisible();
  }
}

/**
 * Wait for import to complete (with possible failures).
 */
export async function expectImportComplete(page: Page) {
  await expect(
    page.getByText(/import complete/i).or(page.getByText(/import failed/i)),
  ).toBeVisible({ timeout: 60_000 });
}

/**
 * Assert a specific validation error is shown in the review table or upload area.
 */
export async function expectValidationError(
  page: Page,
  errorText: string | RegExp,
) {
  await expect(page.getByText(errorText).first()).toBeVisible({
    timeout: 5_000,
  });
}

/**
 * Assert the upload error alert is visible with specific text.
 */
export async function expectUploadError(
  page: Page,
  errorText: string | RegExp,
) {
  await expect(page.locator('[role="alert"]').getByText(errorText)).toBeVisible(
    { timeout: 5_000 },
  );
}

/**
 * Click the Back button.
 */
export async function clickBack(page: Page) {
  await page.getByRole("button", { name: /^back$/i }).click();
}

/**
 * Assert the import button shows a specific count.
 */
export async function expectImportButtonCount(page: Page, count: number) {
  await expect(
    page.getByRole("button", { name: new RegExp(`^import ${count}`, "i") }),
  ).toBeVisible();
}

/**
 * Pick a category from the ResourceCategoryPicker (e.g., for Activity Definition imports).
 * Clicks the category picker combobox, searches for the category by title, and selects it.
 */
export async function pickCategory(page: Page, categoryTitle: string) {
  // Click the category picker combobox trigger
  await page
    .getByRole("combobox")
    .filter({ hasText: "Select a category" })
    .click();

  // Wait for the picker UI to be interactive
  await expect(page.getByRole("option").first()).toBeVisible({
    timeout: 5_000,
  });

  // Fill the search input to filter categories
  await page.getByPlaceholder(/search.*categor/i).fill(categoryTitle);

  // Wait for the matching category option to appear
  await expect(
    page.getByRole("option", { name: new RegExp(categoryTitle, "i") }),
  ).toBeVisible({ timeout: 3_000 });

  // Click the matching category option
  await page
    .getByRole("option", { name: new RegExp(categoryTitle, "i") })
    .click();

  // Verify selection is reflected in the combobox
  await expect(
    page.getByRole("combobox").filter({ hasText: categoryTitle }),
  ).toBeVisible({ timeout: 3_000 });
}
