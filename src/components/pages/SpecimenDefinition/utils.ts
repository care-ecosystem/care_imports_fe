import { z } from "zod";

import type { ProcessedRow, ReviewColumn } from "@/internalTypes/importConfig";
import {
  ContainerSpec,
  DurationSpec,
  Preference,
  QuantitySpec,
  SpecimenDefinitionCreate,
  SpecimenDefinitionStatus,
  TypeTestedSpec,
} from "@/types/emr/specimenDefinition/specimenDefinition";

import { request } from "@/apis/request";
import {
  buildHeaderMapping,
  CodeSchema,
  getCellValue,
  normalizeHeader,
  validateNoDuplicateSlugs,
  zodDecimal,
} from "@/internalTypes/common";
import { Code } from "@/types/base/code/code";
import valueSetApi from "@/types/valueSet/valueSetApi";
import { parseCsvText } from "@/Utils/csv";
import { isUrlSafeSlug } from "@/Utils/slug";

export interface SpecimenDefinitionImportProps {
  facilityId?: string;
}

export interface SpecimenRow {
  title: string;
  slug_value?: string;
  status: SpecimenDefinitionStatus;
  description: string;
  derived_from_uri?: string;
  type_collected: Code;
  patient_preparation: Code[];
  collection: Code | null;
  is_derived?: boolean;
  preference?: Preference;
  single_use?: boolean;
  requirement?: string;
  retention_time?: DurationSpec | null;
  container?: ContainerSpec | null;
}

export interface CodeReference {
  signature: string;
  label: string;
  code: Code;
}

// ─── Zod Schemas ──────────────────────────────────────────────────

const QuantitySpecSchema = z.object({
  value: zodDecimal(),
  unit: CodeSchema,
});

const MinimumVolumeSpecSchema = z.object({
  quantity: QuantitySpecSchema.optional().nullable(),
  string: z.string().optional(),
});

const TypeTestedSchema = z.object({
  is_derived: z.boolean(),
  preference: z.nativeEnum(Preference),
  container: z
    .object({
      description: z.string().optional(),
      capacity: QuantitySpecSchema.nullable().optional(),
      minimum_volume: MinimumVolumeSpecSchema.optional(),
      cap: CodeSchema.optional(),
      preparation: z.string().optional(),
    })
    .nullable()
    .optional(),
  requirement: z.string().optional(),
  retention_time: z
    .object({
      value: zodDecimal(),
      unit: CodeSchema,
    })
    .nullable()
    .optional(),
  single_use: z.boolean().nullable(),
});

export const SpecimenDefinitionRowSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug_value: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9_-]+$/,
      "Slug must contain only lowercase letters, digits, hyphens, and underscores",
    ),
  status: z.nativeEnum(SpecimenDefinitionStatus).optional(),
  description: z.string().min(1, "Description is required"),
  derived_from_uri: z.string().url("Must be a valid URL").optional(),
  type_collected: CodeSchema,
  patient_preparation: z.array(CodeSchema).min(0),
  collection: CodeSchema.optional(),
  type_tested: TypeTestedSchema.optional(),
});

// ─── Row Type ─────────────────────────────────────────────────────

/** Row type for CSV-based imports (derived from zod schema). */
export type SpecimenDefinitionCsvRow = z.infer<
  typeof SpecimenDefinitionRowSchema
>;

/**
 * SpecimenDefinitionRow extends SpecimenRow with codeReferences so they
 * travel with the row through the ImportFlow lifecycle.
 * Used by the master data path; the CSV path uses SpecimenDefinitionCsvRow.
 */
export interface SpecimenDefinitionRow extends SpecimenRow {
  codeReferences: CodeReference[];
}

// ─── Master CSV Parser ────────────────────────────────────────────

const MASTER_REQUIRED_HEADERS = [
  "title",
  "description",
  "type_collected_system",
  "type_collected_code",
  "type_collected_display",
] as const;

const PREFERENCES = [Preference.preferred, Preference.alternate] as const;

function parseBooleanMaster(value?: string) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes"].includes(normalized)) return true;
  if (["false", "0", "no"].includes(normalized)) return false;
  return undefined;
}

function buildRequiredCode(
  system: string,
  code: string,
  display: string,
  errors: string[],
  label: string,
) {
  if (!system || !code || !display) {
    errors.push(`${label} requires system, code, and display`);
    return null;
  }
  return { system, code, display };
}

function buildOptionalCodeWithErrors(
  system: string,
  code: string,
  display: string,
  errors: string[],
  label: string,
) {
  if (!system && !code && !display) return null;
  if (!system || !code || !display) {
    errors.push(`${label} requires system, code, and display if provided`);
    return null;
  }
  return { system, code, display };
}

function buildOptionalQuantity(
  value: string,
  unitSystem: string,
  unitCode: string,
  unitDisplay: string,
  errors: string[],
  label: string,
) {
  if (!value && !unitSystem && !unitCode && !unitDisplay) return null;
  if (!value || !unitSystem || !unitCode || !unitDisplay) {
    errors.push(`${label} requires value and unit (system, code, display)`);
    return null;
  }
  return {
    value,
    unit: { system: unitSystem, code: unitCode, display: unitDisplay },
  };
}

const buildCodeSignature = (code: CodeReference["code"]) =>
  `${code.system}||${code.code}`;

interface SpecimenProcessedRow {
  rowIndex: number;
  data: SpecimenRow;
  errors: string[];
  codeReferences: CodeReference[];
}

export const parseSpecimenDefinitionCsv = (
  csvText: string,
): SpecimenProcessedRow[] => {
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

  const missingHeaders = MASTER_REQUIRED_HEADERS.filter(
    (header) => headerMap[normalizeHeader(header)] === undefined,
  );

  if (missingHeaders.length > 0) {
    throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
  }

  const slugSeen = new Map<string, number>();

  return rows.map((row, index) => {
    const errors: string[] = [];
    const codeReferences: CodeReference[] = [];

    const title = getCellValue(row, headerMap, "title").trim();
    const description = getCellValue(row, headerMap, "description").trim();
    const slugValue = getCellValue(row, headerMap, "slug_value").trim();
    const derivedFromUri = getCellValue(
      row,
      headerMap,
      "derived_from_uri",
    ).trim();

    const typeCollected = buildRequiredCode(
      getCellValue(row, headerMap, "type_collected_system").trim(),
      getCellValue(row, headerMap, "type_collected_code").trim(),
      getCellValue(row, headerMap, "type_collected_display").trim(),
      errors,
      "Type collected",
    );

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

    if (derivedFromUri) {
      try {
        new URL(derivedFromUri);
      } catch {
        errors.push("derived_from_uri must be a valid URL");
      }
    }

    const collectionCode = buildOptionalCodeWithErrors(
      getCellValue(row, headerMap, "collection_system").trim(),
      getCellValue(row, headerMap, "collection_code").trim(),
      getCellValue(row, headerMap, "collection_display").trim(),
      errors,
      "Collection",
    );

    const isDerivedRaw = getCellValue(row, headerMap, "is_derived").trim();
    const isDerived = parseBooleanMaster(isDerivedRaw);
    if (isDerivedRaw && isDerived === undefined) {
      errors.push("is_derived must be a boolean value");
    }

    const preferenceRaw = getCellValue(row, headerMap, "preference").trim();
    const preference = preferenceRaw as Preference;
    if (preferenceRaw && !PREFERENCES.includes(preference as never)) {
      errors.push("Invalid preference value");
    }

    const singleUseRaw = getCellValue(row, headerMap, "single_use").trim();
    const singleUse = parseBooleanMaster(singleUseRaw);
    if (singleUseRaw && singleUse === undefined) {
      errors.push("single_use must be a boolean value");
    }

    const requirement = getCellValue(row, headerMap, "requirement").trim();

    const retentionTime = buildOptionalQuantity(
      getCellValue(row, headerMap, "retention_value").trim(),
      getCellValue(row, headerMap, "retention_unit_system").trim(),
      getCellValue(row, headerMap, "retention_unit_code").trim(),
      getCellValue(row, headerMap, "retention_unit_display").trim(),
      errors,
      "Retention time",
    ) as DurationSpec | null;

    const containerDescription = getCellValue(
      row,
      headerMap,
      "container_description",
    ).trim();

    const containerCapacity = buildOptionalQuantity(
      getCellValue(row, headerMap, "container_capacity_value").trim(),
      getCellValue(row, headerMap, "container_capacity_unit_system").trim(),
      getCellValue(row, headerMap, "container_capacity_unit_code").trim(),
      getCellValue(row, headerMap, "container_capacity_unit_display").trim(),
      errors,
      "Container capacity",
    ) as QuantitySpec | null;

    const minimumVolumeQuantity = buildOptionalQuantity(
      getCellValue(
        row,
        headerMap,
        "container_minimum_volume_quantity_value",
      ).trim(),
      getCellValue(
        row,
        headerMap,
        "container_minimum_volume_quantity_unit_system",
      ).trim(),
      getCellValue(
        row,
        headerMap,
        "container_minimum_volume_quantity_unit_code",
      ).trim(),
      getCellValue(
        row,
        headerMap,
        "container_minimum_volume_quantity_unit_display",
      ).trim(),
      errors,
      "Minimum volume quantity",
    ) as QuantitySpec | null;

    const minimumVolumeString = getCellValue(
      row,
      headerMap,
      "container_minimum_volume_string",
    ).trim();

    if (minimumVolumeQuantity && minimumVolumeString) {
      errors.push("Minimum volume cannot include both quantity and string");
    }

    const containerCap = buildOptionalCodeWithErrors(
      getCellValue(row, headerMap, "container_cap_system").trim(),
      getCellValue(row, headerMap, "container_cap_code").trim(),
      getCellValue(row, headerMap, "container_cap_display").trim(),
      errors,
      "Container cap",
    );

    const containerPreparation = getCellValue(
      row,
      headerMap,
      "container_preparation",
    ).trim();

    const containerPayload: ContainerSpec | null =
      containerDescription ||
      containerCapacity ||
      minimumVolumeQuantity ||
      minimumVolumeString ||
      containerCap ||
      containerPreparation
        ? {
            description: containerDescription || undefined,
            capacity: containerCapacity || undefined,
            minimum_volume:
              minimumVolumeQuantity || minimumVolumeString
                ? {
                    quantity: minimumVolumeQuantity || undefined,
                    string: minimumVolumeString || undefined,
                  }
                : undefined,
            cap: containerCap || undefined,
            preparation: containerPreparation || undefined,
          }
        : null;

    if (typeCollected) {
      codeReferences.push({
        signature: buildCodeSignature(typeCollected),
        label: "Type collected",
        code: typeCollected,
      });
    }

    if (collectionCode) {
      codeReferences.push({
        signature: buildCodeSignature(collectionCode),
        label: "Collection",
        code: collectionCode,
      });
    }

    if (retentionTime?.unit) {
      codeReferences.push({
        signature: buildCodeSignature(retentionTime.unit),
        label: "Retention unit",
        code: retentionTime.unit,
      });
    }

    if (containerCapacity?.unit) {
      codeReferences.push({
        signature: buildCodeSignature(containerCapacity.unit),
        label: "Container capacity unit",
        code: containerCapacity.unit,
      });
    }

    if (minimumVolumeQuantity?.unit) {
      codeReferences.push({
        signature: buildCodeSignature(minimumVolumeQuantity.unit),
        label: "Minimum volume unit",
        code: minimumVolumeQuantity.unit,
      });
    }

    if (containerCap) {
      codeReferences.push({
        signature: buildCodeSignature(containerCap),
        label: "Container cap",
        code: containerCap,
      });
    }

    const data: SpecimenRow = {
      title,
      slug_value: slugValue,
      status: SpecimenDefinitionStatus.active,
      description,
      derived_from_uri: derivedFromUri || undefined,
      type_collected: typeCollected || {
        system: "",
        code: "",
        display: "",
      },
      patient_preparation: [],
      collection: collectionCode,
      is_derived: isDerived,
      preference: preferenceRaw ? preference : undefined,
      single_use: singleUse,
      requirement: requirement || undefined,
      retention_time: retentionTime || undefined,
      container: containerPayload || undefined,
    };

    return {
      rowIndex: index + 2,
      data,
      errors,
      codeReferences,
    };
  });
};

// ─── CSV → ProcessedRows ───────────────────────────────────────────
export function parseMasterCsvToRows(
  csvText: string,
): ProcessedRow<SpecimenDefinitionRow>[] {
  let specimenRows;
  try {
    specimenRows = parseSpecimenDefinitionCsv(csvText);
  } catch (err) {
    return [
      {
        rowIndex: 1,
        raw: [],
        data: {} as SpecimenDefinitionRow,
        errors: [err instanceof Error ? err.message : "Failed to parse CSV"],
      },
    ];
  }

  return specimenRows.map((r) => ({
    rowIndex: r.rowIndex,
    raw: [],
    data: { ...r.data, codeReferences: r.codeReferences },
    errors: [...r.errors],
  }));
}

// ─── Code Lookup Validation ───────────────────────────────────────

/**
 * Async cross-row validation for master data rows: duplicate slugs + code lookups
 * using the codeReferences attached during parsing.
 */
export async function validateSpecimenDefinitionMasterRows(
  rows: SpecimenDefinitionRow[],
): Promise<{ identifier: string; reason: string }[]> {
  const errors: { identifier: string; reason: string }[] = [];

  // Duplicate slug check
  const slugSeen = new Map<string, number>();
  for (let i = 0; i < rows.length; i++) {
    const slug = (rows[i].slug_value ?? "").trim().toLowerCase();
    const prevIdx = slugSeen.get(slug);
    if (prevIdx !== undefined) {
      errors.push({
        identifier: slug,
        reason: `Duplicate slug_value (first seen in row ${prevIdx + 2})`,
      });
    } else {
      slugSeen.set(slug, i);
    }
  }

  // Collect unique code references across all rows
  const uniqueRefs = new Map<string, CodeReference>();
  for (const row of rows) {
    for (const ref of row.codeReferences ?? []) {
      if (!uniqueRefs.has(ref.signature)) {
        uniqueRefs.set(ref.signature, ref);
      }
    }
  }

  if (uniqueRefs.size > 0) {
    const invalidSignatures = new Set<string>();
    await Promise.all(
      Array.from(uniqueRefs.values()).map(async (ref) => {
        try {
          await request(valueSetApi.lookup, {
            body: { system: ref.code.system, code: ref.code.code },
          });
        } catch {
          invalidSignatures.add(ref.signature);
        }
      }),
    );

    if (invalidSignatures.size > 0) {
      for (const row of rows) {
        const slug = (row.slug_value ?? "").trim().toLowerCase();
        for (const ref of row.codeReferences ?? []) {
          if (invalidSignatures.has(ref.signature)) {
            errors.push({
              identifier: slug,
              reason: `Invalid code: ${ref.label} (${ref.code.system} | ${ref.code.code})`,
            });
          }
        }
      }
    }
  }

  return errors;
}

// ─── Payload Builder ──────────────────────────────────────────────
function cleanContainerData(
  container?: ContainerSpec | null,
): ContainerSpec | undefined {
  if (!container) return undefined;
  const hasContent =
    container.description ||
    container.preparation ||
    container.capacity ||
    container.cap ||
    container.minimum_volume?.quantity ||
    container.minimum_volume?.string;

  if (!hasContent) return undefined;

  const cleaned = { ...container };
  if (
    container.minimum_volume &&
    !container.minimum_volume.quantity &&
    !container.minimum_volume.string
  ) {
    delete cleaned.minimum_volume;
  }

  return cleaned;
}

export function toSpecimenDefinitionDatapoint(
  row: SpecimenDefinitionRow,
  existingSlug?: string,
): SpecimenDefinitionCreate & { id?: string } {
  const slug = row.slug_value!;

  const hasTypeTested =
    row.is_derived !== undefined ||
    row.preference !== undefined ||
    row.single_use !== undefined ||
    row.requirement ||
    row.retention_time ||
    row.container;

  const typeTested: TypeTestedSpec | undefined = hasTypeTested
    ? {
        is_derived: row.is_derived ?? false,
        preference: row.preference ?? Preference.preferred,
        single_use: row.single_use ?? false,
        requirement: row.requirement || undefined,
        retention_time: row.retention_time || undefined,
        container: cleanContainerData(row.container),
      }
    : undefined;

  const payload: SpecimenDefinitionCreate & { id?: string } = {
    slug_value: slug,
    title: row.title,
    status: row.status ?? SpecimenDefinitionStatus.active,
    description: row.description,
    derived_from_uri: row.derived_from_uri || undefined,
    type_collected: row.type_collected,
    patient_preparation: [],
    collection: row.collection || undefined,
    type_tested: typeTested,
  };

  if (existingSlug) {
    payload.id = existingSlug;
  }

  return payload;
}

/** Build an API payload from a zod-validated CSV row. */
export function toSpecimenDefinitionCsvPayload(
  row: SpecimenDefinitionCsvRow,
  existingSlug?: string,
): SpecimenDefinitionCreate & { id?: string } {
  const payload: SpecimenDefinitionCreate & { id?: string } = {
    slug_value: row.slug_value,
    title: row.title,
    status: row.status ?? SpecimenDefinitionStatus.active,
    description: row.description,
    derived_from_uri: row.derived_from_uri || undefined,
    type_collected: row.type_collected,
    patient_preparation: row.patient_preparation ?? [],
    collection: row.collection || undefined,
    type_tested: row.type_tested
      ? {
          is_derived: row.type_tested.is_derived,
          preference: row.type_tested.preference,
          single_use: row.type_tested.single_use ?? false,
          requirement: row.type_tested.requirement || undefined,
          retention_time: row.type_tested.retention_time || undefined,
          container: cleanContainerData(row.type_tested.container),
        }
      : undefined,
  };

  if (existingSlug) {
    payload.id = existingSlug;
  }

  return payload;
}

// ─── Review Columns ────────────────────────────────────────────────
export const SD_REVIEW_COLUMNS: ReviewColumn<SpecimenDefinitionRow>[] = [
  { header: "Title", accessor: "title", width: "w-48" },
  { header: "Slug", accessor: "slug_value", width: "w-40" },
  {
    header: "Type Collected",
    accessor: (row) => row.type_collected?.display ?? "",
    width: "w-40",
  },
  { header: "Status", accessor: "status", width: "w-24" },
];

export const SD_CSV_REVIEW_COLUMNS: ReviewColumn<SpecimenDefinitionCsvRow>[] = [
  { header: "Title", accessor: "title", width: "w-48" },
  { header: "Slug", accessor: "slug_value", width: "w-40" },
  {
    header: "Type Collected",
    accessor: (row) => row.type_collected?.display ?? "",
    width: "w-40",
  },
  {
    header: "Status",
    accessor: (row) => row.status ?? SpecimenDefinitionStatus.active,
    width: "w-24",
  },
];

// ─── CSV Headers ──────────────────────────────────────────────────

export const SD_REQUIRED_HEADERS = [
  "title",
  "slug_value",
  "description",
  "type_collected_system",
  "type_collected_code",
  "type_collected_display",
] as const;

export const SD_OPTIONAL_HEADERS = [
  "derived_from_uri",
  "collection_system",
  "collection_code",
  "collection_display",
  "is_derived",
  "preference",
  "single_use",
  "requirement",
  "retention_value",
  "retention_unit_system",
  "retention_unit_code",
  "retention_unit_display",
  "container_description",
  "container_capacity_value",
  "container_capacity_unit_system",
  "container_capacity_unit_code",
  "container_capacity_unit_display",
  "container_minimum_volume_quantity_value",
  "container_minimum_volume_quantity_unit_system",
  "container_minimum_volume_quantity_unit_code",
  "container_minimum_volume_quantity_unit_display",
  "container_minimum_volume_string",
  "container_cap_system",
  "container_cap_code",
  "container_cap_display",
  "container_preparation",
] as const;

export const SD_HEADER_MAP: Record<string, string> = buildHeaderMapping([
  ...SD_REQUIRED_HEADERS,
  ...SD_OPTIONAL_HEADERS,
]);

// ─── CSV Row Parser ───────────────────────────────────────────────

function parseBoolean(value: string): boolean | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase();
  if (["true", "1", "yes"].includes(normalized)) return true;
  if (["false", "0", "no"].includes(normalized)) return false;
  return undefined;
}

function buildCode(
  system: string,
  code: string,
  display: string,
): { system: string; code: string; display: string } | undefined {
  if (!system && !code && !display) return undefined;
  return { system, code, display };
}

function buildQuantity(
  value: string,
  system: string,
  code: string,
  display: string,
):
  | { value: string; unit: { system: string; code: string; display: string } }
  | undefined {
  if (!value && !system && !code && !display) return undefined;
  return { value, unit: { system, code, display } };
}

/**
 * Transform a flat CSV row array into a structured object for zod validation.
 * Assembles nested Code/Quantity/Container objects from flat columns.
 */
export function parseSpecimenDefinitionRow(
  row: string[],
  headerIndices: Record<string, number>,
): Record<string, unknown> {
  const get = (key: string) => row[headerIndices[key]]?.trim() ?? "";

  const typeCollected = buildCode(
    get("type_collected_system"),
    get("type_collected_code"),
    get("type_collected_display"),
  );

  const collection = buildCode(
    get("collection_system"),
    get("collection_code"),
    get("collection_display"),
  );

  const retentionTime = buildQuantity(
    get("retention_value"),
    get("retention_unit_system"),
    get("retention_unit_code"),
    get("retention_unit_display"),
  );

  const containerCapacity = buildQuantity(
    get("container_capacity_value"),
    get("container_capacity_unit_system"),
    get("container_capacity_unit_code"),
    get("container_capacity_unit_display"),
  );

  const minimumVolumeQuantity = buildQuantity(
    get("container_minimum_volume_quantity_value"),
    get("container_minimum_volume_quantity_unit_system"),
    get("container_minimum_volume_quantity_unit_code"),
    get("container_minimum_volume_quantity_unit_display"),
  );

  const minimumVolumeString =
    get("container_minimum_volume_string") || undefined;

  const containerCap = buildCode(
    get("container_cap_system"),
    get("container_cap_code"),
    get("container_cap_display"),
  );

  const containerDescription = get("container_description") || undefined;
  const containerPreparation = get("container_preparation") || undefined;

  const hasContainer =
    containerDescription ||
    containerCapacity ||
    minimumVolumeQuantity ||
    minimumVolumeString ||
    containerCap ||
    containerPreparation;

  const isDerived = parseBoolean(get("is_derived"));
  const singleUse = parseBoolean(get("single_use"));
  const preferenceRaw = get("preference");

  const hasTypeTested =
    isDerived !== undefined ||
    preferenceRaw ||
    singleUse !== undefined ||
    get("requirement") ||
    retentionTime ||
    hasContainer;

  const typeTested = hasTypeTested
    ? {
        is_derived: isDerived ?? false,
        preference: preferenceRaw || Preference.preferred,
        single_use: singleUse ?? null,
        requirement: get("requirement") || undefined,
        retention_time: retentionTime || undefined,
        container: hasContainer
          ? {
              description: containerDescription,
              capacity: containerCapacity || undefined,
              minimum_volume:
                minimumVolumeQuantity || minimumVolumeString
                  ? {
                      quantity: minimumVolumeQuantity || undefined,
                      string: minimumVolumeString,
                    }
                  : undefined,
              cap: containerCap,
              preparation: containerPreparation,
            }
          : undefined,
      }
    : undefined;

  const derivedFromUri = get("derived_from_uri") || undefined;

  return {
    title: get("title"),
    slug_value: get("slug_value"),
    description: get("description"),
    derived_from_uri: derivedFromUri,
    type_collected: typeCollected,
    patient_preparation: [],
    collection,
    type_tested: typeTested,
  };
}

// ─── Cross-Row Validation ─────────────────────────────────────────

function validateSpecimenDefinitionRowsSync(
  rows: SpecimenDefinitionCsvRow[],
): { identifier: string; reason: string }[] {
  return validateNoDuplicateSlugs(rows, (row) =>
    row.slug_value.trim().toLowerCase(),
  );
}

/**
 * Collect all codes from a row as [signature, label] pairs.
 */
function getRowCodes(
  row: SpecimenDefinitionCsvRow,
): { sig: string; label: string }[] {
  const codes: { sig: string; label: string }[] = [];

  const add = (
    code: { system: string; code: string } | undefined | null,
    label: string,
  ) => {
    if (code?.system && code?.code) {
      codes.push({ sig: `${code.system}|${code.code}`, label });
    }
  };

  add(row.type_collected, "Type Collected");
  add(row.collection, "Collection");
  if (row.type_tested) {
    add(row.type_tested.container?.cap, "Container Cap");
    add(row.type_tested.retention_time?.unit, "Retention Time Unit");
    add(row.type_tested.container?.capacity?.unit, "Container Capacity Unit");
    add(
      row.type_tested.container?.minimum_volume?.quantity?.unit,
      "Minimum Volume Unit",
    );
  }

  return codes;
}

/**
 * Async cross-row validation: duplicate slugs + code lookups.
 */
export async function validateSpecimenDefinitionRows(
  rows: SpecimenDefinitionCsvRow[],
): Promise<{ identifier: string; reason: string }[]> {
  const errors = validateSpecimenDefinitionRowsSync(rows);

  // Collect unique codes across all rows
  const uniqueCodes = new Map<string, { system: string; code: string }>();
  for (const row of rows) {
    for (const { sig } of getRowCodes(row)) {
      if (!uniqueCodes.has(sig)) {
        const [system, code] = sig.split("|");
        uniqueCodes.set(sig, { system, code });
      }
    }
  }

  if (uniqueCodes.size === 0) return errors;

  // Validate all codes in parallel
  const invalidCodes = new Set<string>();
  await Promise.all(
    Array.from(uniqueCodes.entries()).map(async ([sig, body]) => {
      try {
        await request(valueSetApi.lookup, { body });
      } catch {
        invalidCodes.add(sig);
      }
    }),
  );

  if (invalidCodes.size === 0) return errors;

  // Map failures back to rows
  for (const row of rows) {
    const slug = row.slug_value.trim().toLowerCase();
    for (const { sig, label } of getRowCodes(row)) {
      if (invalidCodes.has(sig)) {
        errors.push({
          identifier: slug,
          reason: `Invalid code: ${label} (${sig.replace("|", " | ")})`,
        });
      }
    }
  }

  return errors;
}

// ─── Sample CSV ───────────────────────────────────────────────────

export const SD_SAMPLE_CSV = {
  headers: [
    ...SD_REQUIRED_HEADERS,
    ...SD_OPTIONAL_HEADERS,
  ] as unknown as string[],
  rows: [
    [
      "Blood",
      "blood",
      "Blood specimen",
      "http://terminology.hl7.org/CodeSystem/v2-0487",
      "ACNFLD",
      "Fluid, Acne",
      "",
      "http://snomed.info/sct",
      "278450005",
      "Finger stick",
      "true",
      "preferred",
      "true",
      "Requirement",
      "1.00",
      "http://unitsofmeasure.org",
      "h",
      "hours",
      "Container Description",
      "5.00",
      "http://unitsofmeasure.org",
      "mL",
      "milliliter",
      "5.00",
      "http://unitsofmeasure.org",
      "mL",
      "milliliter",
      "",
      "http://terminology.hl7.org/CodeSystem/container-cap",
      "black",
      "black cap",
      "Container Prep",
    ],
  ],
};
