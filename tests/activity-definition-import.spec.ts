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
import { goToImport } from "./helpers/navigation";
import { getFacility } from "./utils/facility";

const AD_REQUIRED_HEADERS = [
  "title",
  "description",
  "usage",
  "classification",
  "category_name",
  "code_system",
  "code_value",
  "code_display",
];

const AD_OPTIONAL_HEADERS = [
  "slug_value",
  "status",
  "kind",
  "body_site_system",
  "body_site_code",
  "body_site_display",
  "diagnostic_report_system",
  "diagnostic_report_code",
  "diagnostic_report_display",
  "derived_from_uri",
  "specimen_slugs",
  "observation_slugs",
  "charge_item_slugs",
  "charge_item_price",
  "location_names",
  "healthcare_service_name",
];

const ALL_HEADERS = [...AD_REQUIRED_HEADERS, ...AD_OPTIONAL_HEADERS];

type AdHeader =
  | (typeof AD_REQUIRED_HEADERS)[number]
  | (typeof AD_OPTIONAL_HEADERS)[number];

test.use({ storageState: "tests/.auth/user.json" });

// Module-level variables for test category (populated in beforeAll)
let testCategorySlug: string;
let testCategoryTitle: string;
let testHealthcareServiceName: string;

function makeValidAdRow(
  prefix: string | number,
  overrides: Partial<Record<AdHeader, string>> = {},
): string[] {
  const defaults: Record<AdHeader, string> = {
    title: `AD ${prefix}: Test Activity`,
    description: "Test activity definition",
    usage: "Order test for evaluation",
    classification: "laboratory",
    category_name: "TestCategory",
    code_system: "http://snomed.info/sct",
    code_value: "26604007",
    code_display: "Complete blood count",
    slug_value: "",
    status: "",
    kind: "",
    body_site_system: "",
    body_site_code: "",
    body_site_display: "",
    diagnostic_report_system: "",
    diagnostic_report_code: "",
    diagnostic_report_display: "",
    derived_from_uri: "",
    specimen_slugs: "",
    observation_slugs: "",
    charge_item_slugs: "",
    charge_item_price: "",
    location_names: "",
    healthcare_service_name: "",
  };
  const merged = Object.assign({}, defaults, overrides);
  return ALL_HEADERS.map((h) => merged[h as AdHeader]);
}

test.describe("Activity Definition Import", () => {
  test.beforeAll(async ({ request }) => {
    // Bootstrap test category or reuse existing one
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
          params: { resource_type: "activity_definition" },
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
          resource_type: "activity_definition",
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

  test.beforeAll(async ({ request }) => {
    // Fetch an existing healthcare service (fixtures ensure at least one exists)
    const facility = getFacility();
    const services = await fetchApiResults<{ id: string; name: string }>(
      request,
      "healthcare_service/",
      { facilityId: facility.id },
    );
    if (services.length === 0) {
      throw new Error(
        "No healthcare services found — fixtures should provide at least one",
      );
    }
    testHealthcareServiceName = services[0].name;
    console.log(
      `ℹ️ Using existing healthcare service: ${testHealthcareServiceName}`,
    );
  });

  test.beforeEach(async ({ page }) => {
    await goToImport(page, "activity-definition");
  });

  test("should show upload UI with CSV and master data options", async ({
    page,
  }) => {
    await expect(
      page.getByText(/import activity definitions from csv/i),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /download sample/i }),
    ).toBeVisible();
  });

  test("should download sample CSV", async ({ page }) => {
    const download = await downloadSampleCsv(page);
    expect(download.suggestedFilename()).toMatch(/activity/i);
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
  });

  test("should show master data section", async ({ page }) => {
    await expect(
      page.getByText(/import master data/i).or(page.getByText(/bundled data/i)),
    ).toBeVisible();
  });

  test("should show error for missing required headers", async ({ page }) => {
    const csvPath = createTempCsv(
      ["title", "description"], // missing most required headers
      [["Test", "A description"]],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectUploadError(page, /missing required headers/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for missing title", async ({ page }) => {
    const csvPath = createTempCsv(ALL_HEADERS, [
      [
        "", // empty title
        "A description",
        "Some usage",
        "laboratory",
        "TestCategory",
        "http://snomed.info/sct",
        "26604007",
        "Complete blood count",
        ...new Array(AD_OPTIONAL_HEADERS.length).fill(""),
      ],
    ]);

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /title is required/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for missing description", async ({ page }) => {
    const csvPath = createTempCsv(ALL_HEADERS, [
      [
        "Test Activity",
        "", // empty description
        "Some usage",
        "laboratory",
        "TestCategory",
        "http://snomed.info/sct",
        "26604007",
        "Complete blood count",
        ...new Array(AD_OPTIONAL_HEADERS.length).fill(""),
      ],
    ]);

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /description is required/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for missing code fields", async ({ page }) => {
    const csvPath = createTempCsv(ALL_HEADERS, [
      [
        "Test Activity",
        "A description",
        "Some usage",
        "laboratory",
        "TestCategory",
        "", // empty code_system
        "", // empty code_value
        "", // empty code_display
        ...new Array(AD_OPTIONAL_HEADERS.length).fill(""),
      ],
    ]);

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /code is required/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for missing category_name", async ({ page }) => {
    const csvPath = createTempCsv(ALL_HEADERS, [
      [
        "Test Activity",
        "A description",
        "Some usage",
        "laboratory",
        "", // empty category_name
        "http://snomed.info/sct",
        "26604007",
        "Complete blood count",
        ...new Array(AD_OPTIONAL_HEADERS.length).fill(""),
      ],
    ]);

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(
        page,
        /category name is required|either category/i,
      );
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for invalid slug format", async ({ page }) => {
    const row = makeValidAdRow("slug-test", {
      slug_value: "INVALID SLUG WITH SPACES",
    });

    const csvPath = createTempCsv(ALL_HEADERS, [row]);

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /slug must contain only/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should upload valid CSV and reach review step", async ({ page }) => {
    const prefix = Date.now();
    const csvPath = createTempCsv(ALL_HEADERS, [makeValidAdRow(prefix)]);

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should complete full import flow", async ({ page, request }) => {
    const prefix = Date.now();
    const uniqueTitle = `AD ${prefix}: Test Activity`;
    const csvPath = createTempCsv(ALL_HEADERS, [makeValidAdRow(prefix)]);

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);

      // Verify the imported activity definition exists in the database
      const facility = getFacility();
      const results = await fetchApiResults<{ title: string }>(
        request,
        "activity_definition/",
        { facilityId: facility.id, params: { title: uniqueTitle } },
      );
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toBe(uniqueTitle);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error in review for non-existing specimen dependency", async ({
    page,
  }) => {
    const prefix = Date.now();
    const row = makeValidAdRow(prefix, {
      specimen_slugs: "nonexistent-specimen-slug",
    });

    const csvPath = createTempCsv(ALL_HEADERS, [row]);

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1, totalCount: 1 });
      await expectValidationError(page, /specimen definition not found/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error in review for non-existing observation dependency", async ({
    page,
  }) => {
    const prefix = Date.now();
    const row = makeValidAdRow(prefix, {
      observation_slugs: "nonexistent-observation-slug",
    });

    const csvPath = createTempCsv(ALL_HEADERS, [row]);

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1, totalCount: 1 });
      await expectValidationError(page, /observation definition not found/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error in review for non-existing charge item dependency", async ({
    page,
  }) => {
    const prefix = Date.now();
    const row = makeValidAdRow(prefix, {
      charge_item_slugs: "nonexistent-charge-item-slug",
    });

    const csvPath = createTempCsv(ALL_HEADERS, [row]);

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1, totalCount: 1 });
      await expectValidationError(page, /charge item definition not found/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error in review for non-existing location dependency", async ({
    page,
  }) => {
    const prefix = Date.now();
    const row = makeValidAdRow(prefix, {
      location_names: "Nonexistent Location XYZ",
    });

    const csvPath = createTempCsv(ALL_HEADERS, [row]);

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1, totalCount: 1 });
      await expectValidationError(page, /location not found/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error in review for non-existing healthcare service dependency", async ({
    page,
  }) => {
    const prefix = Date.now();
    const row = makeValidAdRow(prefix, {
      healthcare_service_name: "Nonexistent Healthcare Service",
    });

    const csvPath = createTempCsv(ALL_HEADERS, [row]);

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1, totalCount: 1 });
      await expectValidationError(page, /healthcare service not found/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should import with valid healthcare service and verify via API", async ({
    page,
    request,
  }) => {
    const prefix = Date.now();
    const uniqueTitle = `AD ${prefix}: Test Activity`;
    const row = makeValidAdRow(prefix, {
      slug_value: `ad-${prefix}-test-activity`,
      healthcare_service_name: testHealthcareServiceName,
    });

    const csvPath = createTempCsv(ALL_HEADERS, [row]);

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);

      // Verify the imported AD has the healthcare service linked
      const facility = getFacility();
      const results = await fetchApiResults<{
        title: string;
        healthcare_service?: { name: string };
      }>(
        request,
        `activity_definition/f-${facility.id}-ad-${prefix}-test-activity`,
        {
          facilityId: facility.id,
          paginated: false,
        },
      );
      expect(results).toBeDefined();
      expect(results.title).toBe(uniqueTitle);
      expect(results.healthcare_service?.name).toBe(testHealthcareServiceName);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should accept CSV without category_name header when picker category is selected", async ({
    page,
  }) => {
    // Create headers without category_name
    const headersWithoutCategory = AD_REQUIRED_HEADERS.filter(
      (h) => h !== "category_name",
    ).concat(AD_OPTIONAL_HEADERS);

    const row = [
      "AD: Picker Test Activity",
      "Test activity with picker category",
      "Order test",
      "laboratory",
      // No category_name value
      "http://snomed.info/sct",
      "26604007",
      "Complete blood count",
      ...new Array(AD_OPTIONAL_HEADERS.length).fill(""),
    ];

    const csvPath = createTempCsv(headersWithoutCategory, [row]);

    try {
      // Select category from picker
      await pickCategory(page, testCategoryTitle);

      // Upload CSV without category_name column
      await uploadCsvFile(page, csvPath);

      // Should reach review with valid row
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should import using picker category without category_name column", async ({
    page,
    request,
  }) => {
    const prefix = Date.now();
    const uniqueTitle = `AD ${prefix}: Picker Import Test`;

    // Create headers without category_name
    const headersWithoutCategory = AD_REQUIRED_HEADERS.filter(
      (h) => h !== "category_name",
    ).concat(AD_OPTIONAL_HEADERS);

    const row = [
      uniqueTitle,
      "Test activity with picker category",
      "Order test",
      "laboratory",
      // No category_name value
      "http://snomed.info/sct",
      "26604007",
      "Complete blood count",
      ...new Array(AD_OPTIONAL_HEADERS.length).fill(""),
    ];

    const csvPath = createTempCsv(headersWithoutCategory, [row]);

    try {
      // Select category from picker
      await pickCategory(page, testCategoryTitle);

      // Upload CSV without category_name column
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });

      // Complete import
      await clickImportButton(page);
      await expectImportSuccess(page);

      // Verify the imported activity definition exists in the database
      const facility = getFacility();
      const results = await fetchApiResults<{
        title: string;
        category?: { slug: string };
      }>(request, "activity_definition/", {
        facilityId: facility.id,
        params: { title: uniqueTitle },
      });
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toBe(uniqueTitle);
      // Verify the category from the picker was used
      expect(results[0].category?.slug).toBe(testCategorySlug);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should import CSV with category_name column when picker category is selected (picker takes precedence)", async ({
    page,
    request,
  }) => {
    const prefix = Date.now();
    const uniqueTitle = `AD ${prefix}: Picker Test`;

    // Create CSV with a different category_name value
    const row = [
      uniqueTitle,
      "Test activity to verify picker xeprecedence",
      "Order test",
      "laboratory",
      "IgnoredCategory", // This should be ignored when picker is selected
      "http://snomed.info/sct",
      "26604007",
      "Complete blood count",
      ...new Array(AD_OPTIONAL_HEADERS.length).fill(""),
    ];

    const csvPath = createTempCsv(ALL_HEADERS, [row]);

    try {
      // Select category from picker
      await pickCategory(page, testCategoryTitle);

      // Upload CSV with category_name column
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });

      // Complete import
      await clickImportButton(page);
      await expectImportSuccess(page);

      // Verify the imported activity definition uses the picker category, not the CSV value
      const facility = getFacility();
      const results = await fetchApiResults<{
        title: string;
        category?: { slug: string };
      }>(request, "activity_definition/", {
        facilityId: facility.id,
        params: { title: uniqueTitle },
      });
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title).toBe(uniqueTitle);
      // Verify the picker category was used (not the CSV "IgnoredCategory")
      expect(results[0].category?.slug).toBe(testCategorySlug);
    } finally {
      cleanupTempFile(csvPath);
    }
  });
});
