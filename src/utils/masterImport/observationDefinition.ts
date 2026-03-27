import { parseCsvText } from "@/utils/csv";
import { isUrlSafeSlug } from "@/utils/slug";

export type CodePayload = {
  system: string;
  code: string;
  display: string;
};

type JsonObject = Record<string, unknown>;

export type ObservationComponentPayload = JsonObject;

export type ObservationRow = {
  title: string;
  slug_value: string;
  description: string;
  category: string;
  status: string;
  code: CodePayload;
  permitted_data_type: string;
  component: ObservationComponentPayload[];
  body_site: CodePayload | null;
  method: CodePayload | null;
  permitted_unit: CodePayload | null;
  qualified_ranges: JsonObject[];
  derived_from_uri?: string;
};

export type ObservationProcessedRow = {
  rowIndex: number;
  data: ObservationRow;
  errors: string[];
};

const REQUIRED_HEADERS = [
  "title",
  "description",
  "category",
  "permitted_data_type",
  "code_system",
  "code_value",
  "code_display",
] as const;

const COMPONENT_REQUIRED_HEADERS = [
  "observation_slug",
  "code_value",
  "code_display",
] as const;

const OBSERVATION_CATEGORIES = [
  "social_history",
  "vital_signs",
  "imaging",
  "laboratory",
  "procedure",
  "survey",
  "exam",
  "therapy",
  "activity",
] as const;

const OBSERVATION_STATUSES = ["draft", "active", "retired", "unknown"] as const;

const QUESTION_TYPES = [
  "boolean",
  "decimal",
  "integer",
  "dateTime",
  "time",
  "string",
  "quantity",
] as const;

const VALID_GENDERS = ["male", "female"] as const;

const VALID_AGE_OPS = ["years", "months", "days"] as const;

const normalizeHeader = (header: string) =>
  header.toLowerCase().replace(/[^a-z0-9_]/g, "");

const getCellValue = (
  row: string[],
  headerMap: Record<string, number>,
  key: string,
) => {
  const index = headerMap[normalizeHeader(key)];
  return index === undefined ? "" : (row[index] ?? "");
};

const buildOptionalCode = (
  system: string | undefined,
  code: string | undefined,
  display: string | undefined,
  errors: string[],
  label: string,
  defaultSystem?: string,
) => {
  const trimmedCode = code?.trim();
  const trimmedDisplay = display?.trim();
  if (!trimmedCode && !trimmedDisplay) {
    return null;
  }
  if (!trimmedCode || !trimmedDisplay) {
    errors.push(`${label} requires both code and display if provided`);
    return null;
  }
  const resolvedSystem = system?.trim() || defaultSystem;
  if (!resolvedSystem) {
    errors.push(`${label} requires system if provided`);
    return null;
  }
  return { system: resolvedSystem, code: trimmedCode, display: trimmedDisplay };
};

/* ------------------------------------------------------------------ */
/*  Components CSV parser                                              */
/* ------------------------------------------------------------------ */

/**
 * Build a composite key for grouping component CSV rows into
 * qualified_range sets.  Rows sharing the same condition key
 * (slug + code_value + age/gender conditions) produce range bands
 * within a single qualified_range.
 */
const buildConditionKey = (
  ageMin: string,
  ageMax: string,
  ageOp: string,
  gender: string,
): string => [ageMin, ageMax, ageOp, gender].join("|");

/**
 * Parse a components CSV string and return a map of
 *   observation_slug → ObservationComponentPayload[]
 *
 * Grouping logic:
 *  1. (observation_slug, code_value) → one component
 *  2. Within a component, (age_min, age_max, age_op, gender) → one qualified_range
 *  3. Each CSV row adds one range band to that qualified_range
 */
export const parseComponentCsv = (
  csvText: string,
): {
  componentMap: Map<string, ObservationComponentPayload[]>;
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

  // Intermediate structure for grouping:
  //   slug → code_value → { meta, conditionKey → rangeBands[] }
  type RangeBand = {
    display: string;
    min: string;
    max: string;
    csvRow: number;
  };
  type InterpGroup = {
    ageMin: string;
    ageMax: string;
    ageOp: string;
    gender: string;
    bands: RangeBand[];
  };
  type ComponentGroup = {
    codeSystem: string;
    codeValue: string;
    codeDisplay: string;
    permittedDataType: string;
    unitSystem: string;
    unitCode: string;
    unitDisplay: string;
    interpretations: Map<string, InterpGroup>;
  };

  const slugMap = new Map<string, Map<string, ComponentGroup>>();

  rows.forEach((row, idx) => {
    const csvRow = idx + 2; // 1-based, +1 for header
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

    // Row-level validation
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
    if ((ageMin || ageMax) && !ageOp) {
      errors.push({
        csvRow,
        message: "age_op is required when age_min/age_max is set",
      });
      return;
    }
    if (ageOp && !VALID_AGE_OPS.includes(ageOp.toLowerCase() as never)) {
      errors.push({
        csvRow,
        message: `Invalid age_op "${ageOp}" (must be years/months/days)`,
      });
      return;
    }
    if (gender && !VALID_GENDERS.includes(gender.toLowerCase() as never)) {
      errors.push({
        csvRow,
        message: `Invalid gender "${gender}" (must be male/female)`,
      });
      return;
    }
    // Validate range data only when range_display is provided
    if (rangeDisplay) {
      if (rangeMin && rangeMax && Number(rangeMin) > Number(rangeMax)) {
        errors.push({ csvRow, message: "Range min must be ≤ max" });
        return;
      }
    }

    // Group into structure
    if (!slugMap.has(slug)) {
      slugMap.set(slug, new Map());
    }
    const componentMap = slugMap.get(slug)!;

    if (!componentMap.has(codeValue)) {
      componentMap.set(codeValue, {
        codeSystem,
        codeValue,
        codeDisplay,
        permittedDataType,
        unitSystem,
        unitCode,
        unitDisplay,
        interpretations: new Map(),
      });
    }
    const comp = componentMap.get(codeValue)!;

    const condKey = buildConditionKey(ageMin, ageMax, ageOp, gender);
    if (!comp.interpretations.has(condKey)) {
      comp.interpretations.set(condKey, {
        ageMin,
        ageMax,
        ageOp: ageOp.toLowerCase(),
        gender: gender.toLowerCase(),
        bands: [],
      });
    }
    // Only add a range band if range_display is provided
    if (rangeDisplay) {
      comp.interpretations.get(condKey)!.bands.push({
        display: rangeDisplay,
        min: rangeMin,
        max: rangeMax,
        csvRow,
      });
    }
  });

  // Convert grouped structure → Map<slug, ObservationComponentPayload[]>
  const resultMap = new Map<string, ObservationComponentPayload[]>();

  for (const [slug, componentGroups] of slugMap) {
    const components: ObservationComponentPayload[] = [];

    for (const comp of componentGroups.values()) {
      // Build qualified_ranges from interpretation groups
      const qualifiedRanges: JsonObject[] = [];

      for (const interp of comp.interpretations.values()) {
        // Skip interpretation groups with no range bands
        if (interp.bands.length === 0) continue;

        const conditions: JsonObject[] = [];

        if (interp.ageMin || interp.ageMax) {
          const ageValue: JsonObject = { value_type: interp.ageOp || "years" };
          if (interp.ageMin) ageValue.min = Number(interp.ageMin);
          if (interp.ageMax) ageValue.max = Number(interp.ageMax);
          conditions.push({
            metric: "patient_age",
            operation: "in_range",
            value: ageValue,
          });
        }
        if (interp.gender) {
          conditions.push({
            metric: "patient_gender",
            operation: "equality",
            value: interp.gender,
          });
        }

        const rangeBands: JsonObject[] = interp.bands.map((b) => {
          const band: JsonObject = { interpretation: { display: b.display } };
          if (b.min) band.min = b.min;
          if (b.max) band.max = b.max;
          return band;
        });

        const qr: JsonObject = {
          ranges: rangeBands,
          _interpretation_type: "ranges",
        };
        if (conditions.length > 0) {
          qr.conditions = conditions;
        }
        qualifiedRanges.push(qr);
      }

      // Build permitted_unit
      let permittedUnit: CodePayload | null = null;
      if (comp.unitCode && comp.unitDisplay) {
        permittedUnit = {
          system: comp.unitSystem,
          code: comp.unitCode,
          display: comp.unitDisplay,
        };
      }

      components.push({
        code: {
          system: comp.codeSystem,
          code: comp.codeValue,
          display: comp.codeDisplay,
        },
        permitted_data_type: comp.permittedDataType,
        permitted_unit: permittedUnit,
        qualified_ranges: qualifiedRanges,
      });
    }

    resultMap.set(slug, components);
  }

  return { componentMap: resultMap, errors };
};

/* ------------------------------------------------------------------ */
/*  Definitions CSV parser                                             */
/* ------------------------------------------------------------------ */

export const parseObservationDefinitionCsv = (
  csvText: string,
  compCsvText?: string,
): ObservationProcessedRow[] => {
  const { headers, rows } = parseCsvText(csvText);

  if (headers.length === 0) {
    throw new Error("CSV is empty or missing headers");
  }

  const headerMap = headers.reduce<Record<string, number>>(
    (acc, header, index) => {
      acc[normalizeHeader(header)] = index;
      return acc;
    },
    {},
  );

  const missingHeaders = REQUIRED_HEADERS.filter(
    (header) => headerMap[normalizeHeader(header)] === undefined,
  );

  if (missingHeaders.length > 0) {
    throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
  }

  // Parse components CSV if provided
  let componentMap = new Map<string, ObservationComponentPayload[]>();
  let componentErrors: { csvRow: number; message: string }[] = [];
  if (compCsvText) {
    const result = parseComponentCsv(compCsvText);
    componentMap = result.componentMap;
    componentErrors = result.errors;
  }

  const slugSeen = new Map<string, number>();

  const processedRows = rows.map((row, index) => {
    const errors: string[] = [];
    const title = getCellValue(row, headerMap, "title").trim();
    const slugValue = getCellValue(row, headerMap, "slug_value").trim();
    const description = getCellValue(row, headerMap, "description").trim();
    const category = getCellValue(row, headerMap, "category").trim();
    const status = getCellValue(row, headerMap, "status").trim();
    const permittedDataType = getCellValue(
      row,
      headerMap,
      "permitted_data_type",
    ).trim();
    const codeSystem = getCellValue(row, headerMap, "code_system").trim();
    const codeValue = getCellValue(row, headerMap, "code_value").trim();
    const codeDisplay = getCellValue(row, headerMap, "code_display").trim();

    if (!title) errors.push("Missing title");
    if (!slugValue) {
      errors.push("Missing slug_value");
    } else {
      if (!isUrlSafeSlug(slugValue)) {
        errors.push(
          `slug_value "${slugValue}" contains invalid characters (only lowercase letters, digits, hyphens, and underscores are allowed)`,
        );
      }
      const prevRow = slugSeen.get(slugValue);
      if (prevRow !== undefined) {
        errors.push(
          `Duplicate slug_value "${slugValue}" (first seen in row ${prevRow})`,
        );
      } else {
        slugSeen.set(slugValue, index + 2);
      }
    }
    if (!description) errors.push("Missing description");
    if (!category) {
      errors.push("Missing category");
    } else if (!OBSERVATION_CATEGORIES.includes(category as never)) {
      errors.push("Invalid category value");
    }

    if (!permittedDataType) {
      errors.push("Missing permitted_data_type");
    } else if (!QUESTION_TYPES.includes(permittedDataType as never)) {
      errors.push("Invalid permitted_data_type");
    }

    const resolvedCodeSystem = codeSystem.trim() || "http://loinc.org";
    if (!codeValue || !codeDisplay) {
      errors.push("Missing code value/display");
    }

    if (status && !OBSERVATION_STATUSES.includes(status as never)) {
      errors.push("Invalid status value");
    }

    const bodySite = buildOptionalCode(
      getCellValue(row, headerMap, "body_site_system").trim(),
      getCellValue(row, headerMap, "body_site_code").trim(),
      getCellValue(row, headerMap, "body_site_display").trim(),
      errors,
      "Body site",
    );
    const method = buildOptionalCode(
      getCellValue(row, headerMap, "method_system").trim(),
      getCellValue(row, headerMap, "method_code").trim(),
      getCellValue(row, headerMap, "method_display").trim(),
      errors,
      "Method",
      "http://snomed.info/sct",
    );
    const permittedUnit = buildOptionalCode(
      getCellValue(row, headerMap, "permitted_unit_system").trim(),
      getCellValue(row, headerMap, "permitted_unit_code").trim(),
      getCellValue(row, headerMap, "permitted_unit_display").trim(),
      errors,
      "Permitted unit",
      "http://unitsofmeasure.org",
    );

    // Attach components from the components CSV (matched by slug)
    const component: ObservationComponentPayload[] =
      (slugValue ? componentMap.get(slugValue) : undefined) ?? [];

    const qualifiedRangesRaw = getCellValue(
      row,
      headerMap,
      "qualified_ranges",
    ).trim();
    let qualifiedRanges: JsonObject[] = [];
    if (qualifiedRangesRaw) {
      try {
        const parsedRanges = JSON.parse(qualifiedRangesRaw);
        if (
          Array.isArray(parsedRanges) &&
          parsedRanges.every(
            (v: unknown) =>
              Boolean(v) && typeof v === "object" && !Array.isArray(v),
          )
        ) {
          qualifiedRanges = parsedRanges as JsonObject[];
        } else {
          errors.push("Qualified ranges must be a JSON array of objects");
        }
      } catch {
        errors.push("Qualified ranges JSON could not be parsed");
      }
    }

    const data: ObservationRow = {
      title,
      slug_value: slugValue,
      description,
      category,
      status: status || "active",
      code: {
        system: resolvedCodeSystem,
        code: codeValue,
        display: codeDisplay,
      },
      permitted_data_type: permittedDataType,
      component,
      body_site: bodySite,
      method,
      permitted_unit: permittedUnit,
      qualified_ranges: qualifiedRanges,
      derived_from_uri: getCellValue(row, headerMap, "derived_from_uri").trim(),
    };

    return {
      rowIndex: index + 2,
      data,
      errors,
    };
  });

  // Surface component CSV-level errors on the first processed row
  if (componentErrors.length > 0 && processedRows.length > 0) {
    for (const err of componentErrors) {
      processedRows[0].errors.push(
        `Components CSV row ${err.csvRow}: ${err.message}`,
      );
    }
  }

  // Warn about orphan slugs in component CSV (slugs with no matching definition)
  const definedSlugs = new Set(slugSeen.keys());
  for (const slug of componentMap.keys()) {
    if (!definedSlugs.has(slug)) {
      const warning = `Components CSV references unknown slug "${slug}" (no matching definition)`;
      if (processedRows.length > 0) {
        processedRows[0].errors.push(warning);
      }
    }
  }

  return processedRows;
};
