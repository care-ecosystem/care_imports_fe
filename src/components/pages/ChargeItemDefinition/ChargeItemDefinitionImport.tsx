import { useMemo, useState } from "react";

import { request } from "@/apis/request";
import { ImportFlow } from "@/components/imports";
import {
  CHARGE_ITEM_HEADER_MAP,
  CHARGE_ITEM_REQUIRED_HEADERS,
  CHARGE_ITEM_SAMPLE_CSV,
  ChargeItemRow,
  ChargeItemRowSchema,
  parseChargeItemRow,
  toChargeItemCreatePayload,
  validateChargeItemRows,
} from "@/components/pages/ChargeItemDefinition/utils";
import { ResourceCategoryPicker } from "@/components/shared/ResourceCategoryPicker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ImportConfig } from "@/internalTypes/importConfig";
import {
  ResourceCategoryResourceType,
  ResourceCategorySubType,
} from "@/types/base/resourceCategory/resourceCategory";
import resourceCategoryApi from "@/types/base/resourceCategory/resourceCategoryApi";
import chargeItemDefinitionApi from "@/types/billing/chargeItemDefinition/chargeItemDefinitionApi";
import { downloadCsv } from "@/Utils/csv";
import { batchFetchAll } from "@/Utils/importHelpers";
import { mutate } from "@/Utils/request/mutate";
import { createSlug } from "@/Utils/slug";
import { Download, Upload } from "lucide-react";

interface ChargeItemDefinitionImportProps {
  facilityId?: string;
}

/**
 * Create the import config with facilityId and categorySlug in closure.
 */
function createChargeItemImportConfig(
  facilityId: string,
  categorySlug: string,
): ImportConfig<ChargeItemRow, { slug: string }, Set<string>> {
  // Cache of existing slugs, populated by beforeImport
  let existingSlugsCache: Set<string> | null = null;

  return {
    resourceName: "Charge Item Definition",
    resourceNamePlural: "Charge Item Definitions",

    // Parsing
    requiredHeaders: CHARGE_ITEM_REQUIRED_HEADERS,
    headerMap: CHARGE_ITEM_HEADER_MAP,
    schema: ChargeItemRowSchema,
    parseRow: parseChargeItemRow,

    // Batch pre-fetch existing slugs once before processing rows
    beforeImport: async () => {
      const results = await batchFetchAll<{ slug: string }>(
        chargeItemDefinitionApi.listChargeItemDefinition,
        { pathParams: { facilityId } },
      );
      existingSlugsCache = new Set(results.map((item) => item.slug));
      return existingSlugsCache;
    },

    // API operations
    checkExists: async (row) => {
      const slug = `f-${facilityId}-${row.slug_value.trim()}`;
      if (existingSlugsCache) {
        return existingSlugsCache.has(slug) ? slug : undefined;
      }
    },

    createResource: async (row) => {
      const payload = toChargeItemCreatePayload(row, categorySlug);
      const created = await mutate(
        chargeItemDefinitionApi.createChargeItemDefinition,
        {
          pathParams: { facilityId },
        },
      )(payload);
      if (!created?.slug) {
        throw new Error(`Failed to create charge item: ${row.title}`);
      }
      return { slug: created.slug };
    },

    updateResource: async (slug, row) => {
      const payload = toChargeItemCreatePayload(row, categorySlug);
      await mutate(chargeItemDefinitionApi.updateChargeItemDefinition, {
        pathParams: { facilityId, slug },
      })(payload);
    },

    // Cross-row validation
    validateRows: validateChargeItemRows,
    getRowIdentifier: (row) => row.slug_value.trim().toLowerCase(),

    // Execution
    batchSize: 5, // Can process in parallel - no hierarchy
    invalidateKeys: [["chargeItemDefinitions", facilityId]],

    // UI
    description: "Upload a CSV to import charge item definitions.",
    uploadHints: [
      "Expected columns: title, slug_value, description, purpose, price",
      "Existing items with same slug will be updated",
    ],
    sampleCsv: CHARGE_ITEM_SAMPLE_CSV,

    reviewColumns: [
      { header: "Title", accessor: "title" },
      { header: "Slug", accessor: "slug_value" },
      { header: "Price", accessor: "price" },
      { header: "Description", accessor: (row) => row.description || "-" },
    ],
  };
}

/**
 * Charge Item Definition import page.
 * First collects category title, then shows ImportFlow.
 */
export default function ChargeItemDefinitionImport({
  facilityId,
}: ChargeItemDefinitionImportProps) {
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categorySlug, setCategorySlug] = useState<string | undefined>(
    undefined,
  );
  const [isResolvingCategory, setIsResolvingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [screen, setScreen] = useState<"category" | "upload">("category");

  const config = useMemo(() => {
    if (!facilityId || !categorySlug) return null;
    return createChargeItemImportConfig(facilityId, categorySlug);
  }, [facilityId, categorySlug]);

  if (!facilityId) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center text-gray-500">
        Please select a facility to import charge item definitions.
      </div>
    );
  }

  const resolveCategory = async () => {
    const title = categoryTitle.trim();
    if (!title) {
      setCategoryError("Category title is required");
      return;
    }

    setIsResolvingCategory(true);
    setCategoryError("");

    try {
      if (categorySlug) return; // Already resolved
      // Check if category already exists
      const existingCategories = await request(resourceCategoryApi.list, {
        pathParams: { facilityId },
        queryParams: {
          limit: 100,
          resource_type: ResourceCategoryResourceType.charge_item_definition,
          resource_sub_type: ResourceCategorySubType.other,
        },
      });

      const normalizedTitle = title.toLowerCase();
      const existing = existingCategories.results?.find(
        (cat) => cat.title.trim().toLowerCase() === normalizedTitle,
      );

      let slug: string;
      if (existing) {
        slug = existing.slug_config.slug_value;
      } else {
        // Create new category
        slug = await createSlug(title);
        await mutate(resourceCategoryApi.create, {
          pathParams: { facilityId },
        })({
          title,
          slug_value: slug,
          resource_type: ResourceCategoryResourceType.charge_item_definition,
          resource_sub_type: ResourceCategorySubType.other,
        });
      }

      // Store the full resource category slug format
      setCategorySlug(`f-${facilityId}-${slug}`);
    } catch (error) {
      setCategoryError(
        error instanceof Error ? error.message : "Failed to resolve category",
      );
    } finally {
      setIsResolvingCategory(false);
      setScreen("upload");
    }
  };

  const downloadSample = () => {
    if (!CHARGE_ITEM_SAMPLE_CSV) return;
    const csvContent = [
      CHARGE_ITEM_SAMPLE_CSV.headers.join(","),
      ...CHARGE_ITEM_SAMPLE_CSV.rows?.map((row) => row.join(",")),
    ].join("\n");
    downloadCsv("sample_charge_item_definitions.csv", csvContent);
  };

  // Step 1: Category selection
  if (screen === "category") {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Charge Item Definitions
            </CardTitle>
            <CardDescription>
              First, specify the category for the charge items you&apos;re
              importing.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Category Title
              </label>
              <Input
                value={categoryTitle}
                onChange={(e) => setCategoryTitle(e.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Consultation Charges"
                onKeyDown={(e) => {
                  if (e.key === "Enter") resolveCategory();
                }}
                disabled={!!categorySlug}
              />
              <p className="mt-1 text-xs text-gray-500">
                If this category doesn&apos;t exist, it will be created
                automatically.
              </p>
            </div>
            OR
            <ResourceCategoryPicker
              facilityId={facilityId}
              resourceType={ResourceCategoryResourceType.charge_item_definition}
              resourceSubType={ResourceCategorySubType.other}
              value={categorySlug}
              onValueChange={(cat) => {
                setCategoryTitle(cat?.title || "");
                setCategorySlug(cat?.slug || "");
              }}
            />
            {categoryError && (
              <p className="text-sm text-red-600">{categoryError}</p>
            )}
            <div className="flex flex-row gap-2">
              <Button
                onClick={resolveCategory}
                disabled={isResolvingCategory || !categoryTitle.trim()}
              >
                {isResolvingCategory ? "Loading..." : "Continue to Upload"}
              </Button>

              <Button variant="outline" size="default" onClick={downloadSample}>
                <Download className="h-4 w-4 mr-2" />
                Download Sample CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: ImportFlow with resolved category
  if (!config) return null;

  return (
    <div className="space-y-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span className="font-medium">Category:</span>
          <span className="bg-gray-100 px-2 py-1 rounded">{categoryTitle}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCategorySlug(undefined);
              setCategoryTitle("");
              setScreen("category");
            }}
          >
            Change
          </Button>
        </div>
      </div>
      <ImportFlow config={config} />
    </div>
  );
}
