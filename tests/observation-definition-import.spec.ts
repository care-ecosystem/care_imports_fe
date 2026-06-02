import { expect, test } from "@playwright/test";
import { fetchApiResults } from "./helpers/api";
import { cleanupTempFile, createTempCsv } from "./helpers/csv";
import {
  clickImportButton,
  expectImportSuccess,
  expectReviewTable,
  expectValidationError,
} from "./helpers/import-flow";
import { goToImport } from "./helpers/navigation";
import { getFacility } from "./utils/facility";

test.use({ storageState: "tests/.auth/user.json" });

/** OD definitions CSV headers */
const DEF_HEADERS = [
  "title",
  "slug_value",
  "description",
  "category",
  "permitted_data_type",
  "code_system",
  "code_value",
  "code_display",
  "status",
];

/** OD components CSV headers */
const COMP_HEADERS = [
  "observation_slug",
  "code_system",
  "code_value",
  "code_display",
  "permitted_data_type",
  "unit_system",
  "unit_code",
  "unit_display",
];

/** Range columns for root-level (definition) or component-level qualified range tests */
const RANGE_COLUMNS = [
  "age_min",
  "age_max",
  "age_op",
  "gender",
  "range_display",
  "range_min",
  "range_max",
];

/** Upload two CSV files (definitions + components) to the OD import page. */
async function uploadObsDefCsvs(
  page: import("@playwright/test").Page,
  defPath: string,
  compPath: string,
) {
  const fileInput = page.locator("#obs-def-csv-upload");
  await fileInput.setInputFiles([defPath, compPath]);
}

function makeValidDefRow(suffix: string | number): string[] {
  return [
    `Blood Pressure ${suffix}`,
    `bp-${suffix}`,
    "Blood pressure measurement",
    "vital_signs",
    "quantity",
    "http://loinc.org",
    "85354-9",
    "Blood pressure panel",
    "active",
  ];
}

function makeEmptyComponentsCsv(): string {
  return createTempCsv(COMP_HEADERS, [], "components.csv");
}

test.describe("Observation Definition Import", () => {
  test.beforeEach(async ({ page }) => {
    await goToImport(page, "observation-definition");
  });

  test("should show upload UI with CSV and master data options", async ({
    page,
  }) => {
    await expect(
      page.getByText(/import observation definitions from csv/i),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /download sample/i }),
    ).toBeVisible();
  });

  test("should download sample CSVs", async ({ page }) => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /download sample/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/observation/i);
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
  });

  test("should upload valid definitions + components and import", async ({
    page,
  }) => {
    const suffix = Date.now();
    const defPath = createTempCsv(
      DEF_HEADERS,
      [makeValidDefRow(suffix)],
      "definitions.csv",
    );
    const compPath = createTempCsv(
      COMP_HEADERS,
      [
        [
          `bp-${suffix}`,
          "http://loinc.org",
          "8480-6",
          "Systolic blood pressure",
          "Quantity",
          "http://unitsofmeasure.org",
          "mm[Hg]",
          "mmHg",
        ],
      ],
      "components.csv",
    );

    try {
      await uploadObsDefCsvs(page, defPath, compPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);
    } finally {
      cleanupTempFile(defPath);
      cleanupTempFile(compPath);
    }
  });

  test("should upload definitions without components and import", async ({
    page,
  }) => {
    const suffix = Date.now();
    const defPath = createTempCsv(
      DEF_HEADERS,
      [makeValidDefRow(suffix)],
      "definitions.csv",
    );
    const compPath = makeEmptyComponentsCsv();

    try {
      await uploadObsDefCsvs(page, defPath, compPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);
    } finally {
      cleanupTempFile(defPath);
      cleanupTempFile(compPath);
    }
  });

  test("should show error for partial code triplet (code without display)", async ({
    page,
  }) => {
    const defPath = createTempCsv(
      [
        "title",
        "slug_value",
        "description",
        "category",
        "permitted_data_type",
        "status",
        "code_system",
        "code_value",
        "code_display",
        "body_site_system",
        "body_site_code",
        "body_site_display",
      ],
      [
        [
          "Test OD",
          "test-od",
          "Test",
          "vital_signs",
          "quantity",
          "active",
          "http://loinc.org",
          "12345",
          "Test code",
          "http://snomed.info/sct",
          "some-code", // code provided
          "", // display missing → triggers triplet error
        ],
      ],
      "definitions.csv",
    );
    const compPath = makeEmptyComponentsCsv();

    try {
      await uploadObsDefCsvs(page, defPath, compPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(
        page,
        /display is required when code is set/i,
      );
    } finally {
      cleanupTempFile(defPath);
      cleanupTempFile(compPath);
    }
  });

  test("should error when root-level qualified ranges conflict with a component", async ({
    page,
  }) => {
    // Defs CSV: one row with a range band (populates root-level qualifiedRangeMap)
    const defPath = createTempCsv(
      [...DEF_HEADERS, ...RANGE_COLUMNS],
      [
        [
          "BP Conflict",
          "bp-conflict",
          "Blood pressure",
          "vital_signs",
          "quantity",
          "http://loinc.org",
          "85354-9",
          "Blood pressure panel",
          "active",
          "", // age_min
          "", // age_max
          "", // age_op
          "", // gender
          "Normal", // range_display
          "60", // range_min
          "100", // range_max
        ],
      ],
      "definitions.csv",
    );
    // Comp CSV: component for the same slug
    const compPath = createTempCsv(
      COMP_HEADERS,
      [
        [
          "bp-conflict",
          "http://loinc.org",
          "8480-6",
          "Systolic blood pressure",
          "quantity",
          "http://unitsofmeasure.org",
          "mm[Hg]",
          "mmHg",
        ],
      ],
      "components.csv",
    );

    try {
      await uploadObsDefCsvs(page, defPath, compPath);
      await expectReviewTable(page, { invalidCount: 1 });
      await expectValidationError(
        page,
        /qualified ranges must be defined at the component level/i,
      );
    } finally {
      cleanupTempFile(defPath);
      cleanupTempFile(compPath);
    }
  });

  test("should import with root-level qualified ranges (multiple bands per definition)", async ({
    page,
    request,
  }) => {
    const suffix = Date.now();
    const slug = `range-od-${suffix}`;
    // Two rows share the same slug+title — they dedup to 1 definition but
    // each row contributes one range band to the root-level qualifiedRangeMap.
    const defPath = createTempCsv(
      [...DEF_HEADERS, ...RANGE_COLUMNS],
      [
        [
          `Range OD ${suffix}`,
          slug,
          "Range OD description",
          "vital_signs",
          "quantity",
          "http://loinc.org",
          "85354-9",
          "Blood pressure panel",
          "active",
          "", // age_min
          "", // age_max
          "", // age_op
          "", // gender
          "Normal", // range_display
          "60", // range_min
          "100", // range_max
        ],
        [
          `Range OD ${suffix}`,
          slug,
          "Range OD description",
          "vital_signs",
          "quantity",
          "http://loinc.org",
          "85354-9",
          "Blood pressure panel",
          "active",
          "", // age_min
          "", // age_max
          "", // age_op
          "", // gender
          "High", // range_display
          "100", // range_min
          "200", // range_max
        ],
      ],
      "definitions.csv",
    );
    const compPath = makeEmptyComponentsCsv();

    try {
      await uploadObsDefCsvs(page, defPath, compPath);
      // Two input rows deduplicate to 1 definition
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);

      const facility = getFacility();
      const created = await fetchApiResults<{
        qualified_ranges?: Array<{ ranges?: unknown[] }>;
        component?: Array<{ qualified_ranges?: unknown[] }>;
      }>(request, `/api/v1/observation_definition/f-${facility.id}-${slug}/`, {
        paginated: false,
        params: { facility: facility.id },
      });

      expect(created.qualified_ranges?.length ?? 0).toBeGreaterThan(0);
      expect(created.component?.length ?? 0).toBe(0);
    } finally {
      cleanupTempFile(defPath);
      cleanupTempFile(compPath);
    }
  });

  test("should import with component-level qualified ranges (age-banded)", async ({
    page,
    request,
  }) => {
    const suffix = Date.now();
    const slug = `bp-${suffix}`;
    const defPath = createTempCsv(
      DEF_HEADERS,
      [makeValidDefRow(suffix)],
      "definitions.csv",
    );
    // Two rows for the same (slug, code_value) with different age conditions
    // → two separate InterpGroups → two QualifiedRanges on the component
    const compPath = createTempCsv(
      [...COMP_HEADERS, ...RANGE_COLUMNS],
      [
        [
          slug,
          "http://loinc.org",
          "8480-6",
          "Systolic blood pressure",
          "quantity",
          "http://unitsofmeasure.org",
          "mm[Hg]",
          "mmHg",
          "0", // age_min
          "18", // age_max
          "years", // age_op
          "", // gender
          "Normal", // range_display
          "60", // range_min
          "120", // range_max
        ],
        [
          slug,
          "http://loinc.org",
          "8480-6",
          "Systolic blood pressure",
          "quantity",
          "http://unitsofmeasure.org",
          "mm[Hg]",
          "mmHg",
          "18", // age_min
          "", // age_max
          "years", // age_op
          "", // gender
          "Normal", // range_display
          "60", // range_min
          "130", // range_max
        ],
      ],
      "components.csv",
    );

    try {
      await uploadObsDefCsvs(page, defPath, compPath);
      await expectReviewTable(page, { validCount: 1, totalCount: 1 });
      await clickImportButton(page);
      await expectImportSuccess(page);

      const facility = getFacility();
      const created = await fetchApiResults<{
        qualified_ranges?: Array<{ ranges?: unknown[] }>;
        component?: Array<{ qualified_ranges?: unknown[] }>;
      }>(request, `/api/v1/observation_definition/f-${facility.id}-${slug}/`, {
        paginated: false,
        params: { facility: facility.id },
      });

      expect(created.qualified_ranges?.length ?? 0).toBe(0);
      expect(created.component?.length ?? 0).toBeGreaterThan(0);
      expect(
        created.component?.some(
          (comp) => (comp.qualified_ranges?.length ?? 0) > 0,
        ),
      ).toBeTruthy();
    } finally {
      cleanupTempFile(defPath);
      cleanupTempFile(compPath);
    }
  });

  test("should detect duplicate slugs", async ({ page }) => {
    const defPath = createTempCsv(
      DEF_HEADERS,
      [
        [
          "OD One",
          "same-slug",
          "Desc",
          "vital_signs",
          "quantity",
          "http://loinc.org",
          "1",
          "One",
          "active",
        ],
        [
          "OD Two",
          "same-slug",
          "Desc",
          "vital_signs",
          "quantity",
          "http://loinc.org",
          "2",
          "Two",
          "active",
        ],
      ],
      "definitions.csv",
    );
    const compPath = makeEmptyComponentsCsv();

    try {
      await uploadObsDefCsvs(page, defPath, compPath);
      await expectReviewTable(page, { invalidCount: 2 });
      await expectValidationError(page, /duplicate slug/i);
    } finally {
      cleanupTempFile(defPath);
      cleanupTempFile(compPath);
    }
  });

  test("should show error when files cannot be detected as defs vs components", async ({
    page,
  }) => {
    // Two files, neither has observation_slug header
    const file1 = createTempCsv(
      ["title", "slug_value"],
      [["A", "a"]],
      "file1.csv",
    );
    const file2 = createTempCsv(
      ["title", "slug_value"],
      [["B", "b"]],
      "file2.csv",
    );

    try {
      const fileInput = page.locator("#obs-def-csv-upload");
      await fileInput.setInputFiles([file1, file2]);
      await expect(page.getByText(/could not detect/i)).toBeVisible({
        timeout: 5_000,
      });
    } finally {
      cleanupTempFile(file1);
      cleanupTempFile(file2);
    }
  });
});
