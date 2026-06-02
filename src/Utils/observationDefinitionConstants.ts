import { csvEscape } from "@/Utils/importHelpers";

/**
 * Constants and sample data for Observation Definition CSV imports.
 *
 * The import uses two CSVs:
 *  1. Definitions CSV — multiple rows per definition, one per qualified range.
 * First row populated with definition-level fields; subsequent rows for same definition have empty definition-level fields and only component/range fields populated.
 *  2. Components CSV  — one row per component range band, linked via observation_slug.
 */

/* ------------------------------------------------------------------ */
/*  Definitions CSV                                                    */
/* ------------------------------------------------------------------ */

export const OBSERVATION_QUALIFIED_RANGE_CSV_HEADERS = [
  "age_min",
  "age_max",
  "age_op",
  "gender",
  "range_display",
  "range_min",
  "range_max",
];

export const OBSERVATION_DEFINITION_CSV_HEADERS = [
  "title",
  "slug_value",
  "description",
  "category",
  "status",
  "code_system",
  "code_value",
  "code_display",
  "permitted_data_type",
  "body_site_system",
  "body_site_code",
  "body_site_display",
  "method_system",
  "method_code",
  "method_display",
  "permitted_unit_system",
  "permitted_unit_code",
  "permitted_unit_display",
  "derived_from_uri",
  ...OBSERVATION_QUALIFIED_RANGE_CSV_HEADERS,
] as const;

/* ------------------------------------------------------------------ */
/*  Components CSV                                                     */
/* ------------------------------------------------------------------ */

export const COMPONENT_CSV_HEADERS = [
  "observation_slug",
  "code_system",
  "code_value",
  "code_display",
  "permitted_data_type",
  "unit_system",
  "unit_code",
  "unit_display",
  ...OBSERVATION_QUALIFIED_RANGE_CSV_HEADERS,
] as const;

/* ------------------------------------------------------------------ */
/*  Sample data                                                        */
/* ------------------------------------------------------------------ */

const SAMPLE_DEFINITIONS_ROWS: string[][] = [
  [
    "Complete Blood Count",
    "complete-blood-count",
    "CBC panel with Hemoglobin and Hematocrit",
    "laboratory",
    "active",
    "http://loinc.org",
    "58410-2",
    "CBC panel",
    "quantity",
    "", // body_site_system
    "", // body_site_code
    "", // body_site_display
    "", // method_system
    "", // method_code
    "", // method_display
    "", // permitted_unit_system
    "", // permitted_unit_code
    "", // permitted_unit_display
    "", // derived_from_uri
  ],
  [
    "Fasting Blood Sugar",
    "fasting-blood-sugar",
    "Fasting blood glucose",
    "laboratory",
    "active",
    "http://loinc.org",
    "1558-6",
    "Glucose [Moles/volume] in Serum or Plasma",
    "quantity",
    "", // body_site_system
    "", // body_site_code
    "", // body_site_display
    "", // method_system
    "", // method_code
    "", // method_display
    "http://unitsofmeasure.org",
    "mmol/L",
    "mmol/L",
    "", // derived_from_uri
  ],
];

/**
 * Sample component rows.  Each row is one range band for one component.
 * Rows sharing (observation_slug, code_value, age/gender conditions) form
 * a single qualified_range; rows sharing (observation_slug, code_value) form
 * a single component.
 */
const SAMPLE_COMPONENT_ROWS: string[][] = [
  // ── Hemoglobin, male 12-18, Low/Normal/High ──
  [
    "complete-blood-count",
    "http://loinc.org",
    "LP32067-8",
    "Hemoglobin",
    "quantity",
    "http://unitsofmeasure.org",
    "g/dL",
    "gram per deciliter",
    "12",
    "18",
    "years",
    "male",
    "Low",
    "",
    "12.00",
  ],
  [
    "complete-blood-count",
    "http://loinc.org",
    "LP32067-8",
    "Hemoglobin",
    "quantity",
    "http://unitsofmeasure.org",
    "g/dL",
    "gram per deciliter",
    "12",
    "18",
    "years",
    "male",
    "Normal",
    "12.00",
    "16.00",
  ],
  [
    "complete-blood-count",
    "http://loinc.org",
    "LP32067-8",
    "Hemoglobin",
    "quantity",
    "http://unitsofmeasure.org",
    "g/dL",
    "gram per deciliter",
    "12",
    "18",
    "years",
    "male",
    "High",
    "16.00",
    "",
  ],
  // ── Hemoglobin, female 12-18, Low/Normal/High ──
  [
    "complete-blood-count",
    "http://loinc.org",
    "LP32067-8",
    "Hemoglobin",
    "quantity",
    "http://unitsofmeasure.org",
    "g/dL",
    "gram per deciliter",
    "12",
    "18",
    "years",
    "female",
    "Low",
    "",
    "14.00",
  ],
  [
    "complete-blood-count",
    "http://loinc.org",
    "LP32067-8",
    "Hemoglobin",
    "quantity",
    "http://unitsofmeasure.org",
    "g/dL",
    "gram per deciliter",
    "12",
    "18",
    "years",
    "female",
    "Normal",
    "14.00",
    "18.00",
  ],
  [
    "complete-blood-count",
    "http://loinc.org",
    "LP32067-8",
    "Hemoglobin",
    "quantity",
    "http://unitsofmeasure.org",
    "g/dL",
    "gram per deciliter",
    "12",
    "18",
    "years",
    "female",
    "High",
    "18.00",
    "",
  ],
  // ── Hematocrit, unconditional, Low/Normal/High ──
  [
    "complete-blood-count",
    "http://loinc.org",
    "LP15101-6",
    "Hematocrit",
    "quantity",
    "http://unitsofmeasure.org",
    "%",
    "percent",
    "",
    "",
    "",
    "",
    "Low",
    "",
    "36.00",
  ],
  [
    "complete-blood-count",
    "http://loinc.org",
    "LP15101-6",
    "Hematocrit",
    "quantity",
    "http://unitsofmeasure.org",
    "%",
    "percent",
    "",
    "",
    "",
    "",
    "Normal",
    "36.00",
    "48.00",
  ],
  [
    "complete-blood-count",
    "http://loinc.org",
    "LP15101-6",
    "Hematocrit",
    "quantity",
    "http://unitsofmeasure.org",
    "%",
    "percent",
    "",
    "",
    "",
    "",
    "High",
    "48.00",
    "",
  ],
];

/* ------------------------------------------------------------------ */
/*  CSV generators                                                     */
/* ------------------------------------------------------------------ */

const buildCsv = (headers: readonly string[], rows: string[][]): string => {
  const headerLine = headers.join(",");
  const dataLines = rows.map((row) => row.map(csvEscape).join(","));
  return `${headerLine}\n${dataLines.join("\n")}`;
};

/**
 * Generate the sample definitions CSV (no component columns).
 */
export const generateSampleDefinitionsCsv = (): string =>
  buildCsv(OBSERVATION_DEFINITION_CSV_HEADERS, SAMPLE_DEFINITIONS_ROWS);

/**
 * Generate the sample components CSV.
 */
export const generateSampleComponentsCsv = (): string =>
  buildCsv(COMPONENT_CSV_HEADERS, SAMPLE_COMPONENT_ROWS);

/**
 * @deprecated Use generateSampleDefinitionsCsv + generateSampleComponentsCsv instead.
 */
export const generateSampleCsv = generateSampleDefinitionsCsv;
