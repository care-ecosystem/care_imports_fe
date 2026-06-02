import { test, expect } from "@playwright/test";
import { goToImport } from "./helpers/navigation";
import {
  createTempCsv,
  uploadValueSetCsv,
  cleanupTempFile,
} from "./helpers/csv";

test.use({ storageState: "tests/.auth/user.json" });

test.describe("ValueSet Import", () => {
  test.beforeEach(async ({ page }) => {
    await goToImport(page, "valuesets");
  });

  test("should show upload UI with sample download", async ({ page }) => {
    await expect(page.getByText("Import Value Sets from CSV")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /download sample/i }),
    ).toBeVisible();
  });

  test("should download sample CSV", async ({ page }) => {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /download sample/i }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/valueset/i);
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
  });

  test("should upload valid CSV and proceed to code verification", async ({
    page,
  }) => {
    const csvPath = createTempCsv(
      [
        "name",
        "slug",
        "description",
        "compose_type",
        "system",
        "entry_type",
        "code",
        "display",
        "filter_property",
        "filter_op",
        "filter_value",
      ],
      [
        [
          "Test ValueSet",
          `test-vs-${Date.now()}`,
          "A test valueset",
          "include",
          "http://snomed.info/sct",
          "concept",
          "12345",
          "Test Concept",
          "",
          "",
          "",
        ],
      ],
    );

    try {
      await uploadValueSetCsv(page, csvPath);
      // Should show verifying codes step
      await expect(page.getByText(/verifying codes/i)).toBeVisible({
        timeout: 10_000,
      });
      // Wait for verification to complete → review screen
      await expect(
        page.getByText(/review/i).or(page.getByText(/value set/i)),
      ).toBeVisible({ timeout: 30_000 });
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for invalid slug characters", async ({ page }) => {
    const csvPath = createTempCsv(
      [
        "name",
        "slug",
        "description",
        "compose_type",
        "system",
        "entry_type",
        "code",
        "display",
        "filter_property",
        "filter_op",
        "filter_value",
      ],
      [
        [
          "Bad VS",
          "Invalid Slug!",
          "",
          "include",
          "http://snomed.info/sct",
          "concept",
          "12345",
          "Test",
          "",
          "",
          "",
        ],
      ],
    );

    try {
      await uploadValueSetCsv(page, csvPath);
      await expect(page.getByText(/review value sets/i)).toBeVisible({
        timeout: 30_000,
      });
      await page.locator("tbody button").first().click();
      await expect(page.getByText(/invalid characters/i)).toBeVisible({
        timeout: 5_000,
      });
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for invalid compose_type", async ({ page }) => {
    const csvPath = createTempCsv(
      [
        "name",
        "slug",
        "description",
        "compose_type",
        "system",
        "entry_type",
        "code",
        "display",
        "filter_property",
        "filter_op",
        "filter_value",
      ],
      [
        [
          "Bad VS",
          "bad-vs",
          "",
          "invalid_type", // not include/exclude
          "http://snomed.info/sct",
          "concept",
          "12345",
          "Test",
          "",
          "",
          "",
        ],
      ],
    );

    try {
      await uploadValueSetCsv(page, csvPath);
      await expect(page.getByText(/review value sets/i)).toBeVisible({
        timeout: 30_000,
      });
      await page.locator("tbody button").first().click();
      await expect(page.getByText(/invalid compose_type/i)).toBeVisible({
        timeout: 5_000,
      });
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for concept entry missing code", async ({ page }) => {
    const csvPath = createTempCsv(
      [
        "name",
        "slug",
        "description",
        "compose_type",
        "system",
        "entry_type",
        "code",
        "display",
        "filter_property",
        "filter_op",
        "filter_value",
      ],
      [
        [
          "Bad VS",
          "bad-vs-code",
          "",
          "include",
          "http://snomed.info/sct",
          "concept",
          "", // missing code for concept
          "",
          "",
          "",
          "",
        ],
      ],
    );

    try {
      await uploadValueSetCsv(page, csvPath);
      await expect(page.getByText(/review value sets/i)).toBeVisible({
        timeout: 30_000,
      });
      await page.locator("tbody button").first().click();
      await expect(page.getByText(/missing code/i)).toBeVisible({
        timeout: 5_000,
      });
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for filter entry with invalid op", async ({
    page,
  }) => {
    const csvPath = createTempCsv(
      [
        "name",
        "slug",
        "description",
        "compose_type",
        "system",
        "entry_type",
        "code",
        "display",
        "filter_property",
        "filter_op",
        "filter_value",
      ],
      [
        [
          "Bad VS",
          "bad-vs-filter",
          "",
          "include",
          "http://snomed.info/sct",
          "filter",
          "",
          "",
          "concept",
          "invalid_op", // not a valid filter op
          "some-value",
        ],
      ],
    );

    try {
      await uploadValueSetCsv(page, csvPath);
      await expect(page.getByText(/review value sets/i)).toBeVisible({
        timeout: 30_000,
      });
      await page.locator("tbody button").first().click();
      await expect(page.getByText(/invalid.*op/i)).toBeVisible({
        timeout: 5_000,
      });
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for filter entry missing filter_property", async ({
    page,
  }) => {
    const csvPath = createTempCsv(
      [
        "name",
        "slug",
        "description",
        "compose_type",
        "system",
        "entry_type",
        "code",
        "display",
        "filter_property",
        "filter_op",
        "filter_value",
      ],
      [
        [
          "Bad VS",
          "bad-vs-missing-prop",
          "",
          "include",
          "http://snomed.info/sct",
          "filter",
          "",
          "",
          "", // missing filter_property
          "is-a",
          "some-value",
        ],
      ],
    );

    try {
      await uploadValueSetCsv(page, csvPath);
      await expect(page.getByText(/review value sets/i)).toBeVisible({
        timeout: 30_000,
      });
      await page.locator("tbody button").first().click();
      await expect(page.getByText(/missing filter/i)).toBeVisible({
        timeout: 5_000,
      });
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for missing required headers", async ({ page }) => {
    const csvPath = createTempCsv(
      ["name", "slug"], // missing compose_type, system, entry_type
      [["Test", "test"]],
    );

    try {
      await uploadValueSetCsv(page, csvPath);
      await expect(
        page.locator('[role="alert"]').getByText(/missing required/i),
      ).toBeVisible({ timeout: 5_000 });
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should show error for invalid system", async ({ page }) => {
    const csvPath = createTempCsv(
      [
        "name",
        "slug",
        "description",
        "compose_type",
        "system",
        "entry_type",
        "code",
        "display",
        "filter_property",
        "filter_op",
        "filter_value",
      ],
      [
        [
          "Bad VS",
          "bad-vs-system",
          "",
          "include",
          "http://invalid-system.example.com", // not in VALUESET_CODE_SYSTEMS
          "concept",
          "12345",
          "Test",
          "",
          "",
          "",
        ],
      ],
    );

    try {
      await uploadValueSetCsv(page, csvPath);
      await expect(page.getByText(/review value sets/i)).toBeVisible({
        timeout: 30_000,
      });
      await page.locator("tbody button").first().click();
      await expect(page.getByText(/invalid system/i)).toBeVisible({
        timeout: 5_000,
      });
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should complete full import flow with valid data", async ({ page }) => {
    const suffix = Date.now();
    const csvPath = createTempCsv(
      [
        "name",
        "slug",
        "description",
        "compose_type",
        "system",
        "entry_type",
        "code",
        "display",
        "filter_property",
        "filter_op",
        "filter_value",
      ],
      [
        [
          `E2E Test VS ${suffix}`,
          `e2e-test-vs-${suffix}`,
          "E2E test value set",
          "include",
          "http://snomed.info/sct",
          "concept",
          "386661006",
          "Fever",
          "",
          "",
          "",
        ],
      ],
    );

    try {
      await uploadValueSetCsv(page, csvPath);

      // Verification step
      await expect(page.getByText(/verifying codes/i)).toBeVisible({
        timeout: 10_000,
      });

      // Wait for review screen
      await expect(page.getByText(/review value sets/i)).toBeVisible({
        timeout: 30_000,
      });

      // Click import
      await page.getByRole("button", { name: /import/i }).click();

      // Wait for completion
      await expect(page.getByText(/import complete/i)).toBeVisible({
        timeout: 60_000,
      });
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should handle multi-group CSV with mixed validity", async ({
    page,
  }) => {
    const suffix = Date.now();
    const csvPath = createTempCsv(
      [
        "name",
        "slug",
        "description",
        "compose_type",
        "system",
        "entry_type",
        "code",
        "display",
        "filter_property",
        "filter_op",
        "filter_value",
      ],
      [
        // Valid group with SNOMED code
        [
          `Valid VS ${suffix}`,
          `valid-vs-${suffix}`,
          "Valid value set",
          "include",
          "http://snomed.info/sct",
          "concept",
          "386661006",
          "Fever",
          "",
          "",
          "",
        ],
        // Invalid group with missing code
        [
          `Invalid VS ${suffix}`,
          `invalid-vs-${suffix}`,
          "Invalid value set",
          "include",
          "http://snomed.info/sct",
          "concept",
          "", // missing code
          "",
          "",
          "",
          "",
        ],
      ],
    );

    try {
      await uploadValueSetCsv(page, csvPath);

      // Wait for verification
      await expect(page.getByText(/verifying codes/i)).toBeVisible({
        timeout: 10_000,
      });

      // Wait for review screen
      await expect(page.getByText(/review value sets/i)).toBeVisible({
        timeout: 30_000,
      });

      // Should show 2 groups (1 valid, 1 invalid)
      const rows = page.locator("tbody tr");
      await expect(rows).toHaveCount(2);

      // Expand the second (invalid) group to see error
      await page.locator("tbody button").nth(1).click();
      await expect(page.getByText(/missing code/i)).toBeVisible({
        timeout: 5_000,
      });

      // Only valid group should be checked for import
      const checkbox = page.locator('input[type="checkbox"]').nth(1);
      await expect(checkbox).toBeChecked();

      const checkbox2 = page.locator('input[type="checkbox"]').nth(2);
      await expect(checkbox2).not.toBeChecked();

      // Click import (only valid group)
      await page.getByRole("button", { name: /import/i }).click();

      // Wait for completion
      await expect(page.getByText(/import complete/i)).toBeVisible({
        timeout: 60_000,
      });
    } finally {
      cleanupTempFile(csvPath);
    }
  });

  test("should expand and collapse group to show concept rows", async ({
    page,
  }) => {
    const suffix = Date.now();
    // Create CSV with 2 concepts in same group
    const csvPath = createTempCsv(
      [
        "name",
        "slug",
        "description",
        "compose_type",
        "system",
        "entry_type",
        "code",
        "display",
        "filter_property",
        "filter_op",
        "filter_value",
      ],
      [
        [
          `Multi Concept VS ${suffix}`,
          `multi-concept-vs-${suffix}`,
          "Multi concept value set",
          "include",
          "http://snomed.info/sct",
          "concept",
          "386661006",
          "Fever",
          "",
          "",
          "",
        ],
        [
          `Multi Concept VS ${suffix}`,
          `multi-concept-vs-${suffix}`,
          "Multi concept value set",
          "include",
          "http://snomed.info/sct",
          "concept",
          "25064002",
          "Headache",
          "",
          "",
          "",
        ],
      ],
    );

    try {
      await uploadValueSetCsv(page, csvPath);

      // Wait for verification
      await expect(page.getByText(/verifying codes/i)).toBeVisible({
        timeout: 10_000,
      });

      // Wait for review screen
      await expect(page.getByText(/review value sets/i)).toBeVisible({
        timeout: 30_000,
      });

      // Group row should be visible
      const groupRow = page.locator("tbody tr").first();
      await expect(groupRow).toBeVisible();

      // Click chevron to expand
      const chevron = page.locator("tbody button").first();
      await chevron.click();

      // Concept rows should be visible
      const conceptRows = page.locator("tbody tr");
      await expect(conceptRows).toHaveCount(3); // 1 group + 2 concepts

      // Check that concept details are visible
      await expect(page.getByText("Fever")).toBeVisible();
      await expect(page.getByText("Headache")).toBeVisible();

      // Click chevron again to collapse
      await chevron.click();

      // Only group row should be visible
      await expect(page.locator("tbody tr")).toHaveCount(1);

      // Concept rows should be hidden
      const rows = page.locator("tbody tr");
      const feverId = page.getByText("Fever");
      await expect(feverId).not.toBeVisible();
    } finally {
      cleanupTempFile(csvPath);
    }
  });
});
