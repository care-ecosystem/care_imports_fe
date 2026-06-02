import { test, expect } from "@playwright/test";
import { goToImport } from "./helpers/navigation";
import { createTempCsv, uploadCsvFile, cleanupTempFile } from "./helpers/csv";
import {
  downloadSampleCsv,
  expectReviewTable,
  clickImportButton,
  expectImportSuccess,
  expectValidationError,
  expectUploadError,
} from "./helpers/import-flow";

const SD_REQUIRED_HEADERS = [
  "title",
  "slug_value",
  "description",
  "type_collected_system",
  "type_collected_code",
  "type_collected_display",
];

const SD_OPTIONAL_HEADERS = [
  "status",
  "derived_from_uri",
  "collection_system",
  "collection_code",
  "collection_display",
  "is_derived",
  "preference",
  "single_use",
  "requirement",
  "retention_value",
  "retention_unit_system",
  "retention_unit_code",
  "retention_unit_display",
  "container_description",
  "container_capacity_value",
  "container_capacity_unit_system",
  "container_capacity_unit_code",
  "container_capacity_unit_display",
  "container_minimum_volume_quantity_value",
  "container_minimum_volume_quantity_unit_system",
  "container_minimum_volume_quantity_unit_code",
  "container_minimum_volume_quantity_unit_display",
  "container_minimum_volume_string",
  "container_cap_system",
  "container_cap_code",
  "container_cap_display",
  "container_preparation",
];

test.use({ storageState: "tests/.auth/user.json" });

function makeValidSdRow(suffix: string | number): string[] {
  return [
    `Blood ${suffix}`, // title
    `blood-${suffix}`, // slug_value
    "Blood specimen", // description
    "http://terminology.hl7.org/CodeSystem/v2-0487", // type_collected_system
    "ACNFLD", // type_collected_code
    "Fluid, Acne", // type_collected_display
    ...new Array(SD_OPTIONAL_HEADERS.length).fill(""),
  ];
}

test.describe("Specimen Definition Import", () => {
  test.beforeEach(async ({ page }) => {
    await goToImport(page, "specimen-definitions");
  });

  test("should show upload UI with CSV and master data options", async ({
    page,
  }) => {
    await expect(
      page.getByText(/import specimen definitions from csv/i),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /download sample/i }),
    ).toBeVisible();
  });

  test("should download sample CSV", async ({ page }) => {
    const download = await downloadSampleCsv(page);
    expect(download.suggestedFilename()).toMatch(/specimen/i);
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
  });

  test("should upload valid CSV and import", async ({ page }) => {
    const suffix = Date.now();
    const csvPath = createTempCsv(
      [...SD_REQUIRED_HEADERS, ...SD_OPTIONAL_HEADERS],
      [makeValidSdRow(suffix)],
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

  test("should show error for missing type_collected fields", async ({
    page,
  }) => {
    const csvPath = createTempCsv(
      [...SD_REQUIRED_HEADERS, ...SD_OPTIONAL_HEADERS],
      [
        [
          "Blood Test",
          "blood-test",
          "Blood specimen",
          "", // missing type_collected_system
          "", // missing type_collected_code
          "", // missing type_collected_display
          ...new Array(SD_OPTIONAL_HEADERS.length).fill(""),
        ],
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      // CodeSchema requires system, code, display
      await expectValidationError(
        page,
        /system is required|code is required|required/i,
      );
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for invalid derived_from_uri", async ({ page }) => {
    const csvPath = createTempCsv(
      [...SD_REQUIRED_HEADERS, ...SD_OPTIONAL_HEADERS],
      [
        [
          "Blood Test",
          "blood-test-uri",
          "Blood specimen",
          "http://terminology.hl7.org/CodeSystem/v2-0487",
          "ACNFLD",
          "Fluid, Acne",
          "", // status
          "not-a-valid-url", // derived_from_uri — invalid!
          ...new Array(SD_OPTIONAL_HEADERS.length - 2).fill(""),
        ],
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /valid url/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for invalid slug format", async ({ page }) => {
    const csvPath = createTempCsv(
      [...SD_REQUIRED_HEADERS, ...SD_OPTIONAL_HEADERS],
      [
        [
          "Blood Test",
          "INVALID SLUG", // uppercase and spaces
          "Blood specimen",
          "http://terminology.hl7.org/CodeSystem/v2-0487",
          "ACNFLD",
          "Fluid, Acne",
          ...new Array(SD_OPTIONAL_HEADERS.length).fill(""),
        ],
      ],
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
    const csvPath = createTempCsv(
      ["title", "slug_value"], // missing description and type_collected_*
      [["Test", "test-slug"]],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectUploadError(page, /missing required headers/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for missing title", async ({ page }) => {
    const csvPath = createTempCsv(
      [...SD_REQUIRED_HEADERS, ...SD_OPTIONAL_HEADERS],
      [
        [
          "", // empty title
          "blood-test",
          "Desc",
          "http://terminology.hl7.org/CodeSystem/v2-0487",
          "ACNFLD",
          "Fluid, Acne",
          ...new Array(SD_OPTIONAL_HEADERS.length).fill(""),
        ],
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /title is required/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });
});
