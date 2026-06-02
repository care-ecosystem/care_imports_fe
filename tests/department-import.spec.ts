import { expect, test } from "@playwright/test";
import { cleanupTempFile, createTempCsv, uploadCsvFile } from "./helpers/csv";
import {
  clickImportButton,
  downloadSampleCsv,
  expectImportSuccess,
  expectReviewTable,
  expectValidationError,
} from "./helpers/import-flow";
import { goToImport } from "./helpers/navigation";

test.use({ storageState: "tests/.auth/user.json" });

test.describe("Department Import", () => {
  test.beforeEach(async ({ page }) => {
    await goToImport(page, "departments");
  });

  test("should show upload UI with sample download", async ({ page }) => {
    await expect(page.getByText("Import Departments from CSV")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /download sample/i }),
    ).toBeVisible();
  });

  test("should download sample CSV", async ({ page }) => {
    const download = await downloadSampleCsv(page);
    expect(download.suggestedFilename()).toContain("department");
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
  });

  test("should upload valid hierarchical CSV and import", async ({ page }) => {
    const suffix = Date.now();
    const csvPath = createTempCsv(
      ["Name", "Parent"],
      [
        [`Cardiology_${suffix}`, ""],
        [`Cardiac ICU_${suffix}`, `Cardiology_${suffix}`],
        [`Cardiac Surgery_${suffix}`, `Cardiology_${suffix}`],
        [`Pediatrics_${suffix}`, ""],
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { validCount: 4, totalCount: 4 });
      await clickImportButton(page);
      await expectImportSuccess(page);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should detect circular references", async ({ page }) => {
    const csvPath = createTempCsv(
      ["Name", "Parent"],
      [
        ["DeptA", "DeptC"],
        ["DeptB", "DeptA"],
        ["DeptC", "DeptB"],
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /circular reference/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should detect missing parent", async ({ page }) => {
    const csvPath = createTempCsv(
      ["Name", "Parent"],
      [["SubDept", "NonExistentParent"]],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /parent.*not found/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should detect duplicate departments under same parent", async ({
    page,
  }) => {
    const csvPath = createTempCsv(
      ["Name", "Parent"],
      [
        ["Cardiology", ""],
        ["Cardiology", ""], // duplicate at root
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 2 });
      await expectValidationError(page, /duplicate/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for missing department name", async ({ page }) => {
    const csvPath = createTempCsv(
      ["Name", "Parent"],
      [["", "Foobar"]], // empty name
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /department name is required/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should handle self-referencing parent", async ({ page }) => {
    const csvPath = createTempCsv(
      ["Name", "Parent"],
      [["SelfDept", "SelfDept"]],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      // Either circular reference or missing parent error
      await expectValidationError(page, /circular|not found/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });
});
