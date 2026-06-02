import { buildHeaderMapping } from "@/internalTypes/common";
import { MonetaryComponentType } from "@/types/base/monetaryComponent/monetaryComponent";
import {
  ChargeItemDefinitionCreate,
  ChargeItemDefinitionStatus,
} from "@/types/billing/chargeItemDefinition/chargeItemDefinition";
import {
  ProductCreate,
  ProductStatusOptions,
} from "@/types/inventory/product/product";
import {
  ProductKnowledgeCreate,
  ProductKnowledgeStatus,
  ProductKnowledgeType,
} from "@/types/inventory/productKnowledge/productKnowledge";
import { format, parse } from "date-fns";
import { z } from "zod";

// ─── Item Types ────────────────────────────────────────────────────
export const PRODUCT_TYPES = ["medication", "consumable"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

// ─── Required Headers ──────────────────────────────────────────────
export const PRODUCT_REQUIRED_HEADERS = ["name", "type"] as const;

export const PRODUCT_OPTIONAL_HEADERS = [
  "basePrice",
  "inventoryQuantity",
  "dosageForm",
  "lot_number",
  "expiration_date",
  "standard_pack_size",
  "purchase_price",
  "product_knowledge_name",
  "charge_item_definition_name",
  "product_knowledge_slug",
  "charge_item_definition_slug",
] as const;

// ─── Header Mapping ────────────────────────────────────────────────
export const PRODUCT_HEADER_MAP: Record<string, string> = buildHeaderMapping([
  ...PRODUCT_REQUIRED_HEADERS,
  ...PRODUCT_OPTIONAL_HEADERS,
]);

// ─── Zod Schema ────────────────────────────────────────────────────
export const ProductRowSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(PRODUCT_TYPES, {
      errorMap: () => ({
        message: "Type must be 'medication' or 'consumable'",
      }),
    }),
    basePrice: z.string().optional(),
    inventoryQuantity: z.number().nonnegative(),
    dosageForm: z.string().optional(),
    lot_number: z.string().optional(),
    expiration_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD")
      .optional(),
    standard_pack_size: z.number().positive().optional(),
    purchase_price: z.number().nonnegative().optional(),
    product_knowledge_name: z.string().optional(),
    charge_item_definition_name: z.string().optional(),
    product_knowledge_slug: z.string().optional(),
    charge_item_definition_slug: z.string().optional(),
  })
  .refine(
    (data) =>
      Boolean(data.product_knowledge_name?.trim()) ||
      Boolean(data.product_knowledge_slug?.trim()),
    {
      message:
        "Either product_knowledge_name or product_knowledge_slug is required",
      path: ["product_knowledge_name"],
    },
  )
  .refine(
    (data) => {
      // If charge_item_definition_name provided without slug, basePrice is required
      if (
        data.charge_item_definition_name?.trim() &&
        !data.charge_item_definition_slug?.trim() &&
        !data.basePrice?.trim()
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "basePrice is required when charge_item_definition_name is provided without a slug",
      path: ["basePrice"],
    },
  );

export type ProductRow = z.infer<typeof ProductRowSchema>;

// ─── Resolved References (populated during review step) ────────────
export interface ProductResolvedRefs {
  productKnowledgeName: string;
  chargeItemName?: string;
  productKnowledgeSlug?: string;
  chargeItemSlug?: string;
  productKnowledgeExists: boolean;
  chargeItemExists: boolean;
}

// ─── API Payloads ──────────────────────────────────────────────────
export function toProductKnowledgePayload(
  row: ProductRow,
  slugValue: string,
  categorySlug: string,
  facilityId: string,
): ProductKnowledgeCreate {
  const pkName = row.product_knowledge_name?.trim() || row.name;

  return {
    facility: facilityId,
    slug_value: slugValue,
    name: pkName,
    status: ProductKnowledgeStatus.active,
    names: [],
    storage_guidelines: [],
    product_type: row.type as ProductKnowledgeType,
    base_unit: {
      system: "http://unitsofmeasure.org",
      code: "{count}",
      display: "count",
    },
    category: categorySlug,
    is_instance_level: false,
    definitional: row.dosageForm?.trim()
      ? {
          dosage_form: {
            system: "system-medication",
            code: row.dosageForm.trim(),
            display: row.dosageForm.trim(),
          },
          intended_routes: [],
          ingredients: [],
          nutrients: [],
          drug_characteristic: [],
        }
      : undefined,
  };
}

export function toChargeItemPayload(
  row: ProductRow,
  slugValue: string,
  categorySlug: string,
): ChargeItemDefinitionCreate {
  const cidName = row.charge_item_definition_name?.trim() || row.name;

  return {
    title: cidName,
    slug_value: slugValue,
    status: ChargeItemDefinitionStatus.active,
    can_edit_charge_item: true,
    discount_configuration: null,
    category: categorySlug,
    price_components: [
      {
        monetary_component_type: MonetaryComponentType.base,
        amount: row.basePrice?.trim() ?? "",
      },
    ],
  };
}

export function toProductPayload(
  productKnowledgeSlug: string,
  chargeItemSlug: string | undefined,
  row: ProductRow,
): ProductCreate {
  const payload: ProductCreate = {
    product_knowledge: productKnowledgeSlug,
    status: ProductStatusOptions.active,
    extensions: {},
  };

  if (chargeItemSlug) {
    payload.charge_item_definition = chargeItemSlug;
  }

  if (row.lot_number?.trim()) {
    payload.batch = { lot_number: row.lot_number.trim() };
  }

  if (row.expiration_date?.trim()) {
    payload.expiration_date = row.expiration_date.trim();
  }

  if (row.standard_pack_size != null) {
    payload.standard_pack_size = row.standard_pack_size;
  }

  if (row.purchase_price != null) {
    payload.purchase_price = row.purchase_price;
  }

  return payload;
}

// ─── Sample CSV ────────────────────────────────────────────────────
export const PRODUCT_SAMPLE_CSV = {
  headers: [
    "name",
    "type",
    "basePrice",
    "inventoryQuantity",
    "dosageForm",
    "lot_number",
    "expiration_date",
    "standard_pack_size",
    "purchase_price",
    "product_knowledge_name",
    "charge_item_definition_name",
    "product_knowledge_slug",
    "charge_item_definition_slug",
  ],
  rows: [
    // Example 1: Using names — PK and CID will be created with auto-generated slugs
    [
      "Paracetamol 500mg",
      "medication",
      "12.5",
      "100",
      "tablet",
      "LOT-0001",
      "31/12/2027",
      "10",
      "8.50",
      "Paracetamol",
      "Paracetamol Charge",
      "",
      "",
    ],
    // Example 2: Using existing slugs — PK and CID must already exist
    [
      "Surgical Gloves",
      "consumable",
      "",
      "250",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "surgical-gloves-pk",
      "surgical-gloves-cid",
    ],
  ],
};

// ─── Parse Row ─────────────────────────────────────────────────────
export function parseProductRow(
  row: string[],
  headerIndices: Record<string, number>,
): Record<string, unknown> {
  const get = (key: string) => row[headerIndices[key]]?.trim() ?? "";

  const inventoryQtyStr = get("inventoryQuantity");
  const inventoryQuantity = inventoryQtyStr
    ? Number.parseInt(inventoryQtyStr, 10)
    : 0;

  const standardPackSizeStr = get("standard_pack_size");
  const standardPackSize = standardPackSizeStr
    ? Number.parseFloat(standardPackSizeStr)
    : undefined;

  const purchasePriceStr = get("purchase_price");
  const purchasePrice = purchasePriceStr
    ? Number.parseFloat(purchasePriceStr)
    : undefined;

  const rawDate = get("expiration_date") || undefined;
  const expirationDate = rawDate
    ? format(parse(rawDate, "dd/MM/yyyy", new Date()), "yyyy-MM-dd")
    : undefined;

  return {
    name: get("name"),
    type: get("type") || undefined,
    basePrice: get("basePrice") || undefined,
    inventoryQuantity: Number.isNaN(inventoryQuantity) ? 0 : inventoryQuantity,
    dosageForm: get("dosageForm") || undefined,
    lot_number: get("lot_number") || undefined,
    expiration_date: expirationDate,
    standard_pack_size:
      standardPackSize && !Number.isNaN(standardPackSize)
        ? standardPackSize
        : undefined,
    purchase_price:
      purchasePrice && !Number.isNaN(purchasePrice) ? purchasePrice : undefined,
    product_knowledge_name: get("product_knowledge_name") || undefined,
    charge_item_definition_name:
      get("charge_item_definition_name") || undefined,
    product_knowledge_slug: get("product_knowledge_slug") || undefined,
    charge_item_definition_slug:
      get("charge_item_definition_slug") || undefined,
  };
}
