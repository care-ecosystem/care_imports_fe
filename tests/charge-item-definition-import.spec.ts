import { expect, Page, test } from "@playwright/test";
import { fetchApiResults, getApiBaseUrl, getAuthHeaders } from "./helpers/api";
import { cleanupTempFile, createTempCsv, uploadCsvFile } from "./helpers/csv";
import {
  clickImportButton,
  downloadSampleCsv,
  expectImportSuccess,
  expectReviewTable,
  expectUploadError,
  expectValidationError,
  pickCategory,
} from "./helpers/import-flow";
import { goToImport } from "./helpers/navigation";
import { getFacility } from "./utils/facility";

test.use({ storageState: "tests/.auth/user.json" });

// Module-level variables for test category (populated in beforeAll)
let testCategorySlug: string;
let testCategoryTitle: string;

async function enterCategory(page: Page) {
  await page
    .getByRole("textbox", { name: "e.g. Consultation Charges" })
    .fill(`Test Category ${Date.now()}`);
  await page.getByRole("button", { name: "Continue to Upload" }).click();
}

test.describe("Charge Item Definition Import", () => {
  test.beforeAll(async ({ request }) => {
    const facility = getFacility();
    const apiUrl = getApiBaseUrl();
    const headers = getAuthHeaders();

    // List existing categories
    try {
      const categories = await fetchApiResults<{ slug: string; title: string }>(
        request,
        "resource_category/",
        {
          facilityId: facility.id,
          params: {
            resource_type: "charge_item_definition",
            resource_sub_type: "other",
          },
        },
      );
      if (categories.length > 0) {
        testCategorySlug = categories[0].slug;
        testCategoryTitle = categories[0].title;
        console.log(`ℹ️ Using existing test category: ${testCategoryTitle}`);
        return;
      }
    } catch {
      // No existing categories, create one below
    }

    // Create a new test category
    testCategoryTitle = `Test Category ${Date.now()}`;
    const createResponse = await request.post(
      `${apiUrl}/api/v1/facility/${facility.id}/resource_category/`,
      {
        headers,
        data: {
          title: testCategoryTitle,
          resource_type: "charge_item_definition",
          resource_sub_type: "other",
        },
      },
    );

    if (!createResponse.ok()) {
      throw new Error(
        `Failed to create test category: ${createResponse.status()} ${await createResponse.text()}`,
      );
    }

    const categoryData = await createResponse.json();
    testCategorySlug = categoryData.slug;
    console.log(`✅ Created test category: ${testCategoryTitle}`);
  });

  test.beforeEach(async ({ page }) => {
    await goToImport(page, "charge-item-definition");
  });

  test("should show upload UI with sample download", async ({ page }) => {
    await expect(
      page.getByText("Import Charge Item Definitions"),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /download sample/i }),
    ).toBeVisible();
  });

  test("should download sample CSV", async ({ page }) => {
    const download = await downloadSampleCsv(page);
    expect(download.suggestedFilename()).toContain("charge");
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
  });

  test("should upload valid CSV and import", async ({ page, request }) => {
    await enterCategory(page);
    const suffix = Date.now();
    const uniqueTitle = `Consultation Fee ${suffix}`;
    const csvPath = createTempCsv(
      [
        "title",
        "slug_value",
        "description",
        "purpose",
        "price",
        "status",
        "derived_from_uri",
        "version",
        "can_edit_charge_item",
      ],
      [
        [
          uniqueTitle,
          `consultation-fee-${suffix}`,
          "Doctor consultation",
          "Consultation",
          "250",
          "",
          "",
          "",
          "",
        ],
        [
          `Bed Charges ${suffix}`,
          `bed-charges-${suffix}`,
          "Per day bed charge",
          "Bed usage",
          "1500",
          "draft",
          "",
          "1",
          "false",
        ],
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 2, totalCount: 2 });
      await clickImportButton(page);
      await expectImportSuccess(page);

      // Verify the imported charge item definition exists in the database
      const facility = getFacility();
      const results = await fetchApiResults<{ title: string }>(
        request,
        "charge_item_definition/",
        { facilityId: facility.id, params: { title: uniqueTitle } },
      );
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toBe(uniqueTitle);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should detect duplicate slugs", async ({ page }) => {
    const csvPath = createTempCsv(
      ["title", "slug_value", "price"],
      [
        ["Item A", "same-slug", "100"],
        ["Item B", "same-slug", "200"], // duplicate
      ],
    );

    try {
      await enterCategory(page);
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 2 });
      await expectValidationError(page, /duplicate slug/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for invalid slug format", async ({ page }) => {
    const csvPath = createTempCsv(
      ["title", "slug_value", "price"],
      [["Test Item", "Invalid Slug!", "100"]], // uppercase + special char
    );

    try {
      await enterCategory(page);
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /slug must contain only/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for missing price", async ({ page }) => {
    const csvPath = createTempCsv(
      ["title", "slug_value", "price"],
      [["Test Item", "test-item", ""]], // missing price
    );

    try {
      await enterCategory(page);
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /price is required/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for missing title", async ({ page }) => {
    const csvPath = createTempCsv(
      ["title", "slug_value", "price"],
      [["", "test-slug", "100"]],
    );

    try {
      await enterCategory(page);
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /title is required/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for missing required headers", async ({ page }) => {
    const csvPath = createTempCsv(
      ["title"], // missing slug_value and price
      [["Some Item"]],
    );

    try {
      await enterCategory(page);
      await uploadCsvFile(page, csvPath);
      await expectUploadError(page, /missing required headers/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should disable title input and auto-populate when picker category is selected", async ({
    page,
  }) => {
    const titleInput = page.getByRole("textbox", {
      name: "e.g. Consultation Charges",
    });

    // Initially the input should be enabled and empty
    await expect(titleInput).toBeEnabled();
    await expect(titleInput).toHaveValue("");

    // Select category from picker
    await pickCategory(page, testCategoryTitle);

    // Title input should now be disabled and auto-populated with the picker's category title
    await expect(titleInput).toBeDisabled();
    await expect(titleInput).toHaveValue(testCategoryTitle);
  });

  test("should import using picker category", async ({ page, request }) => {
    const suffix = Date.now();
    const uniqueTitle = `Picker CID ${suffix}`;
    const csvPath = createTempCsv(
      ["title", "slug_value", "price"],
      [[uniqueTitle, `picker-cid-${suffix}`, "300"]],
    );

    try {
      // Select category from picker instead of text input
      await pickCategory(page, testCategoryTitle);

      // Verify title input is disabled and auto-populated
      await expect(
        page.getByRole("textbox", { name: "e.g. Consultation Charges" }),
      ).toBeDisabled();

      await page.getByRole("button", { name: "Continue to Upload" }).click();

      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);

      // Verify the imported charge item definition exists
      const facility = getFacility();
      const results = await fetchApiResults<{
        title: string;
        category?: { slug: string };
      }>(request, "charge_item_definition/", {
        facilityId: facility.id,
        params: { title: uniqueTitle },
      });
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toBe(uniqueTitle);
      expect(results[0].category?.slug).toBe(testCategorySlug);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should update existing items on re-import", async ({ page }) => {
    const suffix = Date.now();
    // Create CSV with a fixed slug for re-import testing
    const csvPath = createTempCsv(
      ["title", "slug_value", "price"],
      [[`Re-import Test Item ${suffix}`, `re-import-test-${suffix}`, "100"]],
    );

    try {
      // First import
      await enterCategory(page);
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);

      // Go back to import page for second import
      await goToImport(page, "charge-item-definition");

      // Second import (update) with same slug
      await enterCategory(page);
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);
    } finally {
      cleanupTempFile(csvPath);
    }
  });
});
