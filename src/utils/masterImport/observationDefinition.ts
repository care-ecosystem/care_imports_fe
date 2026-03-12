import { parseCsvText } from "@/utils/csv";

export type CodePayload = {
  system: string;
  code: string;
  display: string;
};

type JsonObject = Record<string, unknown>;

export type ObservationComponentPayload = JsonObject;

export type ObservationRow = {
  title: string;
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

const normalizeHeader = (header: string) =>
  header.toLowerCase().replace(/[^a-z0-9]/g, "");

const isJsonObject = (value: unknown): value is JsonObject =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isNonEmptyString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

const validateCodeObject = (
  value: unknown,
  errors: string[],
  label: string,
  indexLabel?: string,
) => {
  if (!isJsonObject(value)) {
    errors.push(`${label}${indexLabel ? ` ${indexLabel}` : ""} is invalid`);
    return false;
  }

  const system = value.system;
  const code = value.code;
  const display = value.display;

  if (
    !isNonEmptyString(system) ||
    !isNonEmptyString(code) ||
    !isNonEmptyString(display)
  ) {
    errors.push(
      `${label}${indexLabel ? ` ${indexLabel}` : ""} must include system, code, and display`,
    );
    return false;
  }

  return true;
};

const validateQualifiedRanges = (
  ranges: JsonObject[],
  errors: string[],
  prefix: string,
) => {
  ranges.forEach((range, rangeIndex) => {
    const indexLabel = `${prefix} ${rangeIndex + 1}`;
    if (!isJsonObject(range)) {
      errors.push(`${indexLabel} is invalid`);
      return;
    }

    const conditions = range.conditions;
    if (!Array.isArray(conditions)) {
      errors.push(`${indexLabel} must include conditions array`);
    } else {
      conditions.forEach((condition, conditionIndex) => {
        if (!isJsonObject(condition)) {
          errors.push(
            `${indexLabel} condition ${conditionIndex + 1} is invalid`,
          );
          return;
        }
        if (!isNonEmptyString(condition.metric)) {
          errors.push(
            `${indexLabel} condition ${conditionIndex + 1} missing metric`,
          );
        }
        if (!isNonEmptyString(condition.operation)) {
          errors.push(
            `${indexLabel} condition ${conditionIndex + 1} missing operation`,
          );
        }
        const value = condition.value;
        const hasValue =
          isNonEmptyString(value) ||
          (isJsonObject(value) && Object.keys(value).length > 0);
        if (!hasValue) {
          errors.push(
            `${indexLabel} condition ${conditionIndex + 1} missing value`,
          );
        }
      });
    }

    const numericRanges = range.ranges;
    if (!Array.isArray(numericRanges) || numericRanges.length === 0) {
      errors.push(`${indexLabel} must include ranges array`);
    } else {
      numericRanges.forEach((numericRange, numericIndex) => {
        if (!isJsonObject(numericRange)) {
          errors.push(`${indexLabel} range ${numericIndex + 1} is invalid`);
          return;
        }
        const interpretation = numericRange.interpretation;
        if (
          !isJsonObject(interpretation) ||
          !isNonEmptyString(interpretation.display)
        ) {
          errors.push(
            `${indexLabel} range ${numericIndex + 1} missing interpretation display`,
          );
        }
        const min = numericRange.min;
        const max = numericRange.max;
        const hasMin = typeof min === "number" || isNonEmptyString(min);
        const hasMax = typeof max === "number" || isNonEmptyString(max);
        if (!hasMin && !hasMax) {
          errors.push(
            `${indexLabel} range ${numericIndex + 1} must include min or max`,
          );
        }
      });
    }
  });
};

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

export const parseObservationDefinitionCsv = (
  csvText: string,
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

  return rows.map((row, index) => {
    const errors: string[] = [];
    const title = getCellValue(row, headerMap, "title").trim();
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

    const componentRaw = getCellValue(row, headerMap, "component").trim();
    let component: ObservationComponentPayload[] = [];
    if (componentRaw) {
      try {
        const parsed = JSON.parse(componentRaw);
        if (Array.isArray(parsed)) {
          const allObjects = parsed.every(isJsonObject);
          if (!allObjects) {
            errors.push("Component must be a JSON array of objects");
          } else {
            component = parsed as ObservationComponentPayload[];
            component.forEach((item, componentIndex) => {
              const indexLabel = `${componentIndex + 1}`;
              if (
                !validateCodeObject(
                  item.code,
                  errors,
                  "Component code",
                  indexLabel,
                )
              ) {
                return;
              }
              if (!isNonEmptyString(item.permitted_data_type)) {
                errors.push(
                  `Component ${indexLabel} missing permitted_data_type`,
                );
              }
              if (
                item.permitted_unit !== undefined &&
                item.permitted_unit !== null
              ) {
                validateCodeObject(
                  item.permitted_unit,
                  errors,
                  "Component permitted unit",
                  indexLabel,
                );
              }
              if (Array.isArray(item.qualified_ranges)) {
                validateQualifiedRanges(
                  item.qualified_ranges as JsonObject[],
                  errors,
                  `Component ${indexLabel} qualified range`,
                );
              } else if (item.qualified_ranges !== undefined) {
                errors.push(
                  `Component ${indexLabel} qualified_ranges must be an array`,
                );
              }
            });
          }
        } else {
          errors.push("Component must be a JSON array");
        }
      } catch {
        errors.push("Component JSON could not be parsed");
      }
    }

    const qualifiedRangesRaw = getCellValue(
      row,
      headerMap,
      "qualified_ranges",
    ).trim();
    let qualifiedRanges: JsonObject[] = [];
    if (qualifiedRangesRaw) {
      try {
        const parsedRanges = JSON.parse(qualifiedRangesRaw);
        if (Array.isArray(parsedRanges)) {
          const allObjects = parsedRanges.every(isJsonObject);
          if (!allObjects) {
            errors.push("Qualified ranges must be a JSON array of objects");
          } else {
            qualifiedRanges = parsedRanges as JsonObject[];
            validateQualifiedRanges(qualifiedRanges, errors, "Qualified range");
          }
        } else {
          errors.push("Qualified ranges must be a JSON array");
        }
      } catch {
        errors.push("Qualified ranges JSON could not be parsed");
      }
    }

    const data: ObservationRow = {
      title,
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
};
