import { request } from "@/apis/request";
import {
  CodeSchema,
  getCellValue,
  normalizeHeader,
} from "@/internalTypes/common";
import type { ProcessedRow } from "@/internalTypes/importConfig";
import { ResourceCategoryResourceType } from "@/types/base/resourceCategory/resourceCategory";
import {
  ActivityDefinitionCreateSpec,
  ActivityDefinitionUpdateSpec,
  Classification,
  Kind,
  Status,
} from "@/types/emr/activityDefinition/activityDefinition";
import {
  type HealthcareServiceOption,
  type ResolvedRow,
  stripMappingErrors,
} from "@/Utils/activityDefinitionHelper";
import { parseCsvText } from "@/Utils/csv";
import { batchFetchAll, formatCode, normalize } from "@/Utils/importHelpers";
import { upsertResourceCategories } from "@/Utils/resourceCategory";
import { isUrlSafeSlug } from "@/Utils/slug";
import { z } from "zod";

import type { ReviewColumn } from "@/internalTypes/importConfig";
import type { Code } from "@/types/base/code/code";

import {
  buildHeaderMapping,
  validateNoDuplicateSlugs,
} from "@/internalTypes/common";
import chargeItemDefinitionApi from "@/types/billing/chargeItemDefinition/chargeItemDefinitionApi";
import observationDefinitionApi from "@/types/emr/observationDefinition/observationDefinitionApi";
import specimenDefinitionApi from "@/types/emr/specimenDefinition/specimenDefinitionApi";
import healthcareServiceApi from "@/types/healthcareService/healthcareServiceApi";
import locationApi from "@/types/location/locationApi";
import { splitCsvList } from "@/Utils/csv";

// ─── Row Type ─────────────────────────────────────────────────────

export interface ActivityDefinitionCsvRow {
  title: string;
  slug_value: string;
  description: string;
  usage: string;
  status: string;
  classification: string;
  kind: string;
  code: Code;
  body_site: Code | null;
  diagnostic_report_codes: Code[];
  derived_from_uri: string;
  category_name?: string;
  specimen_slugs: string[];
  observation_slugs: string[];
  charge_item_slugs: string[];
  charge_item_price: string;
  location_names: string[];
  healthcare_service_name: string;
}

// ─── Headers ──────────────────────────────────────────────────────

export const AD_REQUIRED_HEADERS = [
  "title",
  "description",
  "usage",
  "classification",
  "category_name",
  "code_system",
  "code_value",
  "code_display",
] as const;

const AD_OPTIONAL_HEADERS = [
  "slug_value",
  "status",
  "kind",
  "body_site_system",
  "body_site_code",
  "body_site_display",
  "diagnostic_report_system",
  "diagnostic_report_code",
  "diagnostic_report_display",
  "derived_from_uri",
  "specimen_slugs",
  "observation_slugs",
  "charge_item_slugs",
  "charge_item_price",
  "location_names",
  "healthcare_service_name",
] as const;

export const AD_HEADER_MAP: Record<string, string> = buildHeaderMapping([
  ...AD_REQUIRED_HEADERS,
  ...AD_OPTIONAL_HEADERS,
]);

export const getActivityDefinitionCsvRowSchema = () =>
  z
    .object({
      title: z.string().min(1, "Title is required"),
      slug_value: z
        .string()
        .min(1, "Slug is required")
        .regex(
          /^[a-z0-9_-]+$/,
          "Slug must contain only lowercase letters, digits, hyphens, and underscores",
        )
        .max(36, "Slug must be at most 36 characters"),
      description: z.string().min(1, "Description is required"),
      usage: z.string().min(1, "Usage is required"),
      status: z.nativeEnum(Status),
      classification: z.nativeEnum(Classification),
      kind: z.nativeEnum(Kind),
      code: CodeSchema,
      body_site: CodeSchema.nullable(),
      diagnostic_report_codes: z.array(CodeSchema),
      derived_from_uri: z.string(),
      category_name: z.string().optional(),
      categorySlug: z.string().optional(),
      specimen_slugs: z.array(z.string()),
      observation_slugs: z.array(z.string()),
      charge_item_slugs: z.array(z.string()),
      charge_item_price: z.string(),
      location_names: z.array(z.string()),
      healthcare_service_name: z.string(),
    })
    .superRefine((data, ctx) => {
      if (!data.category_name && !data.categorySlug) {
        ctx.addIssue({
          message:
            "Either category_name or categorySlug must be provided. Pick category from dropdown or include category_name column in your csv.",
          code: z.ZodIssueCode.custom,
          path: ["category_name"],
        });
      }
    });

// ─── Constants ────────────────────────────────────────────────────

export const ACTIVITY_STATUSES = [
  "draft",
  "active",
  "retired",
  "unknown",
] as const;
export const ACTIVITY_CLASSIFICATIONS = [
  "laboratory",
  "imaging",
  "surgical_procedure",
  "counselling",
] as const;
export const ACTIVITY_KIND = "service_request";

// ─── Helpers ──────────────────────────────────────────────────────
const isNonEmptyString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

function buildOptionalCodeWithErrors(
  system: string | undefined,
  code: string | undefined,
  display: string | undefined,
  errors: string[],
  label: string,
  defaultSystem?: string,
) {
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
}

function buildOptionalCode(
  system: string,
  code: string,
  display: string,
): Code | null {
  if (!code && !display) return null;
  if (!code || !display) return null;
  const formattedCode = formatCode(code) ?? code;
  return {
    system: system || "http://snomed.info/sct",
    code: formattedCode,
    display,
  };
}

// ─── CSV Row Parser ───────────────────────────────────────────────

export function parseActivityDefinitionCsvRow(
  row: string[],
  headerIndices: Record<string, number>,
  categorySlug?: string,
): Record<string, unknown> {
  const get = (key: string) => row[headerIndices[key]]?.trim() ?? "";

  const title = get("title");
  const slugValue =
    get("slug_value") ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+$/, "");
  const codeSystem = get("code_system") || "http://snomed.info/sct";

  // Build diagnostic report codes from comma-separated triplets
  const diagnosticSystems = splitCsvList(get("diagnostic_report_system"));
  const diagnosticCodes = splitCsvList(get("diagnostic_report_code"));
  const diagnosticDisplays = splitCsvList(get("diagnostic_report_display"));

  const diagnosticReportCodes: Code[] = [];
  if (
    diagnosticSystems.length > 0 &&
    diagnosticCodes.length > 0 &&
    diagnosticDisplays.length > 0 &&
    diagnosticSystems.length === diagnosticCodes.length &&
    diagnosticCodes.length === diagnosticDisplays.length
  ) {
    for (let i = 0; i < diagnosticCodes.length; i++) {
      diagnosticReportCodes.push({
        system: diagnosticSystems[i],
        code: diagnosticCodes[i],
        display: diagnosticDisplays[i],
      });
    }
  }

  return {
    title,
    slug_value: slugValue,
    description: get("description"),
    usage: get("usage"),
    status: (get("status") || "active").toLowerCase(),
    classification: (get("classification") || "laboratory").toLowerCase(),
    kind: get("kind") || "service_request",
    code: {
      system: codeSystem,
      code: formatCode(get("code_value")),
      display: get("code_display"),
    },
    body_site: buildOptionalCode(
      get("body_site_system"),
      get("body_site_code"),
      get("body_site_display"),
    ),
    diagnostic_report_codes: diagnosticReportCodes,
    derived_from_uri: get("derived_from_uri"),
    specimen_slugs: splitCsvList(get("specimen_slugs")),
    observation_slugs: splitCsvList(get("observation_slugs")),
    charge_item_slugs: splitCsvList(get("charge_item_slugs")),
    charge_item_price: get("charge_item_price"),
    location_names: splitCsvList(get("location_names")),
    healthcare_service_name: get("healthcare_service_name"),
    ...(categorySlug
      ? { categorySlug }
      : { category_name: get("category_name") }),
  };
}

// ─── Cross-Row Validation ─────────────────────────────────────────

/**
 * Synchronous cross-row checks (duplicates, etc.).
 */
function validateActivityDefinitionCsvRowsSync(
  rows: ActivityDefinitionCsvRow[],
): { identifier: string; reason: string }[] {
  const errors = validateNoDuplicateSlugs(rows, (row) => row.slug_value);

  return errors;
}

/**
 * Shared cache populated by validateActivityDefinitionCsvRowsAsync
 * and consumed by preCreate. Avoids duplicate API calls.
 */
export interface ActivityDefinitionValidationCache {
  /** location name (normalized) → location ID */
  locationIdMap: Map<string, string>;
  /** healthcare service name (normalized) → service ID */
  healthcareServiceIdMap: Map<string, string>;
  /** category name (normalized) → category slug */
  categorySlugMap: Map<string, string>;
}

export function createValidationCache(): ActivityDefinitionValidationCache {
  return {
    locationIdMap: new Map(),
    healthcareServiceIdMap: new Map(),
    categorySlugMap: new Map(),
  };
}

/**
 * Async cross-row validation that checks dependency existence against the backend.
 * Also populates the provided cache with resolved IDs for locations and healthcare
 * services, so preCreate can look them up without re-fetching.
 */
export async function validateActivityDefinitionCsvRowsAsync(
  rows: ActivityDefinitionCsvRow[],
  facilityId: string,
  cache?: ActivityDefinitionValidationCache,
): Promise<{ identifier: string; reason: string }[]> {
  const errors = validateActivityDefinitionCsvRowsSync(rows);

  // Collect all unique dependency references across rows
  const allSpecimenSlugs = new Set<string>();
  const allObservationSlugs = new Set<string>();
  const allChargeItemSlugs = new Set<string>();
  const allLocationNames = new Set<string>();
  const allHealthcareServiceNames = new Set<string>();

  for (const row of rows) {
    for (const s of row.specimen_slugs) allSpecimenSlugs.add(s);
    for (const s of row.observation_slugs) allObservationSlugs.add(s);
    for (const s of row.charge_item_slugs) allChargeItemSlugs.add(s);
    for (const n of row.location_names) allLocationNames.add(n);
    if (row.healthcare_service_name)
      allHealthcareServiceNames.add(row.healthcare_service_name);
  }

  // Resolve all dependencies in parallel
  const specimenResults = new Map<string, boolean>();
  const observationResults = new Map<string, boolean>();
  const chargeItemResults = new Map<string, boolean>();
  const locationResults = new Map<string, boolean>();
  const hsResults = new Map<string, boolean>();

  await Promise.all([
    // Check specimen slugs (batch fetch)
    (async () => {
      if (allSpecimenSlugs.size === 0) return;
      try {
        const results = await batchFetchAll<{ slug: string }>(
          specimenDefinitionApi.listSpecimenDefinitions,
          { pathParams: { facilityId } },
        );
        const existingSlugs = new Set(results.map((item) => item.slug));
        for (const slug of allSpecimenSlugs) {
          specimenResults.set(
            slug,
            existingSlugs.has(`f-${facilityId}-${slug}`),
          );
        }
      } catch {
        for (const slug of allSpecimenSlugs) {
          specimenResults.set(slug, false);
        }
      }
    })(),

    // Check observation slugs (batch fetch)
    (async () => {
      if (allObservationSlugs.size === 0) return;
      try {
        const results = await batchFetchAll<{ slug: string }>(
          observationDefinitionApi.listObservationDefinition,
          { queryParams: { facility: facilityId } },
        );
        const existingSlugs = new Set(results.map((item) => item.slug));
        for (const slug of allObservationSlugs) {
          observationResults.set(
            slug,
            existingSlugs.has(`f-${facilityId}-${slug}`),
          );
        }
      } catch {
        for (const slug of allObservationSlugs) {
          observationResults.set(slug, false);
        }
      }
    })(),

    // Check charge item slugs (batch fetch)
    (async () => {
      if (allChargeItemSlugs.size === 0) return;
      try {
        const results = await batchFetchAll<{ slug: string }>(
          chargeItemDefinitionApi.listChargeItemDefinition,
          { pathParams: { facilityId } },
        );
        const existingSlugs = new Set(results.map((item) => item.slug));
        for (const slug of allChargeItemSlugs) {
          chargeItemResults.set(
            slug,
            existingSlugs.has(`f-${facilityId}-${slug}`),
          );
        }
      } catch {
        for (const slug of allChargeItemSlugs) {
          chargeItemResults.set(slug, false);
        }
      }
    })(),

    // Check locations by name (batch fetch) — also populate cache with IDs
    (async () => {
      if (allLocationNames.size === 0) return;
      try {
        const results = await batchFetchAll<{ name: string; id: string }>(
          locationApi.list,
          {
            pathParams: { facility_id: facilityId },
          },
        );
        const locationsByName = new Map(
          results.map((loc) => [normalize(loc.name), loc]),
        );
        for (const name of allLocationNames) {
          const loc = locationsByName.get(normalize(name));
          locationResults.set(name, !!loc);
          if (loc && cache) {
            cache.locationIdMap.set(normalize(name), loc.id);
          }
        }
      } catch {
        for (const name of allLocationNames) {
          locationResults.set(name, false);
        }
      }
    })(),

    // Check healthcare services (batch fetch) — also populate cache with IDs
    (async () => {
      if (allHealthcareServiceNames.size === 0) return;
      try {
        const response = await request(
          healthcareServiceApi.listHealthcareService,
          {
            pathParams: { facilityId },
            queryParams: { limit: 200 },
          },
        );
        const servicesByName = new Map(
          response.results.map((svc) => [normalize(svc.name), svc]),
        );
        for (const name of allHealthcareServiceNames) {
          const svc = servicesByName.get(normalize(name));
          hsResults.set(name, !!svc);
          if (svc && cache) {
            cache.healthcareServiceIdMap.set(normalize(name), svc.id);
          }
        }
      } catch {
        for (const name of allHealthcareServiceNames) {
          hsResults.set(name, false);
        }
      }
    })(),
  ]);

  // Map dependency failures back to individual rows
  for (const row of rows) {
    const slug = row.slug_value;

    for (const s of row.specimen_slugs) {
      if (!specimenResults.get(s)) {
        errors.push({
          identifier: slug,
          reason: `Specimen definition not found: ${s}`,
        });
      }
    }

    for (const s of row.observation_slugs) {
      if (!observationResults.get(s)) {
        errors.push({
          identifier: slug,
          reason: `Observation definition not found: ${s}`,
        });
      }
    }

    for (const s of row.charge_item_slugs) {
      if (!chargeItemResults.get(s)) {
        errors.push({
          identifier: slug,
          reason: `Charge item definition not found: ${s}`,
        });
      }
    }

    for (const name of row.location_names) {
      if (!locationResults.get(name)) {
        errors.push({
          identifier: slug,
          reason: `Location not found: ${name}`,
        });
      }
    }

    if (
      row.healthcare_service_name &&
      !hsResults.get(row.healthcare_service_name)
    ) {
      errors.push({
        identifier: slug,
        reason: `Healthcare service not found: ${row.healthcare_service_name}`,
      });
    }
  }

  return errors;
}

/**
 * Default sync-only validation (duplicate slugs). Used when no facilityId is available.
 */
export function validateActivityDefinitionCsvRows(
  rows: ActivityDefinitionCsvRow[],
): { identifier: string; reason: string }[] {
  return validateActivityDefinitionCsvRowsSync(rows);
}

// ─── Review Columns ───────────────────────────────────────────────

export const getReviewColumns = (
  categoryTitle?: string,
): ReviewColumn<ActivityDefinitionCsvRow>[] => [
  { header: "Title", accessor: "title", width: "w-48" },
  { header: "Slug", accessor: "slug_value" },
  { header: "Classification", accessor: "classification" },
  {
    header: "Category",
    accessor: categoryTitle ? () => categoryTitle : "category_name",
  },
  { header: "Status", accessor: "status" },
];

// ─── Sample CSV ───────────────────────────────────────────────────

export const AD_SAMPLE_CSV = {
  headers: [
    ...AD_REQUIRED_HEADERS,
    ...AD_OPTIONAL_HEADERS,
  ] as unknown as string[],
  rows: [
    [
      "Complete Blood Count",
      "Complete blood count test",
      "Order CBC for baseline evaluation",
      "laboratory",
      "Hematology",
      "http://snomed.info/sct",
      "26604007",
      "Complete blood count",
      "complete-blood-count",
      "active",
      "service_request",
      "",
      "",
      "",
      "http://loinc.org",
      "718-7",
      "Hemoglobin [Mass/volume] in Blood",
      "",
      "whole-blood",
      "hemoglobin, platelet-count",
      "cbc-charge-item",
      "",
      "Main Lab",
      "General Medicine",
    ],
  ],
};

export type ActivityDefinitionRow = ActivityDefinitionProcessedRow["data"] & {
  resolved?: ResolvedRow;
};

// ─── Full CSV Parser ──────────────────────────────────────────────────────────

export const parseActivityDefinitionCsv = (
  csvText: string,
  options: {
    requireChargeItemPrice?: boolean;
  } = {},
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

  const missingHeaders = AD_REQUIRED_HEADERS.filter(
    (header) => headerMap[normalizeHeader(header)] === undefined,
  );

  if (missingHeaders.length > 0) {
    throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
  }

  const slugSeen = new Map<string, number>();

  return rows.map((row, index) => {
    const errors: string[] = [];
    const title = getCellValue(row, headerMap, "title").trim();
    const slugValue = getCellValue(row, headerMap, "slug_value").trim();
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

    const bodySite = buildOptionalCodeWithErrors(
      getCellValue(row, headerMap, "body_site_system").trim(),
      getCellValue(row, headerMap, "body_site_code").trim(),
      getCellValue(row, headerMap, "body_site_display").trim(),
      errors,
      "Body site",
    );

    const diagnosticSystems = splitCsvList(
      getCellValue(row, headerMap, "diagnostic_report_system").trim(),
    );
    const diagnosticCodes = splitCsvList(
      getCellValue(row, headerMap, "diagnostic_report_code").trim(),
    );
    const diagnosticDisplays = splitCsvList(
      getCellValue(row, headerMap, "diagnostic_report_display").trim(),
    );
    const hasDiagnosticValues =
      diagnosticSystems.length > 0 ||
      diagnosticCodes.length > 0 ||
      diagnosticDisplays.length > 0;
    let diagnosticReportCodes: Code[] = [];

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
      slug_value: slugValue,
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
      specimen_slugs: splitCsvList(
        getCellValue(row, headerMap, "specimen_slugs").trim(),
      ),
      observation_slugs: splitCsvList(
        getCellValue(row, headerMap, "observation_slugs").trim(),
      ),
      charge_item_slugs: splitCsvList(
        getCellValue(row, headerMap, "charge_item_slugs").trim(),
      ),
      charge_item_price: chargeItemPrice,
      location_names: splitCsvList(
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

// ─── Parse (ImportFlow wrapper) ───────────────────────────────────────────────

/**
 * Parse CSV text into ProcessedRows for ImportFlow.
 */
export function parseMasterCsvToRows(
  csvText: string,
): ProcessedRow<ActivityDefinitionRow>[] {
  const rows = parseActivityDefinitionCsv(csvText);
  return rows.map((row) => ({
    rowIndex: row.rowIndex,
    data: { ...row.data },
    errors: [...row.errors],
    raw: [],
  }));
}

// ─── Reference Resolution ─────────────────────────────────────────────────────

export interface ResolveReferencesResult {
  rows: ProcessedRow<ActivityDefinitionRow>[];
  healthcareServices: HealthcareServiceOption[];
  categorySlugMap: Map<string, string>;
  hasUnresolvedHealthcareServices: boolean;
}

/**
 * Resolve all external references for a batch of rows:
 * - specimen slugs → validate existence
 * - observation slugs → validate existence
 * - charge item slugs → find by activity title
 * - location names → find IDs
 * - resource categories → upsert once (batch)
 * - healthcare services → fetch list (for mapping UI if needed)
 *
 * Rows with unresolvable references get errors attached.
 * Healthcare service resolution is deferred to the mapping step.
 */
export async function resolveReferences(
  rows: ProcessedRow<ActivityDefinitionRow>[],
  facilityId: string,
): Promise<ResolveReferencesResult> {
  const validSpecimenSlugs = new Set<string>();
  const validObservationSlugs = new Set<string>();
  const chargeItemMap: Record<string, string> = {};
  const locationMap: Record<string, string> = {};

  // Collect unique values
  const uniqueSpecimenSlugs = new Set<string>();
  const uniqueObservationSlugs = new Set<string>();
  const uniqueActivityTitles = new Set<string>();
  const uniqueLocations = new Set<string>();
  const categoryNames: string[] = [];

  rows.forEach((row) => {
    row.data.specimen_slugs.forEach((slug: string) =>
      uniqueSpecimenSlugs.add(slug),
    );
    row.data.observation_slugs.forEach((slug: string) =>
      uniqueObservationSlugs.add(slug),
    );
    const title = row.data.title.trim();
    if (title) uniqueActivityTitles.add(title);
    row.data.location_names.forEach((name: string) =>
      uniqueLocations.add(name),
    );
    if (row.data.category_name?.trim()) {
      categoryNames.push(row.data.category_name);
    }
  });

  // Run all lookups in parallel
  const [, , , , healthcareServicesResponse, categorySlugMap] =
    await Promise.all([
      // Specimen slugs
      Promise.all(
        Array.from(uniqueSpecimenSlugs).map(async (slug) => {
          try {
            await request(specimenDefinitionApi.retrieveSpecimenDefinition, {
              pathParams: { facilityId, slug: `f-${facilityId}-${slug}` },
            });
            validSpecimenSlugs.add(slug);
          } catch {
            // will surface as error on rows below
          }
        }),
      ),

      // Observation slugs
      Promise.all(
        Array.from(uniqueObservationSlugs).map(async (slug) => {
          try {
            await request(
              observationDefinitionApi.retrieveObservationDefinition,
              {
                pathParams: { observationSlug: `f-${facilityId}-${slug}` },
              },
            );
            validObservationSlugs.add(slug);
          } catch {
            // will surface as error on rows below
          }
        }),
      ),

      // Charge items (match by activity title)
      Promise.all(
        Array.from(uniqueActivityTitles).map(async (title) => {
          try {
            const response = await request(
              chargeItemDefinitionApi.listChargeItemDefinition,
              {
                pathParams: { facilityId },
                queryParams: { title, limit: 10 },
              },
            );
            const match = response.results.find(
              (item) => normalize(item.title) === normalize(title),
            );
            if (match) {
              chargeItemMap[normalize(title)] = match.slug;
            }
          } catch {
            // will surface as error on rows below
          }
        }),
      ),

      // Locations
      Promise.all(
        Array.from(uniqueLocations).map(async (name) => {
          try {
            const response = await request(locationApi.list, {
              pathParams: { facilityId },
              queryParams: { name, limit: 50 },
            });
            const match = response.results.find(
              (item) => normalize(item.name) === normalize(name),
            );
            if (match) {
              locationMap[normalize(name)] = match.id;
            }
          } catch {
            // will surface as error on rows below
          }
        }),
      ),

      // Healthcare services (fetch list for mapping UI)
      request(healthcareServiceApi.listHealthcareService, {
        pathParams: { facilityId },
        queryParams: { limit: 200 },
      }).catch(() => ({ results: [] })),

      // Resource categories — single batch upsert
      upsertResourceCategories({
        facilityId,
        categories: categoryNames,
        resourceType: ResourceCategoryResourceType.activity_definition,
        slugPrefix: "ad",
      }),
    ]);

  const healthcareServices = ((
    healthcareServicesResponse as { results: HealthcareServiceOption[] }
  ).results ?? []) as HealthcareServiceOption[];

  // Attach resolved data and errors to each row
  const resolvedRows = rows.map((row) => {
    const updatedErrors = stripMappingErrors(row.errors);
    const resolved: ResolvedRow = {
      specimenSlugs: [],
      observationSlugs: [],
      chargeItemSlugs: [],
      locationIds: [],
      categorySlug: row.data?.category_name
        ? categorySlugMap.get(normalize(row.data?.category_name))
        : "",
      healthcareServiceId: null,
    };

    row.data.specimen_slugs.forEach((slug: string) => {
      if (validSpecimenSlugs.has(slug)) {
        resolved.specimenSlugs.push(slug);
      } else {
        updatedErrors.push(`Specimen slug not found: ${slug}`);
      }
    });

    row.data.observation_slugs.forEach((slug: string) => {
      if (validObservationSlugs.has(slug)) {
        resolved.observationSlugs.push(slug);
      } else {
        updatedErrors.push(`Observation slug not found: ${slug}`);
      }
    });

    row.data.location_names.forEach((name: string) => {
      const id = locationMap[normalize(name)];
      if (id) {
        resolved.locationIds.push(id);
      } else {
        updatedErrors.push(`Location not found: ${name}`);
      }
    });

    const title = row.data.title.trim();
    if (title) {
      const slug = chargeItemMap[normalize(title)];
      if (slug) {
        resolved.chargeItemSlugs.push(slug);
      } else {
        updatedErrors.push(
          `Charge item not found for activity definition: ${title}`,
        );
      }
    }

    return {
      ...row,
      errors: updatedErrors,
      data: { ...row.data, resolved },
    };
  });

  // Check if any row needs healthcare service mapping
  const hasUnresolvedHealthcareServices = resolvedRows.some(
    (row) => row.errors.length === 0 && !row.data.resolved?.healthcareServiceId,
  );

  return {
    rows: resolvedRows,
    healthcareServices,
    categorySlugMap,
    hasUnresolvedHealthcareServices,
  };
}

/**
 * Apply healthcare service selections from the mapping UI to the rows.
 * Maps healthcare_service_name → healthcareServiceId via the provided mappings.
 */
export function applyHealthcareServiceMappings(
  rows: ProcessedRow<ActivityDefinitionRow>[],
  healthcareServiceMappings: Record<string, string>,
): ProcessedRow<ActivityDefinitionRow>[] {
  return rows.map((row) => {
    const healthcareServiceId = row.data?.healthcare_service_name
      ? healthcareServiceMappings[row.data.healthcare_service_name]
      : null;
    const updatedErrors = stripMappingErrors(row.errors);
    if (!healthcareServiceId) {
      updatedErrors.push(
        `Healthcare service not found: ${row.data.healthcare_service_name}`,
      );
    }
    return {
      ...row,
      errors: updatedErrors,
      data: {
        ...row.data,
        resolved: row.data.resolved
          ? { ...row.data.resolved, healthcareServiceId }
          : undefined,
      },
    };
  });
}

// ─── Payload Builder ──────────────────────────────────────────────────────────

/**
 * Build the upsert datapoint payload from a resolved ActivityDefinitionRow.
 */
export function toActivityDefinitionDatapoint(
  row: ActivityDefinitionRow,
  facilityId: string,
  existingSlug?: string,
): ActivityDefinitionCreateSpec | ActivityDefinitionUpdateSpec {
  const resolved = row.resolved;
  const payload: ActivityDefinitionCreateSpec = {
    slug_value: row.slug_value,
    title: row.title,
    status: row.status as Status,
    description: row.description,
    usage: row.usage,
    classification: row.classification as Classification,
    kind: row.kind as Kind,
    code: row.code,
    body_site: row.body_site,
    diagnostic_report_codes: row.diagnostic_report_codes,
    derived_from_uri: row.derived_from_uri || null,
    facility: facilityId,
    specimen_requirements: (resolved?.specimenSlugs ?? []).map(
      (s: string) => `f-${facilityId}-${s}`,
    ),
    observation_result_requirements: (resolved?.observationSlugs ?? []).map(
      (s: string) => `f-${facilityId}-${s}`,
    ),
    charge_item_definitions: (resolved?.chargeItemSlugs ?? []).map(
      (s: string) => `f-${facilityId}-${s}`,
    ),
    locations: resolved?.locationIds ?? [],
    category: resolved?.categorySlug ?? "",
    healthcare_service: resolved?.healthcareServiceId ?? null,
  };

  if (existingSlug) {
    (payload as ActivityDefinitionUpdateSpec).id = existingSlug;
  }

  return payload;
}

// ─── Review Columns ───────────────────────────────────────────────────────────

export const AD_REVIEW_COLUMNS: ReviewColumn<ActivityDefinitionRow>[] = [
  { header: "Title", accessor: (row) => row.title ?? "" },
  { header: "Slug", accessor: (row) => row.slug_value ?? "" },
  { header: "Classification", accessor: (row) => row.classification ?? "" },
  { header: "Status", accessor: (row) => row.status ?? "" },
];
export type ActivityDefinitionProcessedRow = {
  rowIndex: number;
  data: ActivityDefinitionCsvRow;
  errors: string[];
};
