import { parseCsvText } from "@/utils/csv";

export type CodePayload = {
  system: string;
  code: string;
  display: string;
};

export type ActivityDefinitionRow = {
  title: string;
  slug_value?: string;
  description: string;
  usage: string;
  status: string;
  classification: string;
  kind: string;
  code: CodePayload;
  body_site: CodePayload | null;
  diagnostic_report_codes: CodePayload[];
  derived_from_uri?: string;
  category_name: string;
  specimen_names: string[];
  observation_names: string[];
  charge_item_names: string[];
  charge_item_price?: string;
  location_names: string[];
  healthcare_service_name?: string;
};

export type ActivityDefinitionProcessedRow = {
  rowIndex: number;
  data: ActivityDefinitionRow;
  errors: string[];
};

interface ParseActivityDefinitionOptions {
  requireChargeItemPrice?: boolean;
}

const REQUIRED_HEADERS = [
  "title",
  "description",
  "usage",
  "classification",
  "category_name",
  "code_system",
  "code_value",
  "code_display",
] as const;

const ACTIVITY_STATUSES = ["draft", "active", "retired", "unknown"] as const;
const ACTIVITY_CLASSIFICATIONS = [
  "laboratory",
  "imaging",
  "surgical_procedure",
  "counselling",
] as const;
const ACTIVITY_KIND = "service_request";

const normalizeHeader = (header: string) =>
  header.toLowerCase().replace(/[^a-z0-9]/g, "");

const splitCellValues = (value?: string) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const isNonEmptyString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

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

const getCellValue = (
  row: string[],
  headerMap: Record<string, number>,
  key: string,
) => {
  const index = headerMap[normalizeHeader(key)];
  return index === undefined ? "" : (row[index] ?? "");
};

export const parseActivityDefinitionCsv = (
  csvText: string,
  options: ParseActivityDefinitionOptions = {},
): ActivityDefinitionProcessedRow[] => {
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
    const usage = getCellValue(row, headerMap, "usage").trim();
    const status = getCellValue(row, headerMap, "status").trim();
    const classification = getCellValue(
      row,
      headerMap,
      "classification",
    ).trim();
    const categoryName = getCellValue(row, headerMap, "category_name").trim();
    const codeSystem = getCellValue(row, headerMap, "code_system").trim();
    const codeValue = getCellValue(row, headerMap, "code_value").trim();
    const codeDisplay = getCellValue(row, headerMap, "code_display").trim();
    const chargeItemPrice = getCellValue(
      row,
      headerMap,
      "charge_item_price",
    ).trim();

    if (!title) errors.push("Missing title");
    if (!description) errors.push("Missing description");
    if (!usage) errors.push("Missing usage");
    if (!categoryName) errors.push("Missing category name");
    if (!codeValue || !codeDisplay) {
      errors.push("Missing code value/display");
    }

    const resolvedStatus = status || "active";
    if (!ACTIVITY_STATUSES.includes(resolvedStatus as never)) {
      errors.push("Invalid status value");
    }

    const resolvedClassification = classification || "laboratory";
    if (!ACTIVITY_CLASSIFICATIONS.includes(resolvedClassification as never)) {
      errors.push("Invalid classification value");
    }

    const resolvedCodeSystem = codeSystem.trim() || "http://snomed.info/sct";

    const bodySite = buildOptionalCode(
      getCellValue(row, headerMap, "body_site_system").trim(),
      getCellValue(row, headerMap, "body_site_code").trim(),
      getCellValue(row, headerMap, "body_site_display").trim(),
      errors,
      "Body site",
    );

    const diagnosticSystems = splitCellValues(
      getCellValue(row, headerMap, "diagnostic_report_system").trim(),
    );
    const diagnosticCodes = splitCellValues(
      getCellValue(row, headerMap, "diagnostic_report_code").trim(),
    );
    const diagnosticDisplays = splitCellValues(
      getCellValue(row, headerMap, "diagnostic_report_display").trim(),
    );
    const hasDiagnosticValues =
      diagnosticSystems.length > 0 ||
      diagnosticCodes.length > 0 ||
      diagnosticDisplays.length > 0;
    let diagnosticReportCodes: CodePayload[] = [];

    if (hasDiagnosticValues) {
      if (
        !diagnosticSystems.length ||
        !diagnosticCodes.length ||
        !diagnosticDisplays.length
      ) {
        errors.push("Diagnostic report requires system, code, and display");
      } else if (
        diagnosticSystems.length !== diagnosticCodes.length ||
        diagnosticCodes.length !== diagnosticDisplays.length
      ) {
        errors.push("Diagnostic report system/code/display counts must match");
      } else {
        diagnosticReportCodes = diagnosticCodes.map((code, index) => ({
          system: diagnosticSystems[index],
          code,
          display: diagnosticDisplays[index],
        }));
      }
    }

    const data: ActivityDefinitionRow = {
      title,
      slug_value: getCellValue(row, headerMap, "slug_value").trim(),
      description,
      usage,
      status: resolvedStatus,
      classification: resolvedClassification,
      kind: getCellValue(row, headerMap, "kind").trim() || ACTIVITY_KIND,
      code: {
        system: resolvedCodeSystem,
        code: codeValue,
        display: codeDisplay,
      },
      body_site: bodySite,
      diagnostic_report_codes: diagnosticReportCodes,
      derived_from_uri: getCellValue(row, headerMap, "derived_from_uri").trim(),
      category_name: categoryName,
      specimen_names: splitCellValues(
        getCellValue(row, headerMap, "specimen_names").trim(),
      ),
      observation_names: splitCellValues(
        getCellValue(row, headerMap, "observation_names").trim(),
      ),
      charge_item_names: splitCellValues(
        getCellValue(row, headerMap, "charge_item_names").trim(),
      ),
      charge_item_price: chargeItemPrice || undefined,
      location_names: splitCellValues(
        getCellValue(row, headerMap, "location_names").trim(),
      ),
      healthcare_service_name: getCellValue(
        row,
        headerMap,
        "healthcare_service_name",
      ).trim(),
    };

    if (!isNonEmptyString(data.kind)) {
      errors.push("Missing kind");
    }

    if (options.requireChargeItemPrice && !data.charge_item_price) {
      errors.push("Missing charge item price");
    }

    return {
      rowIndex: index + 2,
      data,
      errors,
    };
  });
};
