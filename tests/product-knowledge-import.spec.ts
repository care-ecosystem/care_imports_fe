import { expect, test } from "@playwright/test";
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
import {
  clickMasterDataBack,
  isMasterDataAvailable,
  openMasterDataSelector,
  selectFirstMasterFile,
} from "./helpers/master-data";
import { goToImport } from "./helpers/navigation";
import { getFacility } from "./utils/facility";

const PK_REQUIRED_HEADERS = [
  "resourceCategory",
  "slug",
  "name",
  "productType",
  "baseUnitDisplay",
] as const;

const PK_OPTIONAL_HEADERS = [
  "codeDisplay",
  "codeValue",
  "dosageFormDisplay",
  "dosageFormCode",
  "routeCode",
  "routeDisplay",
  "alternateIdentifier",
  "alternateNameType",
  "alternateNameValue",
] as const;

const ALL_HEADERS = [...PK_REQUIRED_HEADERS, ...PK_OPTIONAL_HEADERS];

type PkHeader =
  | (typeof PK_REQUIRED_HEADERS)[number]
  | (typeof PK_OPTIONAL_HEADERS)[number];

function makeValidPkRow(
  suffix: string | number,
  overrides: Partial<Record<PkHeader, string>> = {},
): string[] {
  const defaults: Record<PkHeader, string> = {
    resourceCategory: "Medication",
    slug: `test-pk-${suffix}`,
    name: `Test PK ${suffix}`,
    productType: "medication",
    baseUnitDisplay: "tablets",
    codeDisplay: "",
    codeValue: "",
    dosageFormDisplay: "",
    dosageFormCode: "",
    routeCode: "",
    routeDisplay: "",
    alternateIdentifier: "",
    alternateNameType: "",
    alternateNameValue: "",
  };
  const merged = Object.assign({}, defaults, overrides);
  return ALL_HEADERS.map((h) => merged[h as PkHeader]);
}

test.use({ storageState: "tests/.auth/user.json" });

// Module-level variables for test category (populated in beforeAll)
let testCategorySlug: string;
let testCategoryTitle: string;
let facility: { id: string; name: string };

test.describe("Product Knowledge Import", () => {
  test.beforeAll(async ({ request }) => {
    // Bootstrap test category or reuse existing one
    facility = getFacility();
    const apiUrl = getApiBaseUrl();
    const headers = getAuthHeaders();

    // List existing categories
    try {
      const categories = await fetchApiResults<{ slug: string; title: string }>(
        request,
        `resource_category/`,
        {
          facilityId: facility.id,
          params: { resource_type: "product_knowledge" },
        },
      );
      if (categories.length > 0) {
        testCategorySlug = categories[0].slug;
        testCategoryTitle = categories[0].title;
        console.log(`ℹ️ Using existing PK test category: ${testCategoryTitle}`);
        return;
      }
    } catch {
      // No existing categories, create one below
    }

    // Create a new test category
    testCategoryTitle = `PK Test Category ${Date.now()}`;
    const createResponse = await request.post(
      `${apiUrl}/api/v1/facility/${facility.id}/resource_category/`,
      {
        headers,
        data: {
          title: testCategoryTitle,
          resource_type: "product_knowledge",
          resource_sub_type: "other",
        },
      },
    );

    if (!createResponse.ok()) {
      throw new Error(
        `Failed to create PK test category: ${createResponse.status()} ${await createResponse.text()}`,
      );
    }

    const categoryData = await createResponse.json();
    testCategorySlug = categoryData.slug;
    console.log(`✅ Created PK test category: ${testCategoryTitle}`);
  });

  test.beforeEach(async ({ page }) => {
    await goToImport(page, "product-knowledge");
  });

  // ─── Upload Screen ───────────────────────────────────────────────

  test("should show upload UI with CSV and master data options", async ({
    page,
  }) => {
    await expect(
      page.getByText(/import product knowledge from csv/i),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /download sample/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/import product knowledge from dataset/i),
    ).toBeVisible();
  });

  test("should download sample CSV from upload screen", async ({ page }) => {
    const download = await downloadSampleCsv(page);
    expect(download.suggestedFilename()).toContain("product knowledge");
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
  });

  // ─── CSV Path ────────────────────────────────────────────────────

  test("should upload valid CSV and import", async ({ page }) => {
    const suffix = Date.now();
    const csvPath = createTempCsv([...ALL_HEADERS], [makeValidPkRow(suffix)]);

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for invalid base unit", async ({ page }) => {
    const csvPath = createTempCsv(
      ["resourceCategory", "slug", "name", "productType", "baseUnitDisplay"],
      [
        [
          "Medication",
          "test-pk-invalid",
          "Test PK",
          "medication",
          "invalid_unit",
        ],
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /could not resolve base unit/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for duplicate slugs", async ({ page }) => {
    const csvPath = createTempCsv(
      ["resourceCategory", "slug", "name", "productType", "baseUnitDisplay"],
      [
        ["Medication", "same-slug", "PK One", "medication", "tablets"],
        ["Medication", "same-slug", "PK Two", "medication", "tablets"],
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 2 });
      await expectValidationError(page, /duplicate slug/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for invalid product type", async ({ page }) => {
    const csvPath = createTempCsv(
      ["resourceCategory", "slug", "name", "productType", "baseUnitDisplay"],
      [["Medication", "test-pk", "Test", "invalid_type", "tablets"]],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /medication|consumable|nutritional/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for invalid slug format", async ({ page }) => {
    const csvPath = createTempCsv(
      ["resourceCategory", "slug", "name", "productType", "baseUnitDisplay"],
      [["Medication", "Invalid Slug!", "Test", "medication", "tablets"]],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /slug must contain only/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for missing required headers", async ({ page }) => {
    const csvPath = createTempCsv(["slug", "name"], [["test-slug", "Test"]]);

    try {
      await uploadCsvFile(page, csvPath);
      await expectUploadError(page, /missing required headers/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  // ─── Category Picker ─────────────────────────────────────────────

  test("should accept CSV without resourceCategory header when picker is used", async ({
    page,
  }) => {
    const suffix = Date.now();
    const headersWithoutCategory = [
      ...PK_REQUIRED_HEADERS,
      ...PK_OPTIONAL_HEADERS,
    ].filter((h) => h !== "resourceCategory");
    const row = makeValidPkRow(suffix);
    // Remove resourceCategory value (index 0)
    const rowWithoutCategory = headersWithoutCategory.map(
      (h) => row[ALL_HEADERS.indexOf(h)],
    );

    const csvPath = createTempCsv(headersWithoutCategory, [rowWithoutCategory]);

    try {
      await pickCategory(page, testCategoryTitle);
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should import using picker category and verify via API", async ({
    page,
    request,
  }) => {
    const suffix = Date.now();
    const uniqueName = `Test PK ${suffix}`;
    const uniqueSlug = `test-pk-picker-${suffix}`;

    const headersWithoutCategory = [
      ...PK_REQUIRED_HEADERS,
      ...PK_OPTIONAL_HEADERS,
    ].filter((h) => h !== "resourceCategory");
    const row = makeValidPkRow(suffix, {
      name: uniqueName,
      slug: uniqueSlug,
    });
    const rowWithoutCategory = headersWithoutCategory.map(
      (h) => row[ALL_HEADERS.indexOf(h)],
    );

    const csvPath = createTempCsv(headersWithoutCategory, [rowWithoutCategory]);

    try {
      await pickCategory(page, testCategoryTitle);
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);

      // Verify via API (PK is NOT facility-scoped)
      const results = await fetchApiResults<{
        name: string;
        slug: string;
        slug_config: { slug_value: string };
      }>(request, `/api/v1/product_knowledge/f-${facility.id}-${uniqueSlug}`, {
        paginated: false,
      });
      expect(results.name).toBe(uniqueName);
      expect(results.slug_config.slug_value).toBe(uniqueSlug);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("picker category should override CSV resourceCategory column", async ({
    page,
    request,
  }) => {
    const suffix = Date.now();
    const uniqueName = `Test PK Override ${suffix}`;
    const uniqueSlug = `test-pk-override-${suffix}`;

    // CSV has a resourceCategory value, but picker should take precedence
    const csvPath = createTempCsv(
      [...ALL_HEADERS],
      [
        makeValidPkRow(suffix, {
          name: uniqueName,
          slug: uniqueSlug,
          resourceCategory: "SomeOtherCategory",
        }),
      ],
    );

    try {
      await pickCategory(page, testCategoryTitle);
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);

      // Verify the picker category was used, not the CSV value
      const results = await fetchApiResults<{
        name: string;
        category?: { slug: string };
      }>(request, `/api/v1/product_knowledge/f-${facility.id}-${uniqueSlug}`, {
        paginated: false,
      });
      expect(results.category?.slug).toBe(testCategorySlug);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should import with CSV category and verify via API", async ({
    page,
    request,
  }) => {
    const suffix = Date.now();
    const uniqueName = `Test PK CSV Cat ${suffix}`;
    const uniqueSlug = `test-pk-csvcat-${suffix}`;

    const csvPath = createTempCsv(
      [...ALL_HEADERS],
      [makeValidPkRow(suffix, { name: uniqueName, slug: uniqueSlug })],
    );

    try {
      // No picker — use CSV resourceCategory column
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);

      // Verify the imported product knowledge exists
      const results = await fetchApiResults<{
        name: string;
        slug_config: { slug_value: string };
      }>(request, `/api/v1/product_knowledge/f-${facility.id}-${uniqueSlug}`, {
        paginated: false,
      });
      expect(results.name).toBe(uniqueName);
      expect(results.slug_config.slug_value).toBe(uniqueSlug);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  // ─── Master Data Path ───────────────────────────────────────────

  test("should show master data selector and navigate back", async ({
    page,
  }) => {
    const available = await isMasterDataAvailable(page);
    if (available) {
      await openMasterDataSelector(page);
      await expect(page.getByText(/select a master data file/i)).toBeVisible();
      await clickMasterDataBack(page);
      await expect(
        page.getByText(/import product knowledge from csv/i),
      ).toBeVisible();
    }
  });

  test("should import from master data file", async ({ page }) => {
    const available = await isMasterDataAvailable(page);
    if (available) {
      await openMasterDataSelector(page);
      await selectFirstMasterFile(page);

      // Should transition to ImportFlow with pre-parsed rows
      await expect(page.getByText(/^Review /)).toBeVisible({ timeout: 15_000 });
    }
  });
});

// ─── Instance-Level Import (No Facility) ──────────────────────────
const INSTANCE_HEADERS = [
  "slug",
  "name",
  "productType",
  "baseUnitDisplay",
] as const;

function makeInstanceRow(
  suffix: string | number,
  overrides: Partial<Record<(typeof INSTANCE_HEADERS)[number], string>> = {},
): string[] {
  const defaults = {
    slug: `test-pk-inst-${suffix}`,
    name: `Test PK Instance ${suffix}`,
    productType: "medication",
    baseUnitDisplay: "tablets",
  };
  const merged = { ...defaults, ...overrides };
  return INSTANCE_HEADERS.map((h) => merged[h]);
}

test.describe("Product Knowledge Instance-Level Import", () => {
  test.beforeEach(async ({ page }) => {
    await goToImport(page, "product-knowledge", {
      disableFacilitySelect: true,
    });
  });

  test("should show instance-level warning when no facility selected", async ({
    page,
  }) => {
    await expect(
      page.getByText(/facility not selected.*instance level/i),
    ).toBeVisible();
  });

  test("should not show category picker without facility", async ({ page }) => {
    await expect(
      page.getByRole("combobox").filter({ hasText: /select a category/i }),
    ).not.toBeVisible();
  });

  test("should not require resourceCategory header at instance level", async ({
    page,
  }) => {
    const suffix = Date.now();
    const csvPath = createTempCsv(
      [...INSTANCE_HEADERS],
      [makeInstanceRow(suffix)],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should upload valid CSV and import at instance level", async ({
    page,
    request,
  }) => {
    const suffix = Date.now();
    const uniqueSlug = `test-pk-inst-${suffix}`;
    const uniqueName = `Test PK Instance ${suffix}`;
    const csvPath = createTempCsv(
      [...INSTANCE_HEADERS],
      [makeInstanceRow(suffix, { slug: uniqueSlug, name: uniqueName })],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);

      // Verify via API using instance-level slug format (i-{slug})
      const results = await fetchApiResults<{
        name: string;
        slug_config: { slug_value: string };
      }>(request, `/api/v1/product_knowledge/i-${uniqueSlug}`, {
        paginated: false,
      });
      expect(results.name).toBe(uniqueName);
      expect(results.slug_config.slug_value).toBe(uniqueSlug);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should accept CSV with resourceCategory column but ignore it at instance level", async ({
    page,
    request,
  }) => {
    const suffix = Date.now();
    const uniqueSlug = `test-pk-inst-cat-${suffix}`;
    const uniqueName = `Test PK Instance Cat ${suffix}`;
    const csvPath = createTempCsv(
      [...ALL_HEADERS],
      [
        makeValidPkRow(suffix, {
          slug: uniqueSlug,
          name: uniqueName,
          resourceCategory: "SomeCategory",
        }),
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);

      // Verify the resource exists at instance level with no category
      const results = await fetchApiResults<{
        name: string;
        category?: { slug: string } | null;
      }>(request, `/api/v1/product_knowledge/i-${uniqueSlug}`, {
        paginated: false,
      });
      expect(results.name).toBe(uniqueName);
      expect(results.category).toBeFalsy();
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should still validate slug format at instance level", async ({
    page,
  }) => {
    const csvPath = createTempCsv(
      [...INSTANCE_HEADERS],
      [makeInstanceRow("bad", { slug: "Invalid Slug!" })],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /slug must contain only/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should still validate product type at instance level", async ({
    page,
  }) => {
    const csvPath = createTempCsv(
      [...INSTANCE_HEADERS],
      [makeInstanceRow("bad", { productType: "invalid_type" })],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /medication|consumable|nutritional/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should still show error for invalid base unit at instance level", async ({
    page,
  }) => {
    const csvPath = createTempCsv(
      [...INSTANCE_HEADERS],
      [makeInstanceRow("bad", { baseUnitDisplay: "invalid_unit" })],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /could not resolve base unit/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should still show error for duplicate slugs at instance level", async ({
    page,
  }) => {
    const csvPath = createTempCsv(
      [...INSTANCE_HEADERS],
      [
        makeInstanceRow("dup", { slug: "same-slug-inst" }),
        makeInstanceRow("dup2", { slug: "same-slug-inst" }),
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 2 });
      await expectValidationError(page, /duplicate slug/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });
});
