import { AlertCircle, Download, Loader2, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { request } from "@/apis/request";
import { ImportFlow } from "@/components/imports";
import { LocationTreePicker } from "@/components/LocationTreePicker";
import {
  PRODUCT_HEADER_MAP,
  PRODUCT_REQUIRED_HEADERS,
  PRODUCT_SAMPLE_CSV,
  ProductRow,
  ProductRowSchema,
  parseProductRow,
  toChargeItemPayload,
  toProductKnowledgePayload,
  toProductPayload,
} from "@/components/pages/Product/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ImportResults } from "@/internalTypes/common";
import type { ImportConfig } from "@/internalTypes/importConfig";
import { ResourceCategoryResourceType } from "@/types/base/resourceCategory/resourceCategory";
import chargeItemDefinitionApi from "@/types/billing/chargeItemDefinition/chargeItemDefinitionApi";
import { DeliveryOrderStatus } from "@/types/inventory/deliveryOrder/deliveryOrder";
import deliveryOrderApi from "@/types/inventory/deliveryOrder/deliveryOrderApi";
import productApi from "@/types/inventory/product/productApi";
import productKnowledgeApi from "@/types/inventory/productKnowledge/productKnowledgeApi";
import {
  SupplyDeliveryCondition,
  SupplyDeliveryStatus,
  SupplyDeliveryType,
} from "@/types/inventory/supplyDelivery/supplyDelivery";
import supplyDeliveryApi from "@/types/inventory/supplyDelivery/supplyDeliveryApi";
import organizationApi from "@/types/organization/organizationApi";
import { downloadCsv } from "@/Utils/csv";
import { mutate } from "@/Utils/request/mutate";
import { upsertResourceCategories } from "@/Utils/resourceCategory";
import { createSlug } from "@/Utils/slug";

interface ProductImportProps {
  facilityId?: string;
}

// ─── Types ─────────────────────────────────────────────────────────

/** Result of beforeImport: category maps for PK and CID */
interface BeforeImportResult {
  pkCategoryMap: Map<string, string>;
  cidCategoryMap: Map<string, string>;
}

/** Result of preCreate: resolved slugs for PK and CID */
interface PreCreateResult {
  productKnowledgeSlug: string;
  chargeItemSlug?: string;
}

/** Created product info for afterImport inventory batching */
interface CreatedProduct {
  id: string;
  row: ProductRow;
}

// ─── Helpers ───────────────────────────────────────────────────────

const normalizeName = (value: string) => value.trim().toLowerCase();

// ─── Main Component ────────────────────────────────────────────────

export default function ProductImport({ facilityId }: ProductImportProps) {
  // Step 1: Configure inventory destination (optional)
  const [isConfigured, setIsConfigured] = useState(false);
  const [locationId, setLocationId] = useState("");
  const [locationName, setLocationName] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);

  // Load suppliers on mount
  useEffect(() => {
    if (!facilityId) return;

    const loadSuppliers = async () => {
      setIsLoadingSuppliers(true);
      try {
        const response = await request(organizationApi.list, {
          pathParams: { facility_id: facilityId },
          queryParams: { limit: 500, org_type: "product_supplier" },
        });
        setSuppliers(response.results.map((s) => ({ id: s.id, name: s.name })));
      } catch {
        setSuppliers([]);
      } finally {
        setIsLoadingSuppliers(false);
      }
    };

    loadSuppliers();
  }, [facilityId]);

  // Create import config with closures over configuration
  const config = useMemo(() => {
    if (!facilityId) return null;

    return createProductImportConfig(facilityId, locationId, supplierId);
  }, [facilityId, locationId, supplierId]);

  if (!facilityId) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center text-gray-500">
        Please select a facility to import products.
      </div>
    );
  }

  const downloadSample = () => {
    if (!PRODUCT_SAMPLE_CSV) return;
    const csvContent = [
      PRODUCT_SAMPLE_CSV.headers.join(","),
      ...PRODUCT_SAMPLE_CSV.rows?.map((row) => row.join(",")),
    ].join("\n");
    downloadCsv("sample_product_definitions.csv", csvContent);
  };

  // Step 1: Configure inventory destination
  if (!isConfigured) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Products
            </CardTitle>
            <CardDescription>
              Configure where inventory should be delivered. Inventory stock
              will only be added for rows with an inventory quantity, batch and
              expiration date in your CSV.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSuppliers ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm">Loading suppliers…</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold">
                        Destination Location
                      </p>
                      <p className="text-xs text-gray-500">
                        Where the imported stock will be delivered to.
                      </p>
                    </div>
                    <LocationTreePicker
                      facilityId={facilityId}
                      value={locationId}
                      valueName={locationName}
                      onValueChange={(id, name) => {
                        setLocationId(id);
                        setLocationName(name);
                      }}
                      placeholder="Select location"
                      className="w-full max-w-[675px] md:w-72"
                    />
                  </div>

                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold">Supplier</p>
                      <p className="text-xs text-gray-500">
                        The vendor/supplier for the delivery order.
                      </p>
                    </div>
                    <Select value={supplierId} onValueChange={setSupplierId}>
                      <SelectTrigger className="w-full max-w-[675px] md:w-72">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(!locationId || !supplierId) && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Without a location and supplier, products will be created
                      but inventory stock will not be added.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="default"
                    onClick={downloadSample}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Sample CSV
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsConfigured(true)}
                  >
                    Skip
                  </Button>
                  <Button
                    onClick={() => setIsConfigured(true)}
                    disabled={!locationId || !supplierId}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: ImportFlow
  if (!config) return null;

  return (
    <div className="space-y-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          {locationId && supplierId ? (
            <>
              <span className="font-medium">Inventory destination:</span>
              <span className="bg-gray-100 px-2 py-1 rounded">
                {locationName}
              </span>
              <span className="text-gray-400 text-xs">
                (for rows with inventoryQuantity)
              </span>
            </>
          ) : (
            <span className="text-amber-600">
              Inventory stock will not be added (no location/supplier)
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsConfigured(false)}
          >
            Change
          </Button>
        </div>
      </div>
      <ImportFlow<
        ProductRow,
        CreatedProduct,
        BeforeImportResult,
        PreCreateResult
      >
        config={config}
      />
    </div>
  );
}

// ─── Import Config Factory ─────────────────────────────────────────

function createProductImportConfig(
  facilityId: string,
  locationId: string,
  supplierId: string,
): ImportConfig<
  ProductRow,
  CreatedProduct,
  BeforeImportResult,
  PreCreateResult
> {
  return {
    resourceName: "Product",
    resourceNamePlural: "Products",

    // Parsing
    requiredHeaders: PRODUCT_REQUIRED_HEADERS,
    headerMap: PRODUCT_HEADER_MAP,
    schema: ProductRowSchema,
    parseRow: parseProductRow,

    // Lifecycle hooks
    beforeImport: async () => {
      // Ensure categories exist for both PK and CID
      const [pkCategoryMap, cidCategoryMap] = await Promise.all([
        upsertResourceCategories({
          facilityId,
          categories: ["Medicines", "Consumables"],
          resourceType: ResourceCategoryResourceType.product_knowledge,
          slugPrefix: "pk",
        }),
        upsertResourceCategories({
          facilityId,
          categories: ["Medications", "Consumables"],
          resourceType: ResourceCategoryResourceType.charge_item_definition,
          slugPrefix: "cid",
        }),
      ]);

      return { pkCategoryMap, cidCategoryMap };
    },

    preCreateUpdate: async (row, beforeResult) => {
      const { pkCategoryMap, cidCategoryMap } = beforeResult;

      // Resolve or create ProductKnowledge
      let productKnowledgeSlug: string;

      if (row.product_knowledge_slug?.trim()) {
        // Use provided slug directly
        productKnowledgeSlug = `f-${facilityId}-${row.product_knowledge_slug.trim()}`;
      } else {
        // Create new ProductKnowledge
        const pkName = row.product_knowledge_name?.trim() || row.name;

        // Check if PK already exists
        try {
          const response = await request(
            productKnowledgeApi.listProductKnowledge,
            {
              pathParams: { facility: facilityId },
              queryParams: {
                limit: 10,
                org_type: "product_supplier",
                name: pkName,
              },
            },
          );
          const match = response.results.find(
            (item: { name: string; slug: string }) =>
              normalizeName(item.name) === normalizeName(pkName),
          );
          if (match) {
            productKnowledgeSlug = match.slug;
          } else {
            throw new Error("Not found");
          }
        } catch {
          // Create new PK
          const slugValue = await createSlug(pkName);
          const categoryName =
            row.type === "medication" ? "Medicines" : "Consumables";
          const categorySlug =
            pkCategoryMap.get(normalizeName(categoryName)) ?? "";

          const payload = toProductKnowledgePayload(
            row,
            slugValue,
            categorySlug,
            facilityId,
          );
          const pkResponse = await mutate(
            productKnowledgeApi.createProductKnowledge,
            {},
          )(payload);
          productKnowledgeSlug = pkResponse.slug;
        }
      }

      // Resolve or create ChargeItemDefinition (if applicable)
      let chargeItemSlug: string | undefined;

      if (row.charge_item_definition_slug?.trim()) {
        chargeItemSlug = `f-${facilityId}-${row.charge_item_definition_slug.trim()}`;
      } else if (row.basePrice?.trim()) {
        // Need to create or find CID
        const cidName = row.charge_item_definition_name?.trim() || row.name;

        try {
          const response = await request(
            chargeItemDefinitionApi.listChargeItemDefinition,
            {
              pathParams: { facilityId: facilityId },
              queryParams: { title: cidName, limit: 10 },
            },
          );
          const match = response.results.find(
            (item: { title: string; slug: string }) =>
              normalizeName(item.title) === normalizeName(cidName),
          );
          if (match) {
            chargeItemSlug = match.slug;
          } else {
            throw new Error("Not found");
          }
        } catch {
          // Create new CID
          const slugValue = await createSlug(cidName);
          const categoryName =
            row.type === "medication" ? "Medications" : "Consumables";
          const categorySlug =
            cidCategoryMap.get(normalizeName(categoryName)) ?? "";

          const payload = toChargeItemPayload(row, slugValue, categorySlug);
          const cidResponse = await mutate(
            chargeItemDefinitionApi.createChargeItemDefinition,
            {
              pathParams: { facilityId },
            },
          )(payload);
          chargeItemSlug = cidResponse.slug;
        }
      }

      return { productKnowledgeSlug, chargeItemSlug };
    },

    createResource: async (row, _params, preCreateResult) => {
      if (!preCreateResult) {
        throw new Error("preCreate result missing");
      }

      const payload = toProductPayload(
        preCreateResult.productKnowledgeSlug,
        preCreateResult.chargeItemSlug,
        row,
      );

      const productResponse = await mutate(productApi.createProduct, {
        pathParams: { facilityId },
      })(payload);

      return { id: productResponse.id, row };
    },

    afterImport: async (
      _results: ImportResults,
      createdItems: CreatedProduct[],
    ) => {
      // Only run inventory creation if location and supplier are configured
      if (!locationId || !supplierId) return;

      // Filter items that need inventory
      const inventoryItems = createdItems.filter(
        (item) => item.row.inventoryQuantity > 0,
      );

      if (inventoryItems.length === 0) return;

      // Batch delivery orders (100 items each)
      const BATCH_SIZE = 100;
      const today = new Date().toISOString().split("T")[0];

      for (let i = 0; i < inventoryItems.length; i += BATCH_SIZE) {
        const batch = inventoryItems.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

        try {
          // Create delivery order for batch
          const deliveryOrder = await mutate(
            deliveryOrderApi.createDeliveryOrder,
            {
              pathParams: { facilityId },
            },
          )({
            name: `Product Import Batch ${batchNumber} — ${today}`,
            status: DeliveryOrderStatus.pending,
            destination: locationId,
            supplier: supplierId,
            note: "Automated delivery order from product import",
            extensions: {},
          });

          // Create supply deliveries for each item
          for (const item of batch) {
            try {
              const payload = {
                status: SupplyDeliveryStatus.completed,
                supplied_item_type: SupplyDeliveryType.product,
                supplied_item: item.id,
                supplied_item_quantity: item.row.inventoryQuantity.toString(),
                supplied_item_condition: SupplyDeliveryCondition.normal,
                destination: locationId,
                order: deliveryOrder.id,
              };

              await mutate(supplyDeliveryApi.createSupplyDelivery)(
                payload as any,
              );
            } catch {
              console.error(
                `Failed to create supply delivery for product ${item.row.name}`,
              );
            }
          }

          // Mark delivery order as completed
          try {
            await mutate(deliveryOrderApi.updateDeliveryOrder, {
              pathParams: { facilityId, deliveryOrderId: deliveryOrder.id },
            })({
              id: deliveryOrder.id,
              name: `Product Import Batch ${batchNumber} — ${today}`,
              status: DeliveryOrderStatus.completed,
              destination: locationId,
              note: "Completed via product import",
            });
          } catch {
            // Non-critical
          }
        } catch {
          console.error(
            `Failed to create delivery order for batch ${batchNumber}`,
          );
        }
      }
    },

    // Execution
    batchSize: 1, // Sequential due to preCreate dependencies
    invalidateKeys: [
      ["products", facilityId],
      ["productKnowledge", facilityId],
      ["chargeItemDefinitions", facilityId],
    ],

    // UI
    description:
      "Upload a CSV to import products. ProductKnowledge and ChargeItemDefinition resources will be created automatically as needed.",
    uploadHints: [
      "Required columns: name, type",
      "Use product_knowledge_name/slug to reference or create ProductKnowledge",
      "Provide basePrice to auto-create ChargeItemDefinition",
    ],
    sampleCsv: PRODUCT_SAMPLE_CSV,

    reviewColumns: [
      { header: "Name", accessor: "name" },
      { header: "Type", accessor: "type" },
      { header: "Price", accessor: (row) => row.basePrice || "-" },
      { header: "Qty", accessor: (row) => String(row.inventoryQuantity) },
      {
        header: "PK",
        accessor: (row) =>
          row.product_knowledge_slug || row.product_knowledge_name || row.name,
      },
    ],
  };
}
