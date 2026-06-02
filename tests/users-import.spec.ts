import { expect, test } from "@playwright/test";
import { cleanupTempFile, createTempCsv, uploadCsvFile } from "./helpers/csv";
import {
  clickImportButton,
  downloadSampleCsv,
  expectImportSuccess,
  expectReviewTable,
  expectUploadError,
  expectValidationError,
} from "./helpers/import-flow";
import { goToImport } from "./helpers/navigation";

test.use({ storageState: "tests/.auth/user.json" });

test.describe("Users Import", () => {
  test.beforeEach(async ({ page }) => {
    await goToImport(page, "users");
  });

  test("should show upload UI with sample download", async ({ page }) => {
    await expect(page.getByText("Import Users from CSV")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /download sample/i }),
    ).toBeVisible();
  });

  test("should download sample CSV", async ({ page }) => {
    const download = await downloadSampleCsv(page);
    expect(download.suggestedFilename()).toContain("user");
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
  });

  test("should upload valid CSV and import successfully", async ({ page }) => {
    const csvPath = createTempCsv(
      [
        "User Type",
        "Prefix",
        "First Name",
        "Last Name",
        "Email",
        "Phone Number",
        "Gender",
        "Password",
        "Username",
        "Geo Organization",
      ],
      [
        [
          "doctor",
          "Dr.",
          "Test",
          "User",
          `test.user.${Date.now()}@example.com`,
          "+919" + Math.floor(100000000 + Math.random() * 900000000).toString(),
          "male",
          "SecurePass123!",
          `testuser_${Date.now()}`,
          "",
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

  test("should show error for missing required field (email)", async ({
    page,
  }) => {
    const csvPath = createTempCsv(
      [
        "User Type",
        "Prefix",
        "First Name",
        "Last Name",
        "Email",
        "Phone Number",
        "Gender",
        "Password",
        "Username",
      ],
      [
        [
          "doctor",
          "Dr.",
          "Test",
          "User",
          "", // empty email
          "+919876543210",
          "male",
          "SecurePass123!",
          "testuser",
        ],
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /invalid email/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for invalid email format", async ({ page }) => {
    const csvPath = createTempCsv(
      [
        "User Type",
        "Prefix",
        "First Name",
        "Last Name",
        "Email",
        "Phone Number",
        "Gender",
        "Password",
        "Username",
      ],
      [
        [
          "doctor",
          "Dr.",
          "Test",
          "User",
          "not-an-email",
          "+919876543210",
          "male",
          "SecurePass123!",
          "testuser",
        ],
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /invalid email/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for short password", async ({ page }) => {
    const csvPath = createTempCsv(
      [
        "User Type",
        "Prefix",
        "First Name",
        "Last Name",
        "Email",
        "Phone Number",
        "Gender",
        "Password",
        "Username",
      ],
      [
        [
          "doctor",
          "Dr.",
          "Test",
          "User",
          "a@b.com",
          "+91123",
          "male",
          "short",
          "user1",
        ],
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /password must be at least 8/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for missing required headers", async ({ page }) => {
    const csvPath = createTempCsv(
      ["User Type", "First Name"], // missing most required headers
      [["doctor", "Test"]],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectUploadError(page, /missing required headers/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for missing first name", async ({ page }) => {
    const csvPath = createTempCsv(
      [
        "User Type",
        "Prefix",
        "First Name",
        "Last Name",
        "Email",
        "Phone Number",
        "Gender",
        "Password",
        "Username",
      ],
      [
        [
          "doctor",
          "Dr.",
          "", // missing first name
          "User",
          "test@example.com",
          "+919876543210",
          "male",
          "SecurePass123!",
          "testuser",
        ],
      ],
    );

    try {
      await uploadCsvFile(page, csvPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(page, /first name is required/i);
    } finally {
      cleanupTempFile(csvPath);
    }
  });
});
