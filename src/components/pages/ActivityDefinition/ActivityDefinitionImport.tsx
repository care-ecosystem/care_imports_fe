import { AlertCircle, Database, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ImportFlow } from "@/components/imports";
import {
  AD_HEADER_MAP,
  AD_REQUIRED_HEADERS,
  AD_REVIEW_COLUMNS,
  AD_SAMPLE_CSV,
  applyHealthcareServiceMappings,
  createValidationCache,
  getActivityDefinitionCsvRowSchema,
  getReviewColumns,
  parseActivityDefinitionCsvRow,
  parseMasterCsvToRows,
  resolveReferences,
  toActivityDefinitionDatapoint,
  validateActivityDefinitionCsvRowsAsync,
  type ActivityDefinitionCsvRow,
  type ActivityDefinitionRow,
  type ActivityDefinitionValidationCache,
} from "@/components/pages/ActivityDefinition/utils";
import MasterDataFileSelector from "@/components/shared/MasterDataFileSelector";
import { ResourceCategoryPicker } from "@/components/shared/ResourceCategoryPicker";
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
import { disableOverride } from "@/config";
import { useMasterDataAvailability } from "@/hooks/useMasterDataAvailability";
import type { ImportConfig, ProcessedRow } from "@/internalTypes/importConfig";
import {
  ResourceCategoryRead,
  ResourceCategoryResourceType,
  ResourceCategorySubType,
} from "@/types/base/resourceCategory/resourceCategory";
import {
  Classification,
  Kind,
  Status,
} from "@/types/emr/activityDefinition/activityDefinition";
import activityDefinitionApi from "@/types/emr/activityDefinition/activityDefinitionApi";
import type {
  HealthcareServiceOption,
  ResolvedRow,
} from "@/Utils/activityDefinitionHelper";
import { batchFetchAll, normalize } from "@/Utils/importHelpers";
import { mutate } from "@/Utils/request/mutate";
import { upsertResourceCategories } from "@/Utils/resourceCategory";

interface ActivityDefinitionImportProps {
  facilityId?: string;
}

// ─── beforeImport result type ──────────────────────────────────────

type CsvBeforeResult = ActivityDefinitionValidationCache;

// ─── Active view states ────────────────────────────────────────────

type ActiveView =
  | { kind: "upload" }
  | { kind: "csv-flow" }
  | { kind: "master-select" }
  | {
      kind: "resolving";
      rows: ProcessedRow<ActivityDefinitionRow>[];
    }
  | {
      kind: "mapping";
      rows: ProcessedRow<ActivityDefinitionRow>[];
      healthcareServices: HealthcareServiceOption[];
      activityCategories: string[];
    }
  | {
      kind: "import";
      processedRows: ProcessedRow<ActivityDefinitionRow>[];
    };

/**
 * ActivityDefinition import page supporting both CSV upload and master data imports.
 *
 * CSV path: ImportFlow handles upload/parsing via schema → beforeImport/preCreateUpdate resolve references → import
 * Master path: upload → master-select → resolving → mapping (if needed) → ImportFlow with processedRows
 */
export default function ActivityDefinitionImport({
  facilityId,
}: ActivityDefinitionImportProps) {
  const [activeView, setActiveView] = useState<ActiveView>({ kind: "upload" });
  const [categoryMappings, setCategoryMappings] = useState<
    Record<string, string>
  >({});
  const [category, setCategory] = useState<ResourceCategoryRead | undefined>(
    undefined,
  );

  const { availability, files } = useMasterDataAvailability();
  const repoFileAvailable = availability["activity-definition"];
  const disableManualUpload = disableOverride && repoFileAvailable;

  // Shared cache populated by validateRows, consumed by preCreate
  const validationCacheRef = useRef(createValidationCache());

  // ─── Base Config (shared by CSV and master paths) ─────────────────
  const createBaseConfig = useCallback(() => {
    let existingSlugsCache: Set<string> | null = null;

    return {
      resourceName: "Activity Definition",
      resourceNamePlural: "Activity Definitions",
      getRowIdentifier: (row: { slug_value?: string }) => row.slug_value ?? "",

      checkExists: async (row: { slug_value?: string }) => {
        if (!facilityId) return undefined;
        // Lazy-init: batch-fetch all slugs on first call
        if (!existingSlugsCache) {
          const results = await batchFetchAll<{ slug: string }>(
            activityDefinitionApi.listActivityDefinition,
            { pathParams: { facilityId } },
          );
          existingSlugsCache = new Set(results.map((item) => item.slug));
        }
        const slug = `f-${facilityId}-${row.slug_value}`;
        return existingSlugsCache.has(slug) ? slug : undefined;
      },
    };
  }, [facilityId]);

  // ─── CSV Import Config ─────────────────────────────────────────────
  const csvImportConfig: ImportConfig<
    ActivityDefinitionCsvRow,
    void,
    CsvBeforeResult,
    ResolvedRow
  > = useMemo(() => {
    return {
      ...createBaseConfig(),

      // Parsing
      requiredHeaders: AD_REQUIRED_HEADERS.filter(
        (h) => !(category?.slug && h === "category_name"),
      ),
      headerMap: AD_HEADER_MAP,
      schema: getActivityDefinitionCsvRowSchema(),
      parseRow: (row, headerIndices) =>
        parseActivityDefinitionCsvRow(row, headerIndices, category?.slug),

      // Cross-row validation — also populates validationCacheRef with
      // location IDs and healthcare service IDs for preCreate to use.
      validateRows: (rows) => {
        if (!facilityId) return [];
        // Reset cache for fresh validation
        validationCacheRef.current = createValidationCache();
        return validateActivityDefinitionCsvRowsAsync(
          rows,
          facilityId,
          validationCacheRef.current,
        );
      },

      // Lifecycle hooks
      beforeImport: async () => {
        // Cache was already populated by validateRows — just return it.
        return validationCacheRef.current;
      },

      preCreateUpdate: async (
        row: ActivityDefinitionCsvRow,
        cache: CsvBeforeResult,
      ) => {
        if (!facilityId) throw new Error("Facility ID is required");

        const resolved: ResolvedRow = {
          specimenSlugs: [...row.specimen_slugs],
          observationSlugs: [...row.observation_slugs],
          chargeItemSlugs: [...row.charge_item_slugs],
          locationIds: [],
        };

        // Look up location IDs from cache (populated by validateRows)
        for (const name of row.location_names) {
          const locationId = cache.locationIdMap.get(normalize(name));
          if (locationId) {
            resolved.locationIds.push(locationId);
          }
        }

        // Look up healthcare service ID from cache (populated by validateRows)
        if (row.healthcare_service_name) {
          const hsId = cache.healthcareServiceIdMap.get(
            normalize(row.healthcare_service_name),
          );
          if (hsId) {
            resolved.healthcareServiceId = hsId;
          }
        }

        // Resolve category (upsert with cache)
        const categoryName = row.category_name?.trim();
        if (category?.slug) {
          resolved.categorySlug = category.slug;
        } else if (categoryName) {
          const normalizedCat = normalize(categoryName);
          if (!cache.categorySlugMap.has(normalizedCat)) {
            const catMap = await upsertResourceCategories({
              facilityId,
              categories: [categoryName],
              resourceType: ResourceCategoryResourceType.activity_definition,
              slugPrefix: "ad",
            });
            catMap.forEach((slug, key) => cache.categorySlugMap.set(key, slug));
          }
          resolved.categorySlug =
            cache.categorySlugMap.get(normalizedCat) ?? "";
        }

        return resolved;
      },

      // API operations
      createResource: async (_row, _params, resolved) => {
        if (!facilityId) return;
        const adRow = csvRowToActivityDefinitionRow(_row, resolved);
        await mutate(activityDefinitionApi.createActivityDefinition, {
          pathParams: { facilityId },
        })(toActivityDefinitionDatapoint(adRow, facilityId));
      },

      updateResource: async (existingSlug, row, resolved) => {
        if (!facilityId) return;
        const adRow = csvRowToActivityDefinitionRow(row, resolved);
        await mutate(activityDefinitionApi.updateActivityDefinition, {
          pathParams: {
            facilityId,
            activityDefinitionSlug: existingSlug,
          },
        })(toActivityDefinitionDatapoint(adRow, facilityId, existingSlug));
      },

      // UI
      description:
        "Upload a CSV to import activity definitions. References will be validated during import.",
      uploadHints: [
        `Required: ${AD_REQUIRED_HEADERS.join(", ")}`,
        "Optional: slug_value, specimen_slugs, observation_slugs, location_names, healthcare_service_name",
        "Existing items with same slug will be updated",
      ],
      sampleCsv: AD_SAMPLE_CSV,
      reviewColumns: getReviewColumns(category?.title),
    };
  }, [facilityId, category, createBaseConfig]);

  // ─── Master Import Config ─────────────────────────────────────────
  const masterImportConfig: ImportConfig<ActivityDefinitionRow> = useMemo(
    () => ({
      ...createBaseConfig(),
      reviewColumns: AD_REVIEW_COLUMNS,

      createResource: async (row) => {
        if (!facilityId) return;
        await mutate(activityDefinitionApi.createActivityDefinition, {
          pathParams: { facilityId },
        })(toActivityDefinitionDatapoint(row, facilityId));
      },

      updateResource: async (existingSlug, row) => {
        if (!facilityId) return;
        await mutate(activityDefinitionApi.updateActivityDefinition, {
          pathParams: { facilityId, activityDefinitionSlug: existingSlug },
        })(toActivityDefinitionDatapoint(row, facilityId, existingSlug));
      },
    }),
    [facilityId, createBaseConfig],
  );

  // ─── Resolving Effect (master data path only) ──────────────────────
  useEffect(() => {
    if (activeView.kind !== "resolving") return;
    if (!facilityId) return;

    const { rows } = activeView;

    resolveReferences(rows, facilityId)
      .then(
        ({
          rows: resolvedRows,
          healthcareServices,
          hasUnresolvedHealthcareServices,
        }) => {
          if (hasUnresolvedHealthcareServices) {
            const activityCategories = Array.from(
              new Set(
                resolvedRows
                  .map((r) => r.data.category_name?.trim() ?? "")
                  .filter(Boolean),
              ),
            ).sort();

            setCategoryMappings(
              Object.fromEntries(activityCategories.map((c) => [c, ""])),
            );

            setActiveView({
              kind: "mapping",
              rows: resolvedRows,
              healthcareServices,
              activityCategories,
            });
          } else {
            setActiveView({ kind: "import", processedRows: resolvedRows });
          }
        },
      )
      .catch(() => {
        setActiveView({ kind: "upload" });
      });
  }, [activeView, facilityId]);

  // ─── Handlers ──────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    setActiveView({ kind: "upload" });
  }, []);

  const handleMasterCsvText = useCallback((csvText: string) => {
    const rows = parseMasterCsvToRows(csvText);
    setActiveView({ kind: "resolving", rows });
  }, []);

  const canContinueFromMapping = useMemo(() => {
    if (activeView.kind !== "mapping") return false;
    return activeView.activityCategories.every(
      (category) => categoryMappings[category],
    );
  }, [activeView, categoryMappings]);

  const handleConfirmMapping = useCallback(() => {
    if (activeView.kind !== "mapping") return;
    const updatedRows = applyHealthcareServiceMappings(
      activeView.rows,
      categoryMappings,
    );
    setActiveView({ kind: "import", processedRows: updatedRows });
  }, [activeView, categoryMappings]);

  // ─── Upload / CSV Flow Screen ──────────────────────────────────────
  if (activeView.kind === "upload" || activeView.kind === "csv-flow") {
    const showGrid = activeView.kind === "upload";
    return (
      <div
        className={
          showGrid
            ? "max-w-5xl mx-auto grid gap-6 md:grid-cols-2 items-stretch"
            : ""
        }
      >
        <div className="flex flex-col gap-2">
          {showGrid && (
            <>
              <ResourceCategoryPicker
                facilityId={facilityId || ""}
                resourceType={ResourceCategoryResourceType.activity_definition}
                resourceSubType={ResourceCategorySubType.other}
                value={category?.slug}
                onValueChange={(cat) => {
                  setCategory(cat);
                }}
                placeholder="Select a category (optional, overrides CSV)"
              />
              <label className="text-xs text-gray-500">
                (Optional) Select a category for the activity definitions being
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
            disabledMessage="Manual uploads are disabled because this build includes an activity definition dataset in the repository."
            onStepChange={(step) =>
              setActiveView({ kind: step === "upload" ? "upload" : "csv-flow" })
            }
          />
        </div>

        {/* Master Data Card */}
        {showGrid && (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Import Activity Definitions from dataset
              </CardTitle>
              <CardDescription>
                Import data for Activity Definitions from available master
                dataset.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row gap-4 flex-1">
              <div className="rounded-lg border border-gray-200 px-6 py-12 text-center w-full flex flex-col items-center justify-between">
                <div className="flex flex-col items-center gap-4 flex-1 justify-center">
                  <Database className="h-12 w-12 text-gray-400" />
                  {repoFileAvailable ? (
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
                {repoFileAvailable && (
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
    );
  }

  // ─── Master File Selector ──────────────────────────────────────────
  if (activeView.kind === "master-select") {
    return (
      <MasterDataFileSelector
        title="Activity Definitions"
        files={files["activity-definition"]}
        onFileSelected={(csvText) => handleMasterCsvText(csvText)}
        onBack={handleBack}
      />
    );
  }

  // ─── Resolving References (master data path) ──────────────────────
  if (activeView.kind === "resolving") {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Resolving References
            </CardTitle>
            <CardDescription>
              Validating specimen definitions, observation definitions, charge
              items, locations, and categories…
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Checking {activeView.rows.length} row
              {activeView.rows.length !== 1 ? "s" : ""}. This may take a moment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Healthcare Service Mapping (master data path) ─────────────────
  if (activeView.kind === "mapping") {
    const { activityCategories, healthcareServices } = activeView;

    return (
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Map Activity Categories</CardTitle>
            <CardDescription>
              Assign a Healthcare Service for each Activity Definition category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activityCategories.length === 0 ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No categories detected in the Activity Definition dataset.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {activityCategories.map((category) => (
                  <div
                    key={category}
                    className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold">{category}</p>
                      <p className="text-xs text-gray-500">
                        Select healthcare service for this category.
                      </p>
                    </div>
                    <Select
                      value={categoryMappings[category] ?? ""}
                      onValueChange={(value) =>
                        setCategoryMappings((prev) => ({
                          ...prev,
                          [category]: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-full md:w-72">
                        <SelectValue placeholder="Select healthcare service" />
                      </SelectTrigger>
                      <SelectContent>
                        {healthcareServices.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            {!canContinueFromMapping && activityCategories.length > 0 && (
              <Alert className="mt-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Assign a healthcare service for every category to continue.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleConfirmMapping}
                disabled={!canContinueFromMapping}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Master Data Import Flow ───────────────────────────────────────
  return (
    <ImportFlow
      config={masterImportConfig}
      processedRows={activeView.processedRows}
      onBack={handleBack}
    />
  );
}

// ─── Helpers ────────────────────────────────────────────────────────

function csvRowToActivityDefinitionRow(
  row: ActivityDefinitionCsvRow,
  resolved?: ResolvedRow,
): ActivityDefinitionRow {
  return {
    title: row.title,
    slug_value: row.slug_value,
    description: row.description,
    usage: row.usage,
    status: row.status as Status,
    classification: row.classification as Classification,
    kind: row.kind as Kind,
    code: row.code,
    body_site: row.body_site,
    diagnostic_report_codes: row.diagnostic_report_codes,
    derived_from_uri: row.derived_from_uri || "",
    category_name: row.category_name,
    specimen_slugs: row.specimen_slugs,
    observation_slugs: row.observation_slugs,
    charge_item_slugs: row.charge_item_slugs,
    charge_item_price: row.charge_item_price || "",
    location_names: row.location_names,
    healthcare_service_name: row.healthcare_service_name || "",
    resolved,
  };
}
