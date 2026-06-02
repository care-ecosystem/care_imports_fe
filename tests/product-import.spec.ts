import { test, expect, Page } from "@playwright/test";
import { goToImport } from "./helpers/navigation";
import { createTempCsv, uploadCsvFile, cleanupTempFile } from "./helpers/csv";
import {
  downloadSampleCsv,
  expectReviewTable,
  expectValidationError,
  clickImportButton,
  expectImportSuccess,
} from "./helpers/import-flow";

test.use({ storageState: "tests/.auth/user.json" });

/** Skip the inventory configuration step to go straight to CSV upload. */
async function skipInventoryConfig(page: Page) {
  await page.getByRole("button", { name: /skip/i }).click();
}

/** Configure inventory destination (location + supplier) then continue. */
async function configureInventory(page: Page) {
  // Select a location from the tree picker
  const locationPicker = page
    .getByRole("combobox")
    .filter({ hasText: /select location/i });
  await locationPicker.click();
  // Pick the first available location option
  await page.getByRole("option").first().click();

  // Select a supplier from the dropdown
  const supplierTrigger = page
    .getByRole("combobox")
    .filter({ hasText: /select supplier/i });

  await supplierTrigger.click();
  await page.getByRole("option").first().click();

  await page.getByRole("button", { name: /^continue$/i }).click();
}

test.describe("Product Import", () => {
  test.beforeEach(async ({ page }) => {
    await goToImport(page, "product");
  });

  // ─── Configuration Step ──────────────────────────────────────────

  test("should show inventory configuration screen", async ({ page }) => {
    await expect(page.getByText("Import Products")).toBeVisible();
    await expect(page.getByText(/select location/i)).toBeVisible();
    await expect(page.getByText(/select supplier/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /skip/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^continue$/i }),
    ).toBeVisible();
  });

  test("should show warning when location/supplier not selected", async ({
    page,
  }) => {
    await expect(
      page.getByText(/without a location and supplier/i),
    ).toBeVisible();
  });

  test("continue button should be disabled without location and supplier", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", { name: /^continue$/i }),
    ).toBeDisabled();
  });

  test("should download sample CSV from configuration screen", async ({
    page,
  }) => {
    const download = await downloadSampleCsv(page);
    expect(download.suggestedFilename()).toContain("product");
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
  });

  // ─── Skip Inventory Path ────────────────────────────────────────

  test("should skip inventory config and show CSV upload", async ({ page }) => {
    await skipInventoryConfig(page);
    await expect(
      page.getByText(/inventory stock will not be added/i),
    ).toBeVisible();
    // CSV upload should now be available
    await expect(
      page.locator('input[type="file"][accept=".csv"]'),
    ).toBeAttached();
  });

  test("should upload valid CSV after skipping inventory and import", async ({
    page,
  }) => {
    await skipInventoryConfig(page);

    const suffix = Date.now();
    const csvPath = createTempCsv(
      ["name", "type", "product_knowledge_name"],
      [[`Test Product ${suffix}`, "medication", `Test PK ${suffix}`]],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should allow going back to config from import step", async ({
    page,
  }) => {
    await skipInventoryConfig(page);
    await expect(
      page.getByText(/inventory stock will not be added/i),
    ).toBeVisible();

    // Click Change to go back to config
    await page.getByRole("button", { name: /change/i }).click();
    await expect(page.getByText(/destination location/i)).toBeVisible();
  });

  // ─── With Inventory Config Path ─────────────────────────────────

  test("should configure inventory and show destination in import step", async ({
    page,
  }) => {
    await configureInventory(page);
    await expect(page.getByText(/inventory destination/i)).toBeVisible();
  });

  test("should upload CSV with inventory fields after configuring inventory", async ({
    page,
  }) => {
    await configureInventory(page);

    const suffix = Date.now();
    const csvPath = createTempCsv(
      [
        "name",
        "type",
        "inventoryQuantity",
        "lot_number",
        "expiration_date",
        "product_knowledge_name",
      ],
      [
        [
          `Inventory Product ${suffix}`,
          "medication",
          "50",
          "LOT-001",
          "31/12/2027",
          `Test PK ${suffix}`,
        ],
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  // ─── Validation Errors (after skipping config) ──────────────────

  test("should show error for invalid product type", async ({ page }) => {
    await skipInventoryConfig(page);

    const csvPath = createTempCsv(
      ["name", "type", "product_knowledge_name"],
      [["Test Product", "invalid_type", "Some PK"]],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /medication.*consumable/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error when neither PK name nor PK slug provided", async ({
    page,
  }) => {
    await skipInventoryConfig(page);

    const csvPath = createTempCsv(
      ["name", "type", "product_knowledge_name", "product_knowledge_slug"],
      [["Test Product", "medication", "", ""]],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(
        page,
        /product_knowledge_name or product_knowledge_slug/i,
      );
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error when CID name provided without basePrice", async ({
    page,
  }) => {
    await skipInventoryConfig(page);

    const csvPath = createTempCsv(
      [
        "name",
        "type",
        "basePrice",
        "product_knowledge_name",
        "charge_item_definition_name",
        "charge_item_definition_slug",
      ],
      [["Test Product", "medication", "", "Some PK", "Some CID", ""]],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /basePrice is required/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for missing product name", async ({ page }) => {
    await skipInventoryConfig(page);

    const csvPath = createTempCsv(
      ["name", "type", "product_knowledge_name"],
      [["", "medication", "Some PK"]],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /name is required/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });
});
