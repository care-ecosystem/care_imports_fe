import { request } from "@/apis/request";
import {
  ProductKnowledgeBase,
  ProductKnowledgeType,
  ProductNameTypes,
} from "@/types/inventory/productKnowledge/productKnowledge";
import { parseCsvText } from "@/utils/csv";
import { createSlug } from "@/utils/slug";

const HEADER_MAP = {
  resourceCategory: 0,
  slug: 1,
  name: 2,
  productType: 3,
  codeDisplay: 4,
  codeValue: 5,
  baseUnitDisplay: 6,
  dosageFormDisplay: 7,
  dosageFormCode: 8,
  routeCode: 9,
  routeDisplay: 10,
  alternateIdentifier: 11,
  alternateNameType: 12,
  alternateNameValue: 13,
};

const REQUIRED_HEADERS = [
  "resourceCategory",
  "name",
  "productType",
  "baseUnitDisplay",
] as const;

const SNOMED_SYSTEM = "http://snomed.info/sct";

const DOSAGE_UNITS_CODES = [
  { system: "http://unitsofmeasure.org", code: "{tbl}", display: "tablets" },
  {
    system: "http://unitsofmeasure.org",
    code: "{Capsule}",
    display: "capsules",
  },
  { system: "http://unitsofmeasure.org", code: "mL", display: "milliliter" },
  { system: "http://unitsofmeasure.org", code: "mg", display: "milligram" },
  { system: "http://unitsofmeasure.org", code: "g", display: "gram" },
  { system: "http://unitsofmeasure.org", code: "ug", display: "microgram" },
  { system: "http://unitsofmeasure.org", code: "L", display: "liter" },
  {
    system: "http://unitsofmeasure.org",
    code: "[iU]",
    display: "international unit",
  },
  { system: "http://unitsofmeasure.org", code: "{count}", display: "count" },
  { system: "http://unitsofmeasure.org", code: "[drp]", display: "drop" },
  {
    system: "http://unitsofmeasure.org",
    code: "mg/mL",
    display: "milligram per milliliter",
  },
] as const;

const parseCsvList = (value?: string) =>
  value
    ? value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
    : [];

export const normalizeProductKnowledgeName = (value: string) =>
  value.trim().toLowerCase();

export type ProductKnowledgeCsvRow = Record<keyof typeof HEADER_MAP, string>;

export type ProductKnowledgeValidated = ReturnType<
  typeof validateProductKnowledgeDatapoint
>;

export type ProductKnowledgeProcessedRow = {
  rowIndex: number;
  raw: ProductKnowledgeCsvRow;
  errors: string[];
  normalized: ProductKnowledgeValidated | null;
};

export const parseProductKnowledgeCsv = (
  csvText: string,
): ProductKnowledgeProcessedRow[] => {
  const { rows } = parseCsvText(csvText);

  return rows.map((row, index) => {
    const datapoint = (
      Object.keys(HEADER_MAP) as Array<keyof typeof HEADER_MAP>
    ).reduce((acc, key) => {
      const idx = HEADER_MAP[key];
      acc[key] = row[idx] ?? "";
      return acc;
    }, {} as ProductKnowledgeCsvRow);

    try {
      const normalized = validateProductKnowledgeDatapoint(datapoint);
      return {
        rowIndex: index + 2,
        raw: datapoint,
        errors: [],
        normalized,
      };
    } catch (error) {
      return {
        rowIndex: index + 2,
        raw: datapoint,
        errors: [error instanceof Error ? error.message : "Validation failed"],
        normalized: null,
      };
    }
  });
};

export function validateProductKnowledgeDatapoint(
  datapoint: ProductKnowledgeCsvRow,
) {
  if (REQUIRED_HEADERS.some((key) => !datapoint[key].trim())) {
    throw new Error("Missing required fields");
  }

  const baseUnit = DOSAGE_UNITS_CODES.find(
    (unit) => unit.display === datapoint.baseUnitDisplay.toLowerCase(),
  );
  if (!baseUnit) {
    throw new Error(
      `Could not resolve base unit for '${datapoint.baseUnitDisplay}'`,
    );
  }

  const slugPromise = datapoint.slug
    ? Promise.resolve(datapoint.slug)
    : createProductKnowledgeSlug(datapoint.name);

  const productType = [
    ProductKnowledgeType.consumable,
    ProductKnowledgeType.medication,
    ProductKnowledgeType.nutritional_product,
  ].find((type) => type === datapoint.productType.toLowerCase());

  if (!productType) {
    throw new Error(`Product type '${datapoint.productType}' is not valid`);
  }

  let alternateNameType: ProductNameTypes | undefined;

  if (datapoint?.alternateNameType) {
    alternateNameType = [
      ProductNameTypes.trade_name,
      ProductNameTypes.alias,
      ProductNameTypes.original_name,
      ProductNameTypes.preferred,
    ].find(
      (type) =>
        type ===
        datapoint?.alternateNameType.toLowerCase().replace(/\s+/g, "_"),
    );

    if (!alternateNameType) {
      throw new Error(
        `Alternate name type '${datapoint.alternateNameType}' is not valid`,
      );
    }
  }

  const dosageFormCode = datapoint.dosageFormCode?.trim();
  const dosageFormDisplay = datapoint.dosageFormDisplay?.trim();

  const routeCodes = parseCsvList(datapoint.routeCode);
  const routeDisplays = parseCsvList(datapoint.routeDisplay);

  const intendedRoutes = routeCodes.map((code, index) => ({
    system: SNOMED_SYSTEM,
    code,
    display: routeDisplays[index] || routeDisplays[0] || code,
  }));

  const dosageForm = dosageFormCode
    ? {
        system: SNOMED_SYSTEM,
        code: dosageFormCode,
        display: dosageFormDisplay || dosageFormCode,
      }
    : undefined;

  const codeValue = datapoint.codeValue?.trim();
  const codeDisplay = datapoint.codeDisplay?.trim();
  const code = codeValue
    ? {
        system: SNOMED_SYSTEM,
        code: codeValue,
        display: codeDisplay || codeValue,
      }
    : undefined;

  return {
    ...datapoint,
    baseUnit,
    slugPromise,
    productType,
    alternateNameType,
    dosageForm,
    intendedRoutes,
    code,
  };
}

export async function createProductKnowledgeSlug(name: string) {
  return await createSlug(name);
}

export async function resolveProductKnowledgeDatapoint(
  datapoint: ProductKnowledgeValidated,
) {
  const slug = await datapoint.slugPromise;
  return { ...datapoint, slug } as Omit<typeof datapoint, "slugPromise"> & {
    slug: string;
  };
}

export async function getExistingProductKnowledgeSlugs(facilityId: string) {
  const results: ProductKnowledgeBase[] = [];

  let hasNextPage = true;
  let page = 0;

  while (hasNextPage) {
    const response = (await request(
      `/api/v1/product_knowledge/?facility=${facilityId}&limit=100&offset=${page * 100}`,
      { method: "GET" },
    )) as { results: ProductKnowledgeBase[] };

    results.push(...response.results);

    if (response.results.length < 100) {
      hasNextPage = false;
    }

    page++;
  }

  return new Set(results.map((pk) => pk.slug_config.slug_value));
}
