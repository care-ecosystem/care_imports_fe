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

test.use({ storageState: "tests/.auth/user.json" });

test.describe("Location Import", () => {
  test.beforeEach(async ({ page }) => {
    await goToImport(page, "locations");
  });

  test("should show upload UI with sample download", async ({ page }) => {
    await expect(page.getByText("Import Locations from CSV")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /download sample/i }),
    ).toBeVisible();
  });

  test("should download sample CSV", async ({ page }) => {
    const download = await downloadSampleCsv(page);
    expect(download.suggestedFilename()).toContain("location");
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
  });

  test("should upload valid hierarchical location CSV and import", async ({
    page,
  }) => {
    const suffix = Date.now();
    // Location CSV uses the hierarchical format: (Name, type, description) × N levels + department
    const csvPath = createTempCsv(
      [
        "Building",
        "type",
        "description",
        "Ward",
        "type",
        "description",
        "Bed",
        "type",
        "description",
      ],
      [
        [
          `Main_${suffix}`,
          "building",
          "Main building",
          `ICU_${suffix}`,
          "ward",
          "ICU",
          `Bed1_${suffix}`,
          "bed",
          "Bed 1",
        ],
        [
          `Main_${suffix}`,
          "building",
          "",
          `ICU_${suffix}`,
          "ward",
          "",
          `Bed2_${suffix}`,
          "bed",
          "Bed 2",
        ],
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 4 }); // 1 building + 1 ward + 2 beds
      await clickImportButton(page);
      await expectImportSuccess(page);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should detect invalid location type", async ({ page }) => {
    const csvPath = createTempCsv(
      ["Building", "type", "description"],
      [["TestBuilding", "invalid_type", ""]],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /invalid location type/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should detect beds with department assignments", async ({ page }) => {
    const csvPath = createTempCsv(
      [
        "Building",
        "type",
        "description",
        "Bed",
        "type",
        "description",
        "department",
      ],
      [
        [
          "TestBuilding",
          "building",
          "",
          "TestBed",
          "bed",
          "",
          "SomeDepartment", // beds can't have departments
        ],
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      // Should show error about beds not being able to have departments
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(
        page,
        /beds cannot have managing organizations/i,
      );
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should accept all valid location types", async ({ page }) => {
    const suffix = Date.now();
    const csvPath = createTempCsv(
      ["Location", "type", "description"],
      [
        [`Building_${suffix}`, "building", "Test building"],
        [`Ward_${suffix}`, "ward", "Test ward"],
        [`Room_${suffix}`, "room", "Test room"],
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 3, invalidCount: 0 });
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for missing required headers", async ({ page }) => {
    const csvPath = createTempCsv(
      ["Location"], // missing 'type' and 'description'
      [["TestLocation"]],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectUploadError(page, /csv format invalid/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });
});
