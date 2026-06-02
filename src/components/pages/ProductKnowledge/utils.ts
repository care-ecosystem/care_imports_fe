import {
  buildHeaderMapping,
  SlugSchema,
  validateNoDuplicateSlugs,
} from "@/internalTypes/common";
import { ReviewColumn } from "@/internalTypes/importConfig";
import {
  ProductKnowledgeCreate,
  ProductKnowledgeStatus,
  ProductKnowledgeType,
  ProductNameTypes,
} from "@/types/inventory/productKnowledge/productKnowledge";
import { splitCsvList } from "@/Utils/csv";
import { z } from "zod";

// ─── Code Systems ──────────────────────────────────────────────────
export const SNOMED_SYSTEM = "http://snomed.info/sct";
export const UCUM_SYSTEM = "http://unitsofmeasure.org";

// ─── Dosage Units Lookup ───────────────────────────────────────────
export const DOSAGE_UNITS_CODES = [
  { system: UCUM_SYSTEM, code: "{tbl}", display: "tablets" },
  { system: UCUM_SYSTEM, code: "{Capsule}", display: "capsules" },
  { system: UCUM_SYSTEM, code: "mL", display: "milliliter" },
  { system: UCUM_SYSTEM, code: "mg", display: "milligram" },
  { system: UCUM_SYSTEM, code: "g", display: "gram" },
  { system: UCUM_SYSTEM, code: "ug", display: "microgram" },
  { system: UCUM_SYSTEM, code: "L", display: "liter" },
  { system: UCUM_SYSTEM, code: "[iU]", display: "international unit" },
  { system: UCUM_SYSTEM, code: "{count}", display: "count" },
  { system: UCUM_SYSTEM, code: "[drp]", display: "drop" },
  { system: UCUM_SYSTEM, code: "mg/mL", display: "milligram per milliliter" },
] as const;

// ─── Required & Optional Headers ───────────────────────────────────
export const PK_REQUIRED_HEADERS = [
  "resourceCategory",
  "slug",
  "name",
  "productType",
  "baseUnitDisplay",
] as const;

export const PK_OPTIONAL_HEADERS = [
  "codeDisplay",
  "codeValue",
  "dosageFormDisplay",
  "dosageFormCode",
  "routeCode",
  "routeDisplay",
  "alternateIdentifier",
  "alternateNameType",
  "alternateNameValue",
] as const;

export const PK_ALL_HEADERS = [
  ...PK_REQUIRED_HEADERS,
  ...PK_OPTIONAL_HEADERS,
] as const;

// ─── Header Mapping (normalized → canonical) ───────────────────────
export const PK_HEADER_MAP: Record<string, string> =
  buildHeaderMapping(PK_ALL_HEADERS);

// ─── Zod Schema ────────────────────────────────────────────────────
export const ProductKnowledgeRowSchema = (facilityId?: string) =>
  z
    .object({
      // Required fields
      resourceCategory: z.string().optional(), // Used when category is provided in csv
      categorySlug: z.string().optional(), // Used when category is provided by picker
      slug: SlugSchema,
      name: z.string().min(1, "Name is required"),
      productType: z.nativeEnum(ProductKnowledgeType),
      baseUnitDisplay: z
        .string()
        .min(1, "Base unit is required")
        .refine(
          (display) =>
            DOSAGE_UNITS_CODES.some(
              (u) => u.display.toLowerCase() === display.toLowerCase(),
            ),
          (display) => ({
            message: `Could not resolve base unit for '${display}'. Valid units: ${DOSAGE_UNITS_CODES.map((u) => u.display).join(", ")}`,
          }),
        ),

      // Optional fields
      codeDisplay: z.string().optional(),
      codeValue: z.string().optional(),
      dosageFormDisplay: z.string().optional(),
      dosageFormCode: z.string().optional(),
      routeCode: z.string().optional(),
      routeDisplay: z.string().optional(),
      alternateIdentifier: z.string().optional(),
      alternateNameType: z.nativeEnum(ProductNameTypes).optional(),
      alternateNameValue: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (facilityId && !data.resourceCategory && !data.categorySlug) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Either resourceCategory (in csv) or categorySlug (from picker) must be provided",
        });
      }
    });

/** Schema variant where resourceCategory is optional (when picker provides it). */
export const getProductKnowledgeRowSchema = (facilityId?: string) => {
  return ProductKnowledgeRowSchema(facilityId);
};

export type ProductKnowledgeRow = z.infer<
  ReturnType<typeof ProductKnowledgeRowSchema>
>;

// ─── Helpers ───────────────────────────────────────────────────────

function resolveBaseUnit(display: string) {
  const unit = DOSAGE_UNITS_CODES.find(
    (u) => u.display.toLowerCase() === display.toLowerCase(),
  );
  if (!unit) {
    throw new Error(`Could not resolve base unit for '${display}'`);
  }
  return { system: unit.system, code: unit.code, display: unit.display };
}

// ─── API Payload Transformer ───────────────────────────────────────
export function toProductKnowledgeCreatePayload(
  row: ProductKnowledgeRow,
  facilityId?: string,
  categorySlug?: string,
): ProductKnowledgeCreate {
  const baseUnit = resolveBaseUnit(row.baseUnitDisplay);

  const payload: ProductKnowledgeCreate = {
    slug_value: row.slug,
    name: row.name.trim(),
    ...(facilityId ? { facility: facilityId } : {}),
    product_type: row.productType as ProductKnowledgeType,
    status: ProductKnowledgeStatus.active,
    base_unit: baseUnit,
    ...(categorySlug ? { category: categorySlug } : {}),
    names: [],
    storage_guidelines: [],
    is_instance_level: false,
  };

  // Code (SNOMED)
  const codeValue = row.codeValue?.trim();
  const codeDisplay = row.codeDisplay?.trim();
  if (codeValue) {
    payload.code = {
      system: SNOMED_SYSTEM,
      code: codeValue,
      display: codeDisplay || codeValue,
    };
  }

  // Dosage form & routes (definitional)
  const dosageFormCode = row.dosageFormCode?.trim();
  const dosageFormDisplay = row.dosageFormDisplay?.trim();
  const routeCodes = splitCsvList(row.routeCode || "");
  const routeDisplays = splitCsvList(row.routeDisplay || "");

  if (dosageFormCode) {
    const intendedRoutes = routeCodes.map((code, index) => ({
      system: SNOMED_SYSTEM,
      code,
      display: routeDisplays[index] || routeDisplays[0] || code,
    }));

    payload.definitional = {
      dosage_form: {
        system: SNOMED_SYSTEM,
        code: dosageFormCode,
        display: dosageFormDisplay || dosageFormCode,
      },
      intended_routes: intendedRoutes,
      ingredients: [],
      nutrients: [],
      drug_characteristic: [],
    };
  }

  // Alternate identifier
  if (row.alternateIdentifier?.trim()) {
    payload.alternate_identifier = row.alternateIdentifier.trim();
  }

  // Alternate name
  const alternateNameValue = row.alternateNameValue?.trim();
  if (row.alternateNameType && alternateNameValue) {
    payload.names = [
      { name_type: row.alternateNameType, name: alternateNameValue },
    ];
  }

  return payload;
}

// ─── Validation Helpers ────────────────────────────────────────────

/**
 * Validates that the base unit can be resolved.
 * Call this during row validation to provide early feedback.
 */
export function validateBaseUnit(display: string): string | null {
  const unit = DOSAGE_UNITS_CODES.find(
    (u) => u.display.toLowerCase() === display.toLowerCase(),
  );
  if (!unit) {
    return `Could not resolve base unit for '${display}'. Valid units: ${DOSAGE_UNITS_CODES.map((u) => u.display).join(", ")}`;
  }
  return null;
}

/**
 * Cross-row validation: detect duplicate slugs.
 */
export function validateProductKnowledgeRows(
  rows: ProductKnowledgeRow[],
): { identifier: string; reason: string }[] {
  return validateNoDuplicateSlugs(rows, (row) => row.slug);
}

// ─── Row Parser ────────────────────────────────────────────────────
export function parseProductKnowledgeRow(
  row: string[],
  headerIndices: Record<string, number>,
  categorySlug?: string,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const header of PK_ALL_HEADERS) {
    const idx = headerIndices[header];
    const value = idx !== undefined ? (row[idx]?.trim() ?? "") : "";
    result[header] =
      value === "" &&
      !(PK_REQUIRED_HEADERS as readonly string[]).includes(header)
        ? undefined
        : value;
  }
  if (categorySlug) {
    delete result.resourceCategory; // Remove resourceCategory if categorySlug is provided
    result.categorySlug = categorySlug;
  }
  return result;
}

export const getReviewColumns = (
  categoryTitle?: string,
): ReviewColumn<ProductKnowledgeRow>[] => [
  { header: "Name", accessor: "name", width: "w-48" },
  { header: "Type", accessor: "productType" },
  {
    header: "Category",
    accessor: categoryTitle ? () => categoryTitle : "resourceCategory",
  },
  { header: "Slug", accessor: "slug" },
];

// ─── Sample CSV ─────────────────────────────────────────────────────
export const PK_SAMPLE_CSV = {
  headers: [
    "resourceCategory",
    "slug",
    "name",
    "productType",
    "codeDisplay",
    "codeValue",
    "baseUnitDisplay",
    "dosageFormDisplay",
    "dosageFormCode",
    "routeCode",
    "routeDisplay",
    "alternateIdentifier",
    "alternateNameType",
    "alternateNameValue",
  ],
  rows: [
    [
      "Medication",
      "isoflurane-inhaler",
      "Isoflurane inhaler",
      "medication",
      "Product containing precisely isoflurane",
      "784978007",
      "milligram per milliliter",
      "solution for inhalation",
      "420641004",
      "447694001",
      "Respiratory tract route",
      "",
      "",
      "",
    ],
  ],
};
