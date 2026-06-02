import { Database } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { HttpError, request } from "@/apis/request";
import { ImportFlow } from "@/components/imports";
import {
  PK_HEADER_MAP,
  PK_REQUIRED_HEADERS,
  PK_SAMPLE_CSV,
  getProductKnowledgeRowSchema,
  getReviewColumns,
  parseProductKnowledgeRow,
  toProductKnowledgeCreatePayload,
  validateProductKnowledgeRows,
  type ProductKnowledgeRow,
} from "@/components/pages/ProductKnowledge/utils";
import MasterDataFileSelector from "@/components/shared/MasterDataFileSelector";
import { ResourceCategoryPicker } from "@/components/shared/ResourceCategoryPicker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { disableOverride } from "@/config";
import { useMasterDataAvailability } from "@/hooks/useMasterDataAvailability";
import type { ImportConfig, ProcessedRow } from "@/internalTypes/importConfig";
import {
  ResourceCategoryRead,
  ResourceCategoryResourceType,
  ResourceCategorySubType,
} from "@/types/base/resourceCategory/resourceCategory";
import productKnowledgeApi from "@/types/inventory/productKnowledge/productKnowledgeApi";
import { parseCsvToProcessedRows } from "@/Utils/csv";
import { mutate } from "@/Utils/request/mutate";
import { upsertResourceCategories } from "@/Utils/resourceCategory";

interface ProductKnowledgeImportNewProps {
  facilityId?: string;
}

type ActiveView =
  | { kind: "upload" }
  | { kind: "csv-flow" }
  | { kind: "master-select" }
  | {
      kind: "master";
      processedRows: ProcessedRow<ProductKnowledgeRow>[];
    };

/**
 * Normalize category name for lookup.
 */
const normalizeCategory = (value: string) => value.trim().toLowerCase();

/**
 * ProductKnowledge import page supporting both CSV upload and master data imports.
 *
 * Flow options:
 * - CSV: upload → ImportFlow handles review/import
 * - Master: upload → master-select → ImportFlow with processedRows
 */
export default function ProductKnowledgeImportNew({
  facilityId,
}: ProductKnowledgeImportNewProps) {
  const [activeView, setActiveView] = useState<ActiveView>({ kind: "upload" });
  const [category, setCategory] = useState<ResourceCategoryRead | undefined>(
    undefined,
  );

  const { files, availability } = useMasterDataAvailability();
  const pkFiles = files["product-knowledge"] ?? [];
  const hasMasterFiles = availability["product-knowledge"] ?? false;
  const disableManualUpload = disableOverride && hasMasterFiles;

  // ─── Base Config (shared by CSV and master paths) ─────────────────
  const createBaseConfig = useCallback(() => {
    let categorySlugMap: Map<string, string> = new Map();

    const base: Pick<
      ImportConfig<ProductKnowledgeRow, { slug: string }>,
      | "resourceName"
      | "resourceNamePlural"
      | "getRowIdentifier"
      | "validateRows"
      | "checkExists"
      | "createResource"
      | "updateResource"
      | "invalidateKeys"
    > = {
      resourceName: "Product Knowledge",
      resourceNamePlural: "Product Knowledge",
      getRowIdentifier: (row) => row.slug,
      validateRows: validateProductKnowledgeRows,

      checkExists: async (row) => {
        const pkSlug = facilityId
          ? `f-${facilityId}-${row.slug}`
          : `i-${row.slug}`;
        try {
          const existing = await request(
            productKnowledgeApi.retrieveProductKnowledge,
            {
              pathParams: { slug: pkSlug },
            },
          );
          return (existing as { id?: string }).id;
        } catch (error) {
          if (error instanceof HttpError && error.status === 404) {
            return undefined;
          }
          throw error;
        }
      },

      createResource: async (row) => {
        let categorySlug: string | undefined;

        if (facilityId) {
          if (category?.slug) {
            // Picker category takes precedence
            categorySlug = category.slug;
          } else if (row.resourceCategory) {
            if (!categorySlugMap.has(normalizeCategory(row.resourceCategory))) {
              const newMap = await upsertResourceCategories({
                facilityId,
                categories: [row.resourceCategory],
                resourceType: ResourceCategoryResourceType.product_knowledge,
                slugPrefix: "pk",
              });
              newMap.forEach((slug, key) => categorySlugMap.set(key, slug));
            }
            categorySlug =
              categorySlugMap.get(normalizeCategory(row.resourceCategory)) ??
              "";
          }
        }

        const payload = toProductKnowledgeCreatePayload(
          row,
          facilityId,
          categorySlug,
        );
        return mutate(productKnowledgeApi.createProductKnowledge)(payload);
      },

      updateResource: async (_id, row) => {
        let categorySlug: string | undefined;

        if (facilityId) {
          if (category?.slug) {
            categorySlug = category.slug;
          } else if (row?.resourceCategory) {
            if (!categorySlugMap.has(normalizeCategory(row.resourceCategory))) {
              const newMap = await upsertResourceCategories({
                facilityId,
                categories: [row.resourceCategory],
                resourceType: ResourceCategoryResourceType.product_knowledge,
                slugPrefix: "pk",
              });
              newMap.forEach((slug, key) => categorySlugMap.set(key, slug));
            }
            categorySlug =
              categorySlugMap.get(normalizeCategory(row.resourceCategory)) ??
              "";
          }
        }

        const payload = toProductKnowledgeCreatePayload(
          row,
          facilityId,
          categorySlug,
        );

        const pkSlug = facilityId
          ? `f-${facilityId}-${row.slug}`
          : `i-${row.slug}`;
        await mutate(productKnowledgeApi.updateProductKnowledge, {
          pathParams: { slug: pkSlug },
        })(payload);
      },

      invalidateKeys: [["product-knowledge"]],
    };

    return base;
  }, [facilityId, category]);

  const requiredHeaders = useMemo(() => {
    return PK_REQUIRED_HEADERS.filter(
      (h) => !((!facilityId || category?.slug) && h === "resourceCategory"),
    );
  }, [facilityId, category]);

  // ─── CSV Import Config ───────────────────────────────────────────
  const csvImportConfig: ImportConfig<ProductKnowledgeRow, { slug: string }> =
    useMemo(() => {
      return {
        ...createBaseConfig(),

        // Parsing
        // For CSV imports, resource category can come from either the picker or the CSV itself. If both are present, the picker's value takes precedence and the CSV value is ignored.
        // If facilityId is not present, resource category is ignored since categories are facility-scoped.
        requiredHeaders,
        headerMap: PK_HEADER_MAP,
        schema: getProductKnowledgeRowSchema(facilityId),
        parseRow: (row: string[], headerIndices: Record<string, number>) =>
          parseProductKnowledgeRow(row, headerIndices, category?.slug),

        // UI
        description: "Upload a CSV file to import product knowledge entries.",
        uploadHints: [
          `Required columns: ${requiredHeaders.join(", ")}`,
          "Product types: medication, consumable, nutritional_product",
          "Existing items with same slug will be updated",
        ],
        sampleCsv: PK_SAMPLE_CSV,

        reviewColumns: getReviewColumns(category?.title),
      };
    }, [createBaseConfig, category, requiredHeaders]);

  // ─── Master Import Config ────────────────────────────────────────
  const masterImportConfig: ImportConfig<
    ProductKnowledgeRow,
    { slug: string }
  > = useMemo(() => {
    return {
      ...createBaseConfig(),

      reviewColumns: [
        { header: "Name", accessor: "name", width: "w-48" },
        { header: "Type", accessor: "productType" },
        { header: "Category", accessor: "resourceCategory" },
        { header: "Slug", accessor: "slug" },
      ],
    };
  }, [createBaseConfig]);

  // ─── Handlers ────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    setActiveView({ kind: "upload" });
  }, []);

  const handleMasterFileSelected = useCallback(
    (csvText: string, _fileName: string) => {
      const processedRows = parseCsvToProcessedRows(csvText, csvImportConfig);
      setActiveView({ kind: "master", processedRows });
    },
    [csvImportConfig],
  );

  // ─── Render Upload Screen (Two Cards) ────────────────────────────
  if (activeView.kind === "upload" || activeView.kind === "csv-flow") {
    const showGrid = activeView.kind === "upload";
    return (
      <div className="flex flex-col gap-2">
        {!facilityId && (
          <span className="bg-yellow-50 border border-yellow-200 p-2 rounded">
            Facility not selected, imports will be created at instance level.
          </span>
        )}
        <div
          className={
            showGrid
              ? "max-w-5xl mx-auto grid gap-3 md:grid-cols-2 items-stretch"
              : ""
          }
        >
          <div className="flex flex-col gap-2">
            {showGrid && facilityId && (
              <>
                <ResourceCategoryPicker
                  facilityId={facilityId}
                  resourceType={ResourceCategoryResourceType.product_knowledge}
                  resourceSubType={ResourceCategorySubType.other}
                  value={category?.slug}
                  onValueChange={(cat) => setCategory(cat)}
                  placeholder="Select a category (optional, overrides CSV)"
                />
                <label className="text-xs text-gray-500">
                  (Optional) Select a category for the product knowledges being
                  imported. Do note that this will{" "}
                  <span className="font-semibold">
                    override any category specified in the CSV
                  </span>
                  .
                </label>
              </>
            )}
            <ImportFlow
              config={csvImportConfig}
              disableUpload={disableManualUpload}
              disabledMessage="Manual uploads are disabled because this build includes a product knowledge dataset in the repository."
              onStepChange={(step) =>
                setActiveView({
                  kind: step === "upload" ? "upload" : "csv-flow",
                })
              }
            />
          </div>
          {/* Master Data Card */}
          {showGrid && (
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Import Product Knowledge from dataset
                </CardTitle>
                <CardDescription>
                  Import data for Product Knowledge from available master
                  dataset.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-row gap-4 flex-1">
                <div className="rounded-lg border border-gray-200 px-6 py-12 text-center w-full flex flex-col items-center justify-between">
                  <div className="flex flex-col items-center gap-4 flex-1 justify-center">
                    <Database className="h-12 w-12 text-gray-400" />
                    {hasMasterFiles ? (
                      <>
                        <p className="text-lg font-medium text-gray-600">
                          Upload from master dataset
                        </p>
                        <p className="text-xs text-gray-400">
                          A bundled dataset is available in this build.
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-600 text-sm">
                        No bundled dataset was detected for this build. Upload a
                        CSV file to import manually.
                      </p>
                    )}
                  </div>
                  {hasMasterFiles && (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveView({ kind: "master-select" })}
                      >
                        Import Master Data
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // ─── Master Select ───────────────────────────────────────────────
  if (activeView.kind === "master-select") {
    return (
      <MasterDataFileSelector
        title="Product Knowledge"
        files={pkFiles}
        onFileSelected={handleMasterFileSelected}
        onBack={handleBack}
      />
    );
  }

  // ─── Master Import ───────────────────────────────────────────────
  return (
    <ImportFlow
      config={masterImportConfig}
      processedRows={activeView.processedRows}
      onBack={handleBack}
    />
  );
}
