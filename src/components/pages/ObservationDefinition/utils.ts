import {
  buildHeaderMapping,
  getCellValue,
  normalizeHeader,
  SlugSchema,
  validateNoDuplicateSlugs,
} from "@/internalTypes/common";
import type { ProcessedRow, ReviewColumn } from "@/internalTypes/importConfig";
import type { Code } from "@/types/base/code/code";
import type { Condition } from "@/types/base/condition/condition";
import { ConditionOperation } from "@/types/base/condition/condition";
import type {
  NumericRange,
  QualifiedRange,
} from "@/types/base/qualifiedRange/qualifiedRange";
import { InterpretationType } from "@/types/base/qualifiedRange/qualifiedRange";
import type {
  ObservationDefinitionComponentCreateSpec,
  ObservationDefinitionCreateSpec,
} from "@/types/emr/observationDefinition/observationDefinition";
import {
  OBSERVATION_DEFINITION_CATEGORY,
  ObservationDefinitionStatus,
  QuestionType,
} from "@/types/emr/observationDefinition/observationDefinition";
import { parseCsvText } from "@/Utils/csv";
import { formatCode } from "@/Utils/importHelpers";
import { z } from "zod";

// ─── Headers ───────────────────────────────────────────────────────
export const OBS_DEF_REQUIRED_HEADERS = [
  "title",
  "slug_value",
  "description",
  "category",
  "permitted_data_type",
  "code_system",
  "code_value",
  "code_display",
] as const;

export const OBS_DEF_OPTIONAL_HEADERS = [
  "status",
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
] as const;

export const OBS_DEF_ALL_HEADERS = [
  ...OBS_DEF_REQUIRED_HEADERS,
  ...OBS_DEF_OPTIONAL_HEADERS,
] as const;

// ─── Header Map (normalized → canonical) ───────────────────────────
export const OBS_DEF_HEADER_MAP: Record<string, string> =
  buildHeaderMapping(OBS_DEF_ALL_HEADERS);

// ─── Constants ─────────────────────────────────────────────────────

const COMPONENT_REQUIRED_HEADERS = [
  "observation_slug",
  "code_value",
  "code_display",
] as const;

const QUESTION_TYPES = [
  "boolean",
  "decimal",
  "integer",
  "dateTime",
  "time",
  "string",
  "quantity",
] as const;

const VALID_GENDERS = ["male", "female", "transgender", "non_binary"] as const;

const VALID_AGE_OPS = ["years", "months", "days"] as const;

// ─── Shared Range Types & Helpers ──────────────────────────────────

export type RangeBand = {
  display: string;
  min: string;
  max: string;
  csvRow: number;
};

export type InterpGroup = {
  ageMin: string;
  ageMax: string;
  ageOp: string;
  gender: string;
  bands: RangeBand[];
};

const buildConditionKey = (
  ageMin: string,
  ageMax: string,
  ageOp: string,
  gender: string,
): string => [ageMin, ageMax, ageOp, gender].join("|");

export function validateRangeFields(fields: {
  ageMin: string;
  ageMax: string;
  ageOp: string;
  gender: string;
  rangeDisplay: string;
  rangeMin: string;
  rangeMax: string;
}): string | null {
  const { ageMin, ageMax, ageOp, gender, rangeDisplay, rangeMin, rangeMax } =
    fields;

  if ((ageMin || ageMax) && !ageOp) {
    return "age_op is required when age_min/age_max is set";
  }
  if (ageOp && !VALID_AGE_OPS.includes(ageOp.toLowerCase() as never)) {
    return `Invalid age_op "${ageOp}" (must be years/months/days)`;
  }
  if (gender && !VALID_GENDERS.includes(gender.toLowerCase() as never)) {
    return `Invalid gender "${gender}" (must be male/female/transgender/non_binary)`;
  }
  if (rangeDisplay) {
    if (rangeMin && rangeMax && Number(rangeMin) > Number(rangeMax)) {
      return "Range min must be ≤ max";
    }
  }
  return null;
}

export function addRangeBandToGroup(
  interpretations: Map<string, InterpGroup>,
  fields: {
    ageMin: string;
    ageMax: string;
    ageOp: string;
    gender: string;
    rangeDisplay: string;
    rangeMin: string;
    rangeMax: string;
    csvRow: number;
  },
): void {
  const {
    ageMin,
    ageMax,
    ageOp,
    gender,
    rangeDisplay,
    rangeMin,
    rangeMax,
    csvRow,
  } = fields;
  const condKey = buildConditionKey(ageMin, ageMax, ageOp, gender);

  if (!interpretations.has(condKey)) {
    interpretations.set(condKey, {
      ageMin,
      ageMax,
      ageOp: ageOp.toLowerCase(),
      gender: gender.toLowerCase(),
      bands: [],
    });
  }
  if (rangeDisplay) {
    interpretations.get(condKey)!.bands.push({
      display: rangeDisplay,
      min: rangeMin,
      max: rangeMax,
      csvRow,
    });
  }
}

export function buildQualifiedRangesFromGroups(
  interpretations: Map<string, InterpGroup>,
): QualifiedRange[] {
  const qualifiedRanges: QualifiedRange[] = [];

  for (const interp of interpretations.values()) {
    if (interp.bands.length === 0) continue;

    const conditions: Condition[] = [];

    if (interp.ageMin || interp.ageMax) {
      conditions.push({
        metric: "patient_age",
        operation: ConditionOperation.in_range,
        value: {
          min: Number(interp.ageMin) || 0,
          max: Number(interp.ageMax) || 0,
          value_type: interp.ageOp || "years",
        },
      });
    }
    if (interp.gender) {
      conditions.push({
        metric: "patient_gender",
        operation: ConditionOperation.equality,
        value: interp.gender,
      });
    }

    const rangeBands: NumericRange[] = interp.bands.map((b) => ({
      interpretation: { display: b.display },
      ...(b.min ? { min: b.min } : {}),
      ...(b.max ? { max: b.max } : {}),
    }));

    const qr: QualifiedRange = {
      ranges: rangeBands,
      _interpretation_type: InterpretationType.ranges,
      ...(conditions.length > 0 ? { conditions } : {}),
    };
    qualifiedRanges.push(qr);
  }

  return qualifiedRanges;
}

// ─── Components CSV Parser ─────────────────────────────────────────

export const parseComponentCsv = (
  csvText: string,
): {
  componentMap: Map<string, ObservationDefinitionComponentCreateSpec[]>;
  errors: { csvRow: number; message: string }[];
} => {
  const { headers, rows } = parseCsvText(csvText);
  const errors: { csvRow: number; message: string }[] = [];

  if (headers.length === 0) {
    return {
      componentMap: new Map(),
      errors: [
        { csvRow: 0, message: "Components CSV is empty or missing headers" },
      ],
    };
  }

  const headerMap = headers.reduce<Record<string, number>>(
    (acc, header, index) => {
      acc[normalizeHeader(header)] = index;
      return acc;
    },
    {},
  );

  const missingHeaders = COMPONENT_REQUIRED_HEADERS.filter(
    (h) => headerMap[normalizeHeader(h)] === undefined,
  );
  if (missingHeaders.length > 0) {
    return {
      componentMap: new Map(),
      errors: [
        {
          csvRow: 0,
          message: `Components CSV missing required headers: ${missingHeaders.join(", ")}`,
        },
      ],
    };
  }

  type ComponentGroup = {
    code: Code;
    permitted_data_type: QuestionType;
    permitted_unit: Code | null;
    interpretations: Map<string, InterpGroup>;
  };

  const slugMap = new Map<string, Map<string, ComponentGroup>>();

  rows.forEach((row, idx) => {
    const csvRow = idx + 2;
    const get = (key: string) => getCellValue(row, headerMap, key).trim();

    const slug = get("observation_slug");
    const codeSystem = get("code_system") || "http://loinc.org";
    const codeValue = get("code_value");
    const codeDisplay = get("code_display");
    const permittedDataType = get("permitted_data_type");
    const unitSystem = get("unit_system") || "http://unitsofmeasure.org";
    const unitCode = get("unit_code");
    const unitDisplay = get("unit_display");
    const ageMin = get("age_min");
    const ageMax = get("age_max");
    const ageOp = get("age_op");
    const gender = get("gender");
    const rangeDisplay = get("range_display");
    const rangeMin = get("range_min");
    const rangeMax = get("range_max");

    if (!slug) {
      errors.push({ csvRow, message: "Missing observation_slug" });
      return;
    }
    if (!codeValue || !codeDisplay) {
      errors.push({ csvRow, message: "Missing code_value or code_display" });
      return;
    }
    if (
      permittedDataType &&
      !QUESTION_TYPES.includes(permittedDataType as never)
    ) {
      errors.push({
        csvRow,
        message: `Invalid permitted_data_type "${permittedDataType}"`,
      });
      return;
    }
    if ((unitCode || unitDisplay) && !(unitCode && unitDisplay)) {
      errors.push({
        csvRow,
        message: "Permitted unit requires both unit_code and unit_display",
      });
      return;
    }

    const rangeError = validateRangeFields({
      ageMin,
      ageMax,
      ageOp,
      gender,
      rangeDisplay,
      rangeMin,
      rangeMax,
    });
    if (rangeError) {
      errors.push({ csvRow, message: rangeError });
      return;
    }

    if (!slugMap.has(slug)) {
      slugMap.set(slug, new Map());
    }
    const componentMap = slugMap.get(slug)!;

    if (!componentMap.has(codeValue)) {
      componentMap.set(codeValue, {
        code: { system: codeSystem, code: codeValue, display: codeDisplay },
        permitted_data_type: permittedDataType as QuestionType,
        permitted_unit:
          unitCode && unitDisplay
            ? { system: unitSystem, code: unitCode, display: unitDisplay }
            : null,
        interpretations: new Map(),
      });
    }
    const comp = componentMap.get(codeValue)!;

    addRangeBandToGroup(comp.interpretations, {
      ageMin,
      ageMax,
      ageOp,
      gender,
      rangeDisplay,
      rangeMin,
      rangeMax,
      csvRow,
    });
  });

  const resultMap = new Map<
    string,
    ObservationDefinitionComponentCreateSpec[]
  >();

  for (const [slug, componentGroups] of slugMap) {
    const components: ObservationDefinitionComponentCreateSpec[] = [];

    for (const comp of componentGroups.values()) {
      components.push({
        code: comp.code,
        permitted_data_type: comp.permitted_data_type,
        permitted_unit: comp.permitted_unit,
        qualified_ranges: buildQualifiedRangesFromGroups(comp.interpretations),
      });
    }

    resultMap.set(slug, components);
  }

  return { componentMap: resultMap, errors };
};

// ─── Observation-Level Qualified Ranges ────────────────────────────

const RANGE_HEADERS = [
  "age_min",
  "age_max",
  "age_op",
  "gender",
  "range_display",
  "range_min",
  "range_max",
] as const;

export function hasRangeHeaders(headers: string[]): boolean {
  const normalizedHeaders = new Set(headers.map(normalizeHeader));
  return RANGE_HEADERS.some((h) => normalizedHeaders.has(normalizeHeader(h)));
}

export function parseObservationQualifiedRanges(
  rows: string[][],
  headerMap: Record<string, number>,
  slugIndex: number,
): {
  qualifiedRangeMap: Map<string, QualifiedRange[]>;
  errors: { csvRow: number; message: string }[];
} {
  const errors: { csvRow: number; message: string }[] = [];
  const slugInterpMap = new Map<string, Map<string, InterpGroup>>();

  rows.forEach((row, idx) => {
    const csvRow = idx + 2;
    const slug = row[slugIndex]?.trim() ?? "";
    if (!slug) return;

    const get = (key: string) => getCellValue(row, headerMap, key).trim();

    const ageMin = get("age_min");
    const ageMax = get("age_max");
    const ageOp = get("age_op");
    const gender = get("gender");
    const rangeDisplay = get("range_display");
    const rangeMin = get("range_min");
    const rangeMax = get("range_max");

    if (!rangeDisplay && !ageMin && !ageMax && !ageOp && !gender) return;

    const rangeError = validateRangeFields({
      ageMin,
      ageMax,
      ageOp,
      gender,
      rangeDisplay,
      rangeMin,
      rangeMax,
    });
    if (rangeError) {
      errors.push({ csvRow, message: rangeError });
      return;
    }

    if (!slugInterpMap.has(slug)) {
      slugInterpMap.set(slug, new Map());
    }

    addRangeBandToGroup(slugInterpMap.get(slug)!, {
      ageMin,
      ageMax,
      ageOp,
      gender,
      rangeDisplay,
      rangeMin,
      rangeMax,
      csvRow,
    });
  });

  const qualifiedRangeMap = new Map<string, QualifiedRange[]>();
  for (const [slug, interpretations] of slugInterpMap) {
    const qrs = buildQualifiedRangesFromGroups(interpretations);
    if (qrs.length > 0) {
      qualifiedRangeMap.set(slug, qrs);
    }
  }

  return { qualifiedRangeMap, errors };
}

// ─── Zod Schema ────────────────────────────────────────────────────
export const ObservationDefinitionRowSchema = z
  .object({
    // Required
    title: z.string().min(1, "Title is required"),
    slug_value: SlugSchema,
    description: z.string().min(1, "Description is required"),
    category: z.enum(OBSERVATION_DEFINITION_CATEGORY as [string, ...string[]], {
      errorMap: () => ({
        message: `Category must be one of: ${OBSERVATION_DEFINITION_CATEGORY.join(", ")}`,
      }),
    }),
    permitted_data_type: z.nativeEnum(QuestionType, {
      errorMap: () => ({
        message: `Permitted data type must be one of: ${Object.values(QuestionType).join(", ")}`,
      }),
    }),
    code_system: z.string().min(1, "Code system is required"),
    code_value: z.string().min(1, "Code value is required"),
    code_display: z.string().min(1, "Code display is required"),

    // Optional
    status: z
      .nativeEnum(ObservationDefinitionStatus)
      .optional()
      .default(ObservationDefinitionStatus.active),
    body_site_system: z.string().optional(),
    body_site_code: z.string().optional(),
    body_site_display: z.string().optional(),
    method_system: z.string().optional(),
    method_code: z.string().optional(),
    method_display: z.string().optional(),
    permitted_unit_system: z.string().optional(),
    permitted_unit_code: z.string().optional(),
    permitted_unit_display: z.string().optional(),
    derived_from_uri: z.string().optional(),

    // Populated post-parse — not a CSV column
    qualified_ranges: z
      .array(z.record(z.unknown()))
      .default([])
      .transform((qr) => qr as unknown as QualifiedRange[]),

    // Populated post-parse from the components CSV — not a CSV column
    component: z
      .array(z.record(z.unknown()))
      .default([])
      .transform(
        (c) => c as unknown as ObservationDefinitionComponentCreateSpec[],
      ),
  })
  .superRefine((data, ctx) => {
    if (data.qualified_ranges.length > 0 && data.component.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Component detected, qualified ranges must be defined at the component level.",
      });
    }
  });

export type ObservationDefinitionRow = z.infer<
  typeof ObservationDefinitionRowSchema
>;

// ─── Row Parser ────────────────────────────────────────────────────
export function parseObservationDefinitionRowToRaw(
  row: string[],
  headerIndices: Record<string, number>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const header of OBS_DEF_ALL_HEADERS) {
    const idx = headerIndices[header];
    result[header] = idx !== undefined ? (row[idx]?.trim() ?? "") : "";
  }
  return result;
}

// ─── Additional Row Validation ─────────────────────────────────────
export function additionalRowValidation(
  row: ObservationDefinitionRow,
): string[] {
  const errors: string[] = [];

  // Code triplets: if any part provided, need code+display
  const checkCodeTriplet = (
    system: string | undefined,
    code: string | undefined,
    display: string | undefined,
    label: string,
  ) => {
    if (!code && !display) return; // all absent → fine
    if (!code) errors.push(`${label}: code is required when display is set`);
    if (!display) errors.push(`${label}: display is required when code is set`);
    if ((code || display) && !system)
      errors.push(`${label}: system is required when code or display is set`);
  };

  row.code_value = formatCode(row.code_value)!;
  row.body_site_code = formatCode(row.body_site_code);
  row.method_code = formatCode(row.method_code);
  row.permitted_unit_code = formatCode(row.permitted_unit_code);

  checkCodeTriplet(
    row.body_site_system,
    row.body_site_code,
    row.body_site_display,
    "body_site",
  );
  checkCodeTriplet(
    row.method_system,
    row.method_code,
    row.method_display,
    "method",
  );
  checkCodeTriplet(
    row.permitted_unit_system,
    row.permitted_unit_code,
    row.permitted_unit_display,
    "permitted_unit",
  );

  return errors;
}

// ─── Cross-Row Validation ──────────────────────────────────────────
export function validateObservationDefinitionRows(
  rows: ObservationDefinitionRow[],
): { identifier: string; reason: string }[] {
  return validateNoDuplicateSlugs(rows, (row) => row.slug_value);
}

// ─── CSV → ProcessedRows ───────────────────────────────────────────
export function parseMasterCsvToRows(
  defsCsvText: string,
  compCsvText?: string,
): ProcessedRow<ObservationDefinitionRow>[] {
  const { headers, rows } = parseCsvText(defsCsvText);

  if (headers.length === 0) {
    return [];
  }

  // Build normalized header → column index map using canonical names
  const headerIndices: Record<string, number> = {};
  const normalizedHeaderMap: Record<string, number> = {};
  headers.forEach((h, i) => {
    const normalized = normalizeHeader(h);
    normalizedHeaderMap[normalized] = i;
    const canonical = OBS_DEF_HEADER_MAP[normalized];
    if (canonical) {
      headerIndices[canonical] = i;
    }
  });

  // Check required headers
  const missingHeaders = OBS_DEF_REQUIRED_HEADERS.filter(
    (h) => headerIndices[h] === undefined,
  );

  if (missingHeaders.length > 0) {
    return [
      {
        rowIndex: 1,
        raw: [],
        data: {} as ObservationDefinitionRow,
        errors: [`Missing required headers: ${missingHeaders.join(", ")}`],
      },
    ];
  }

  // Parse components CSV if provided
  const componentMap = compCsvText
    ? parseComponentCsv(compCsvText).componentMap
    : new Map<string, ObservationDefinitionComponentCreateSpec[]>();

  // Parse observation-level qualified ranges if range columns are present
  const rangeColumnsPresent = hasRangeHeaders(headers);
  const slugIndex = headerIndices["slug_value"];
  const qualifiedRangeMap = rangeColumnsPresent
    ? parseObservationQualifiedRanges(rows, normalizedHeaderMap, slugIndex)
        .qualifiedRangeMap
    : new Map<string, QualifiedRange[]>();

  // Extract raw definition fields per row and deduplicate by slug+title
  // when range columns are present (multiple rows per slug for range bands)
  type RawEntry = {
    rowIndex: number;
    raw: string[];
    rawObj: Record<string, unknown>;
  };
  const deduped: RawEntry[] = [];

  if (rangeColumnsPresent) {
    const seen = new Map<string, RawEntry>();
    for (let idx = 0; idx < rows.length; idx++) {
      const row = rows[idx];
      const rowIndex = idx + 2;
      const rawObj = parseObservationDefinitionRowToRaw(row, headerIndices);
      const slug =
        typeof rawObj.slug_value === "string" ? rawObj.slug_value : "";
      const title = typeof rawObj.title === "string" ? rawObj.title : "";
      const key = slug ? `${slug}\0${title}` : `__empty__${rowIndex}`;
      if (!seen.has(key)) {
        seen.set(key, { rowIndex, raw: row, rawObj });
      }
    }
    deduped.push(...seen.values());
  } else {
    for (let idx = 0; idx < rows.length; idx++) {
      const row = rows[idx];
      const rowIndex = idx + 2;
      const rawObj = parseObservationDefinitionRowToRaw(row, headerIndices);
      deduped.push({ rowIndex, raw: row, rawObj });
    }
  }

  // Validate each deduplicated row: attach components + ranges, then safeParse
  const processedRows: ProcessedRow<ObservationDefinitionRow>[] = deduped.map(
    ({ rowIndex, raw, rawObj }) => {
      const slug =
        typeof rawObj.slug_value === "string" ? rawObj.slug_value : "";

      // Attach components and qualified ranges before validation
      const components = slug ? (componentMap.get(slug) ?? []) : [];
      const qualifiedRanges = slug ? (qualifiedRangeMap.get(slug) ?? []) : [];
      rawObj.component = components;
      rawObj.qualified_ranges = qualifiedRanges;

      const result = ObservationDefinitionRowSchema.safeParse(rawObj);

      if (!result.success) {
        const errors = result.error.issues.map((i) => i.message);
        return {
          rowIndex,
          raw,
          data: rawObj as ObservationDefinitionRow,
          errors,
        };
      }

      const validatedRow = result.data;
      const additionalErrors = additionalRowValidation(validatedRow);

      return {
        rowIndex,
        raw,
        data: validatedRow,
        errors: additionalErrors,
      };
    },
  );

  // Cross-row validation: duplicate slugs
  const validRows = processedRows
    .filter((r) => r.errors.length === 0)
    .map((r) => r.data);
  const crossRowErrors = validateObservationDefinitionRows(validRows);

  if (crossRowErrors.length > 0) {
    const errorsBySlug = new Map(
      crossRowErrors.map((e) => [e.identifier, e.reason]),
    );
    for (const processed of processedRows) {
      const slug = processed.data.slug_value;
      if (slug && errorsBySlug.has(slug)) {
        processed.errors = [...processed.errors, errorsBySlug.get(slug)!];
      }
    }
  }

  return processedRows;
}

// ─── API Payload Builder ───────────────────────────────────────────
function buildOptionalCode(
  system: string | undefined,
  code: string | undefined,
  display: string | undefined,
): { system: string; code: string; display: string } | null {
  if (!code && !display) return null;
  if (!code || !display || !system) return null;
  return { system, code, display };
}

export function toObservationDefinitionDatapoint(
  row: ObservationDefinitionRow,
  facilityId: string,
  existingSlug?: string,
): ObservationDefinitionCreateSpec & { id?: string } {
  const datapoint: ObservationDefinitionCreateSpec & { id?: string } = {
    slug_value: row.slug_value,
    title: row.title,
    description: row.description,
    status: row.status,
    category: row.category,
    code: {
      system: row.code_system,
      code: row.code_value,
      display: row.code_display,
    },
    permitted_data_type: row.permitted_data_type,
    component: row.component,
    body_site: buildOptionalCode(
      row.body_site_system,
      row.body_site_code,
      row.body_site_display,
    ),
    method: buildOptionalCode(
      row.method_system,
      row.method_code,
      row.method_display,
    ),
    permitted_unit: buildOptionalCode(
      row.permitted_unit_system,
      row.permitted_unit_code,
      row.permitted_unit_display,
    ),
    qualified_ranges: row.qualified_ranges,
    facility: facilityId,
  };

  if (row.derived_from_uri?.trim()) {
    datapoint.derived_from_uri = row.derived_from_uri.trim();
  }

  if (existingSlug) {
    datapoint.id = existingSlug;
  }

  return datapoint;
}

// ─── Review Columns ────────────────────────────────────────────────
export const OBS_DEF_REVIEW_COLUMNS: ReviewColumn<ObservationDefinitionRow>[] =
  [
    { header: "Title", accessor: "title", width: "w-48" },
    { header: "Slug", accessor: "slug_value", width: "w-40" },
    { header: "Category", accessor: "category", width: "w-32" },
    { header: "Status", accessor: "status", width: "w-24" },
    {
      header: "Data Type",
      accessor: "permitted_data_type",
      width: "w-28",
    },
    {
      header: "Components",
      accessor: (row) => row.component?.length ?? 0,
      width: "w-24",
    },
  ];
