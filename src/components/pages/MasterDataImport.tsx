import { AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { APIError, queryString, request } from "@/apis/request";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResourceCategoryResourceType } from "@/types/base/resourceCategory/resourceCategory";
import {
  ProductKnowledgeCreate,
  ProductKnowledgeStatus,
} from "@/types/inventory/productKnowledge/productKnowledge";
import {
  parseActivityDefinitionCsv,
  type ActivityDefinitionProcessedRow,
} from "@/utils/masterImport/activityDefinition";
import {
  parseObservationDefinitionCsv,
  type ObservationProcessedRow,
} from "@/utils/masterImport/observationDefinition";
import {
  normalizeProductKnowledgeName,
  parseProductKnowledgeCsv,
  resolveProductKnowledgeDatapoint,
  type ProductKnowledgeProcessedRow,
} from "@/utils/masterImport/productKnowledge";
import {
  parseSpecimenDefinitionCsv,
  type SpecimenProcessedRow,
} from "@/utils/masterImport/specimenDefinition";
import { upsertResourceCategories } from "@/utils/resourceCategory";
import { createSlug } from "@/utils/slug";
import {
  DATASET_ORDER,
  type DatasetId,
  useMasterDataAvailability,
} from "@/hooks/useMasterDataAvailability";

import {
  Preference,
  type ContainerSpec,
  type SpecimenDefinitionCreate,
  type TypeTestedSpec,
} from "@/types/emr/specimenDefinition/specimenDefinition";

interface MasterDataImportProps {
  facilityId?: string;
}

type MasterStep = "datasets" | "mapping" | "confirm" | "importing" | "done";

interface DatasetSummary {
  total: number;
  valid: number;
  invalid: number;
}

interface DatasetResult {
  processed: number;
  created: number;
  updated: number;
  failed: number;
  skipped: number;
  skipped_details?: { rowIndex: number; title?: string; reason: string }[];
  failures: { rowIndex: number; title?: string; reason: string }[];
}

interface HealthcareServiceOption {
  id: string;
  name: string;
}

const DATASET_LABELS: Record<DatasetId, string> = {
  "product-knowledge": "Product Knowledge",
  "specimen-definition": "Specimen Definitions",
  "observation-definition": "Observation Definitions",
  "activity-definition": "Activity Definitions",
};

const normalizeName = (value: string) => value.trim().toLowerCase();

const buildSummary = (rows: { errors: string[] }[]): DatasetSummary => {
  const valid = rows.filter((row) => row.errors.length === 0).length;
  return { total: rows.length, valid, invalid: rows.length - valid };
};

const emptyResult = (): DatasetResult => ({
  processed: 0,
  created: 0,
  updated: 0,
  failed: 0,
  skipped: 0,
  skipped_details: [],
  failures: [],
});

/**
 * Try to GET an existing record by its slug and return its external_id.
 * Returns undefined if the record doesn't exist (404).
 */
const fetchExistingId = async (
  detailPath: string,
): Promise<string | undefined> => {
  try {
    const existing = await request<{ id: string }>(detailPath, {
      method: "GET",
    });
    return existing.id;
  } catch (error) {
    if (error instanceof APIError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
};

const stripMappingErrors = (errors: string[]) =>
  errors.filter(
    (error) =>
      !error.startsWith("Unknown specimen:") &&
      !error.startsWith("Unknown observation:") &&
      !error.startsWith("Unknown charge item:") &&
      !error.startsWith("Unknown location:") &&
      !error.startsWith("Unknown healthcare service:"),
  );

const cleanContainerData = (container?: ContainerSpec | null) => {
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
};


export default function MasterDataImport({
  facilityId,
}: MasterDataImportProps) {
  const [currentStep, setCurrentStep] = useState<MasterStep>("datasets");
  const {
    status: manifestStatus,
    error: manifestError,
    files: manifestFiles,
    availability: manifestAvailability,
  } = useMasterDataAvailability();
  const [selectedDatasets, setSelectedDatasets] = useState<
    Record<DatasetId, boolean>
  >({
    "product-knowledge": false,
    "specimen-definition": false,
    "observation-definition": false,
    "activity-definition": false,
  });
  const [datasetSummaries, setDatasetSummaries] = useState<
    Partial<Record<DatasetId, DatasetSummary>>
  >({});
  const [datasetErrors, setDatasetErrors] = useState<
    Partial<Record<DatasetId, string>>
  >({});
  const [processedData, setProcessedData] = useState<{
    productKnowledge?: ProductKnowledgeProcessedRow[];
    specimenDefinitions?: SpecimenProcessedRow[];
    observationDefinitions?: ObservationProcessedRow[];
    activityDefinitions?: ActivityDefinitionProcessedRow[];
  }>({});
  const [categoryMappings, setCategoryMappings] = useState<
    Record<string, string>
  >({});
  const [healthcareServices, setHealthcareServices] = useState<
    HealthcareServiceOption[]
  >([]);
  const [importResults, setImportResults] = useState<
    Partial<Record<DatasetId, DatasetResult>>
  >({});
  const [importingDataset, setImportingDataset] = useState<DatasetId | null>(
    null,
  );
  const [importProgress, setImportProgress] = useState<{
    processed: number;
    total: number;
  }>({ processed: 0, total: 0 });


  useEffect(() => {
    if (!selectedDatasets["activity-definition"]) {
      setCategoryMappings({});
    }
  }, [selectedDatasets["activity-definition"]]);

  const datasetFileAvailable = (datasetId: DatasetId): boolean =>
    Boolean(manifestAvailability[datasetId]);

  const datasetFileLabel = (datasetId: DatasetId) =>
    manifestFiles[datasetId]
      ? manifestFiles[datasetId].split("/").pop()
      : "Missing";

  const loadDatasetText = async (datasetId: DatasetId) => {
    const url = manifestFiles[datasetId];
    if (!url) throw new Error("Dataset file missing");
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Unable to fetch ${DATASET_LABELS[datasetId]} CSV`);
    }
    return await response.text();
  };

  useEffect(() => {
    const parseSelected = async () => {
      const updatedSummaries: Partial<Record<DatasetId, DatasetSummary>> = {};
      const updatedErrors: Partial<Record<DatasetId, string>> = {};

      const updatedData: {
        productKnowledge?: ProductKnowledgeProcessedRow[];
        specimenDefinitions?: SpecimenProcessedRow[];
        observationDefinitions?: ObservationProcessedRow[];
        activityDefinitions?: ActivityDefinitionProcessedRow[];
      } = {};

      const parseDataset = async (datasetId: DatasetId) => {
        if (!selectedDatasets[datasetId]) return;
        if (!datasetFileAvailable(datasetId)) return;

        try {
          const csvText = await loadDatasetText(datasetId);
          switch (datasetId) {
            case "product-knowledge": {
              const rows = parseProductKnowledgeCsv(csvText);
              updatedData.productKnowledge = rows;
              updatedSummaries[datasetId] = buildSummary(rows);
              break;
            }
            case "specimen-definition": {
              const rows = parseSpecimenDefinitionCsv(csvText);
              updatedData.specimenDefinitions = rows;
              updatedSummaries[datasetId] = buildSummary(rows);
              break;
            }
            case "observation-definition": {
              const rows = parseObservationDefinitionCsv(csvText);
              updatedData.observationDefinitions = rows;
              updatedSummaries[datasetId] = buildSummary(rows);
              break;
            }
            case "activity-definition": {
              const rows = parseActivityDefinitionCsv(csvText);
              updatedData.activityDefinitions = rows;
              updatedSummaries[datasetId] = buildSummary(rows);
              break;
            }
          }
          updatedErrors[datasetId] = "";
        } catch (error) {
          updatedErrors[datasetId] =
            error instanceof Error
              ? error.message
              : "Error processing CSV file";
          updatedSummaries[datasetId] = { total: 0, valid: 0, invalid: 0 };
        }
      };

      for (const datasetId of DATASET_ORDER) {
        await parseDataset(datasetId);
      }

      setProcessedData(updatedData);
      setDatasetSummaries(updatedSummaries);
      setDatasetErrors(updatedErrors);
    };

    parseSelected();
  }, [selectedDatasets, manifestFiles, manifestAvailability, facilityId]);

  const activityCategories = useMemo(() => {
    const categories = new Set<string>();
    processedData.activityDefinitions?.forEach((row) => {
      const name = row.data.category_name.trim();
      if (name) categories.add(name);
    });
    return Array.from(categories).sort();
  }, [processedData.activityDefinitions]);

  useEffect(() => {
    setCategoryMappings((prev) => {
      const next = { ...prev };
      activityCategories.forEach((category) => {
        if (!next[category]) {
          next[category] = "";
        }
      });
      Object.keys(next).forEach((category) => {
        if (!activityCategories.includes(category)) {
          delete next[category];
        }
      });
      return next;
    });
  }, [activityCategories]);

  useEffect(() => {
    if (currentStep !== "mapping") return;
    if (!facilityId) return;

    const loadHealthcareServices = async () => {
      try {
        const response = await request<{ results: HealthcareServiceOption[] }>(
          `/api/v1/facility/${facilityId}/healthcare_service/${queryString({
            limit: 200,
          })}`,
          { method: "GET" },
        );
        setHealthcareServices(response.results || []);
      } catch {
        setHealthcareServices([]);
      }
    };

    loadHealthcareServices();
  }, [currentStep, facilityId]);

  const steps = useMemo(() => {
    const base: MasterStep[] = ["datasets"];
    if (selectedDatasets["activity-definition"]) {
      base.push("mapping");
    }
    base.push("confirm", "importing", "done");
    return base;
  }, [selectedDatasets]);

  const currentStepIndex = steps.indexOf(currentStep);
  const progressValue =
    currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;

  const canContinueFromDatasets = useMemo(() => {
    const chosen = DATASET_ORDER.filter((dataset) => selectedDatasets[dataset]);
    if (!chosen.length) return false;
    const missingFile = chosen.some(
      (dataset) => !datasetFileAvailable(dataset),
    );
    if (missingFile) return false;
    return true;
  }, [selectedDatasets, manifestAvailability]);

  const canContinueFromMapping = useMemo(() => {
    if (!selectedDatasets["activity-definition"]) return true;
    if (!activityCategories.length) return false;
    return activityCategories.every((category) => categoryMappings[category]);
  }, [activityCategories, categoryMappings, selectedDatasets]);

  const handleDatasetToggle = (datasetId: DatasetId) => {
    setSelectedDatasets((prev) => ({
      ...prev,
      [datasetId]: !prev[datasetId],
    }));
  };

  const goToNext = () => {
    if (currentStep === "datasets") {
      if (selectedDatasets["activity-definition"]) {
        setCurrentStep("mapping");
      } else {
        setCurrentStep("confirm");
      }
      return;
    }

    if (currentStep === "mapping") {
      setCurrentStep("confirm");
    }
  };

  const goToPrevious = () => {
    if (currentStep === "datasets") {
      return;
    }
    if (currentStep === "mapping") {
      setCurrentStep("datasets");
      return;
    }
    if (currentStep === "confirm") {
      if (selectedDatasets["activity-definition"]) {
        setCurrentStep("mapping");
      } else {
        setCurrentStep("datasets");
      }
    }
  };

  const resolveActivityMappings = async (
    rows: ActivityDefinitionProcessedRow[],
    facilityId: string,
  ) => {
    const issues: string[] = [];
    const specimenMap: Record<string, string> = {};
    const observationMap: Record<string, string> = {};
    const locationMap: Record<string, string> = {};

    const uniqueSpecimens = new Set<string>();
    const uniqueObservations = new Set<string>();
    const uniqueLocations = new Set<string>();

    rows.forEach((row) => {
      row.data.specimen_names.forEach((name) => uniqueSpecimens.add(name));
      row.data.observation_names.forEach((name) =>
        uniqueObservations.add(name),
      );
      row.data.location_names.forEach((name) => uniqueLocations.add(name));
    });

    await Promise.all(
      Array.from(uniqueSpecimens).map(async (name) => {
        const response = await request<{
          results: { title: string; slug: string }[];
        }>(
          `/api/v1/facility/${facilityId}/specimen_definition/${queryString({
            title: name,
            limit: 10,
          })}`,
          { method: "GET" },
        );
        const match = response.results.find(
          (item) => normalizeName(item.title) === normalizeName(name),
        );
        if (match) {
          specimenMap[normalizeName(name)] = match.slug;
        } else {
          issues.push(`Specimen not found: ${name}`);
        }
      }),
    );

    await Promise.all(
      Array.from(uniqueObservations).map(async (name) => {
        const response = await request<{
          results: { title: string; slug: string }[];
        }>(
          `/api/v1/observation_definition/${queryString({
            facility: facilityId,
            title: name,
            limit: 10,
          })}`,
          { method: "GET" },
        );
        const match = response.results.find(
          (item) => normalizeName(item.title) === normalizeName(name),
        );
        if (match) {
          observationMap[normalizeName(name)] = match.slug;
        } else {
          issues.push(`Observation not found: ${name}`);
        }
      }),
    );

    await Promise.all(
      Array.from(uniqueLocations).map(async (name) => {
        const response = await request<{
          results: { name: string; id: string }[];
        }>(
          `/api/v1/facility/${facilityId}/location/${queryString({
            name,
            limit: 50,
          })}`,
          { method: "GET" },
        );
        const match = response.results.find(
          (item) => normalizeName(item.name) === normalizeName(name),
        );
        if (match) {
          locationMap[normalizeName(name)] = match.id;
        } else {
          issues.push(`Location not found: ${name}`);
        }
      }),
    );

    const resolvedRows = rows.map((row) => {
      const updatedErrors = stripMappingErrors(row.errors);
      const resolved = {
        specimenSlugs: [] as string[],
        observationSlugs: [] as string[],
        locationIds: [] as string[],
        healthcareServiceId: categoryMappings[row.data.category_name] ?? null,
      };

      row.data.specimen_names.forEach((name) => {
        const slug = specimenMap[normalizeName(name)];
        if (!slug) {
          updatedErrors.push(`Unknown specimen: ${name}`);
        } else {
          resolved.specimenSlugs.push(slug);
        }
      });

      row.data.observation_names.forEach((name) => {
        const slug = observationMap[normalizeName(name)];
        if (!slug) {
          updatedErrors.push(`Unknown observation: ${name}`);
        } else {
          resolved.observationSlugs.push(slug);
        }
      });

      row.data.location_names.forEach((name) => {
        const id = locationMap[normalizeName(name)];
        if (!id) {
          updatedErrors.push(`Unknown location: ${name}`);
        } else {
          resolved.locationIds.push(id);
        }
      });

      const healthcareServiceId = resolved.healthcareServiceId;
      if (!healthcareServiceId) {
        updatedErrors.push(
          `Unknown healthcare service: ${row.data.category_name}`,
        );
      }

      return {
        ...row,
        errors: updatedErrors,
        resolved,
      };
    });

    return { resolvedRows, issues };
  };

  const runImport = async () => {
    if (!facilityId) return;

    setCurrentStep("importing");
    setImportResults({});

    const results: Partial<Record<DatasetId, DatasetResult>> = {};

    const updateProgress = (processed: number, total: number) => {
      setImportProgress({ processed, total });
    };

    const recordResult = (datasetId: DatasetId, next: DatasetResult) => {
      results[datasetId] = next;
      setImportResults({ ...results });
    };

    if (
      selectedDatasets["product-knowledge"] &&
      processedData.productKnowledge
    ) {
      setImportingDataset("product-knowledge");
      updateProgress(0, processedData.productKnowledge.length);
      const result = emptyResult();
      const validRows = processedData.productKnowledge.filter(
        (row) => row.errors.length === 0 && row.normalized,
      );
      const resourceCategories = [
        ...new Set(validRows.map((row) => row.normalized!.resourceCategory)),
      ];

      const categorySlugMap = await upsertResourceCategories({
        facilityId,
        categories: resourceCategories,
        resourceType: ResourceCategoryResourceType.product_knowledge,
        slugPrefix: "pk",
      });

      for (const row of validRows) {
        const datapoint = await resolveProductKnowledgeDatapoint(
          row.normalized!,
        );

        const categorySlug =
          categorySlugMap.get(
            normalizeProductKnowledgeName(datapoint.resourceCategory),
          ) ||
          `f-${facilityId}-pk-${await createSlug(datapoint.resourceCategory)}`;

        const payload: ProductKnowledgeCreate = {
          slug_value: datapoint.slug,
          name: datapoint.name,
          facility: facilityId,
          product_type: datapoint.productType,
          status: ProductKnowledgeStatus.active,
          base_unit: datapoint.baseUnit,
          category: categorySlug,
          names: [],
          storage_guidelines: [],
          is_instance_level: false,
        };

        if (datapoint.code) {
          payload.code = datapoint.code;
        }

        if (datapoint.dosageForm) {
          payload.definitional = {
            dosage_form: datapoint.dosageForm,
            intended_routes: datapoint.intendedRoutes,
            ingredients: [],
            nutrients: [],
            drug_characteristic: [],
          };
        }

        if (datapoint.alternateIdentifier) {
          payload.alternate_identifier = datapoint.alternateIdentifier;
        }

        if (datapoint.alternateNameType && datapoint.alternateNameValue) {
          payload.names = [
            {
              name_type: datapoint.alternateNameType,
              name: datapoint.alternateNameValue,
            },
          ];
        }

        try {
          const existingId = await fetchExistingId(
            `/api/v1/product_knowledge/f-${facilityId}-${payload.slug_value}/`,
          );
          if (existingId) {
            await request(
              `/api/v1/product_knowledge/f-${facilityId}-${payload.slug_value}/`,
              {
                method: "PUT",
                body: JSON.stringify(payload),
              },
            );
            result.updated += 1;
          } else {
            await request("/api/v1/product_knowledge/", {
              method: "POST",
              body: JSON.stringify(payload),
            });
            result.created += 1;
          }
          result.processed += 1;
        } catch (error) {
          const reason =
            error instanceof Error ? error.message : "Unknown error";
          result.processed += 1;
          result.failed += 1;
          result.failures.push({
            rowIndex: row.rowIndex,
            title: datapoint.name,
            reason,
          });
        }
        updateProgress(result.processed, validRows.length);
      }

      recordResult("product-knowledge", result);
    }

    if (
      selectedDatasets["specimen-definition"] &&
      processedData.specimenDefinitions
    ) {
      setImportingDataset("specimen-definition");
      updateProgress(0, processedData.specimenDefinitions.length);
      const result = emptyResult();
      const validRows = processedData.specimenDefinitions.filter(
        (row) => row.errors.length === 0,
      );
      result.skipped =
        processedData.specimenDefinitions.length - validRows.length;

      for (const row of validRows) {
        try {
          const rawSlug = row.data.slug_value?.trim();
          const slug = rawSlug ? rawSlug : await createSlug(row.data.title, 25);
          const detailSlug = `f-${facilityId}-${slug}`;

          const hasTypeTested =
            row.data.is_derived !== undefined ||
            row.data.preference !== undefined ||
            row.data.single_use !== undefined ||
            row.data.requirement ||
            row.data.retention_time ||
            row.data.container;

          const typeTested: TypeTestedSpec | undefined = hasTypeTested
            ? {
                is_derived: row.data.is_derived ?? false,
                preference:
                  (row.data.preference as Preference) ?? Preference.preferred,
                single_use: row.data.single_use ?? false,
                requirement: row.data.requirement || undefined,
                retention_time: row.data.retention_time || undefined,
                container: cleanContainerData(row.data.container),
              }
            : undefined;

          const payload: SpecimenDefinitionCreate = {
            slug_value: slug,
            title: row.data.title,
            status: row.data.status,
            description: row.data.description,
            derived_from_uri: row.data.derived_from_uri || undefined,
            type_collected: row.data.type_collected,
            patient_preparation: [],
            collection: row.data.collection || undefined,
            type_tested: typeTested,
          };

          const detailPath = `/api/v1/facility/${facilityId}/specimen_definition/${detailSlug}/`;
          const existingId = await fetchExistingId(detailPath);
          const upsertPath = `/api/v1/facility/${facilityId}/specimen_definition/upsert/`;
          const datapoint = existingId
            ? { ...payload, id: `f-${facilityId}-${slug}` }
            : payload;
          await request(upsertPath, {
            method: "POST",
            body: JSON.stringify({ datapoints: [datapoint] }),
          });
          if (existingId) {
            result.updated += 1;
          } else {
            result.created += 1;
          }
          result.processed += 1;
        } catch (error) {
          const reason =
            error instanceof Error ? error.message : "Unknown error";
          result.processed += 1;
          result.failed += 1;
          result.failures.push({
            rowIndex: row.rowIndex,
            title: row.data.title,
            reason,
          });
        }
        updateProgress(result.processed, validRows.length);
      }

      recordResult("specimen-definition", result);
    }

    if (
      selectedDatasets["observation-definition"] &&
      processedData.observationDefinitions
    ) {
      setImportingDataset("observation-definition");
      updateProgress(0, processedData.observationDefinitions.length);
      const result = emptyResult();
      const validRows = processedData.observationDefinitions.filter(
        (row) => row.errors.length === 0,
      );
      result.skipped =
        processedData.observationDefinitions.length - validRows.length;

      for (const row of validRows) {
        try {
          const slug = await createSlug(row.data.title, 25);
          const detailSlug = `f-${facilityId}-${slug}`;
          const payload = {
            slug_value: slug,
            title: row.data.title,
            status: row.data.status,
            description: row.data.description,
            category: row.data.category,
            code: row.data.code,
            permitted_data_type: row.data.permitted_data_type,
            component: row.data.component,
            body_site: row.data.body_site,
            method: row.data.method,
            permitted_unit: row.data.permitted_unit,
            derived_from_uri: row.data.derived_from_uri || undefined,
            facility: facilityId,
            qualified_ranges: row.data.qualified_ranges ?? [],
          };

          const upsertPath = "/api/v1/observation_definition/upsert/";
          const detailPath = `/api/v1/observation_definition/${detailSlug}/${queryString({ facility: facilityId })}`;
          const existingId = await fetchExistingId(detailPath);
          // observation_definition uses lookup_field="slug", so id = slug
          const datapoint = existingId
            ? { ...payload, id: `f-${facilityId}-${slug}` }
            : payload;
          await request(upsertPath, {
            method: "POST",
            body: JSON.stringify({ datapoints: [datapoint] }),
          });
          if (existingId) {
            result.updated += 1;
          } else {
            result.created += 1;
          }
          result.processed += 1;
        } catch (error) {
          const reason =
            error instanceof Error ? error.message : "Unknown error";
          result.processed += 1;
          result.failed += 1;
          result.failures.push({
            rowIndex: row.rowIndex,
            title: row.data.title,
            reason,
          });
        }
        updateProgress(result.processed, validRows.length);
      }

      recordResult("observation-definition", result);
    }

    if (
      selectedDatasets["activity-definition"] &&
      processedData.activityDefinitions
    ) {
      setImportingDataset("activity-definition");
      updateProgress(0, processedData.activityDefinitions.length);
      const result = emptyResult();
      const resolved = await resolveActivityMappings(
        processedData.activityDefinitions,
        facilityId,
      );
      const validRows = resolved.resolvedRows.filter(
        (row) => row.errors.length === 0,
      );
      const skippedRows = resolved.resolvedRows.filter(
        (row) => row.errors.length > 0,
      );
      result.skipped = skippedRows.length;
      result.skipped_details = skippedRows.map((row) => ({
        rowIndex: row.rowIndex,
        title: row.data.title,
        reason: row.errors.join("; "),
      }));

      const categorySlugMap = await upsertResourceCategories({
        facilityId,
        categories: Array.from(
          new Set(validRows.map((row) => row.data.category_name)),
        ),
        resourceType: ResourceCategoryResourceType.activity_definition,
        slugPrefix: "ad",
      });

      for (const row of validRows) {
        try {
          const rawSlug = row.data.slug_value?.trim();
          const slug = rawSlug ? rawSlug : await createSlug(row.data.title, 25);
          const detailSlug = `f-${facilityId}-${slug}`;

          const categorySlug =
            categorySlugMap.get(normalizeName(row.data.category_name)) || "";

          const payload = {
            slug_value: slug,
            title: row.data.title,
            status: row.data.status,
            description: row.data.description,
            usage: row.data.usage,
            classification: row.data.classification,
            kind: row.data.kind,
            code: row.data.code,
            body_site: row.data.body_site,
            diagnostic_report_codes: row.data.diagnostic_report_codes,
            derived_from_uri: row.data.derived_from_uri || undefined,
            facility: facilityId,
            specimen_requirements: row.resolved?.specimenSlugs ?? [],
            observation_result_requirements:
              row.resolved?.observationSlugs ?? [],
            charge_item_definitions: [],
            locations: [],
            category: categorySlug,
            healthcare_service: row.resolved?.healthcareServiceId ?? null,
          };

          const detailPath = `/api/v1/facility/${facilityId}/activity_definition/${detailSlug}/`;
          const existingId = await fetchExistingId(detailPath);
          const upsertPath = `/api/v1/facility/${facilityId}/activity_definition/upsert/`;
          const datapoint = existingId
            ? { ...payload, id: `f-${facilityId}-${slug}` }
            : payload;
          await request(upsertPath, {
            method: "POST",
            body: JSON.stringify({ datapoints: [datapoint] }),
          });
          if (existingId) {
            result.updated += 1;
          } else {
            result.created += 1;
          }

          result.processed += 1;
        } catch (error) {
          const reason =
            error instanceof Error ? error.message : "Unknown error";
          result.processed += 1;
          result.failed += 1;
          result.failures.push({
            rowIndex: row.rowIndex,
            title: row.data.title,
            reason,
          });
        }
        updateProgress(result.processed, validRows.length);
      }

      recordResult("activity-definition", result);
    }

    setImportingDataset(null);
    setCurrentStep("done");
  };

  if (currentStep === "datasets") {
    return (
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Select master datasets
            </CardTitle>
            <CardDescription>
              Choose which master datasets to import from /public/master-data.
            </CardDescription>
            <div className="mt-4">
              <Progress value={progressValue} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            {manifestStatus === "error" && (
              <Alert className="mb-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{manifestError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              {DATASET_ORDER.map((datasetId) => {
                const isDisabled = !datasetFileAvailable(datasetId);
                const summary = datasetSummaries[datasetId];
                const error = datasetErrors[datasetId];
                const isSelected = selectedDatasets[datasetId];

                return (
                  <div
                    key={datasetId}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={isSelected}
                          onChange={() => handleDatasetToggle(datasetId)}
                          disabled={isDisabled}
                        />
                        <div>
                          <p className="text-sm font-semibold">
                            {DATASET_LABELS[datasetId]}
                          </p>
                          <p className="text-xs text-gray-500">
                            CSV file required for this dataset.
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            File: {datasetFileLabel(datasetId)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {summary && (
                          <>
                            <Badge variant="outline">
                              Total {summary.total}
                            </Badge>
                            <Badge variant="primary">
                              Valid {summary.valid}
                            </Badge>
                            <Badge variant="secondary">
                              Invalid {summary.invalid}
                            </Badge>
                          </>
                        )}
                        {!summary && datasetFileAvailable(datasetId) && (
                          <Badge variant="outline">Ready to parse</Badge>
                        )}
                        {!datasetFileAvailable(datasetId) && (
                          <Badge variant="secondary">Missing file</Badge>
                        )}
                      </div>
                    </div>

                    {error && (
                      <Alert className="mt-3" variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                );
              })}
            </div>

            {!canContinueFromDatasets && (
              <Alert className="mt-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Select at least one dataset and ensure files are available.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={goToPrevious}>
                Back
              </Button>
              <Button onClick={goToNext} disabled={!canContinueFromDatasets}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "mapping") {
    return (
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Map Activity Categories</CardTitle>
            <CardDescription>
              Assign a Healthcare Service for each Activity Definition category.
            </CardDescription>
            <div className="mt-4">
              <Progress value={progressValue} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            {activityCategories.length === 0 ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No categories detected in the Activity Definition CSV.
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

            {!canContinueFromMapping && (
              <Alert className="mt-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Assign a healthcare service for every category to continue.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={goToPrevious}>
                Back
              </Button>
              <Button onClick={goToNext} disabled={!canContinueFromMapping}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "confirm") {
    return (
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Confirm Master Import</CardTitle>
            <CardDescription>
              Review the selected datasets before starting the import.
            </CardDescription>
            <div className="mt-4">
              <Progress value={progressValue} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This action will overwrite existing master data for selected
                datasets. Ensure your files are correct before continuing.
              </AlertDescription>
            </Alert>

            <div className="mt-4 space-y-3">
              {DATASET_ORDER.filter((dataset) => selectedDatasets[dataset]).map(
                (dataset) => (
                  <div
                    key={dataset}
                    className="flex items-center justify-between rounded-md border border-gray-100 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {DATASET_LABELS[dataset]}
                      </p>
                      <p className="text-xs text-gray-500">
                        File: {datasetFileLabel(dataset)}
                      </p>
                    </div>
                    {datasetSummaries[dataset] && (
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          {datasetSummaries[dataset]?.valid ?? 0} valid
                        </Badge>
                        <Badge variant="secondary">
                          {datasetSummaries[dataset]?.invalid ?? 0} invalid
                        </Badge>
                      </div>
                    )}
                  </div>
                ),
              )}
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={goToPrevious}>
                Back
              </Button>
              <Button onClick={runImport}>Start Import</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "importing") {
    const progressPercent =
      importProgress.total > 0
        ? (importProgress.processed / importProgress.total) * 100
        : 0;
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Importing Master Data</CardTitle>
            <CardDescription>
              {importingDataset
                ? `Processing ${DATASET_LABELS[importingDataset]}`
                : "Preparing import"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercent} className="h-2" />
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Badge variant="outline">
                Processed: {importProgress.processed}
              </Badge>
              <Badge variant="primary">Total: {importProgress.total}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Master Data Import Complete</CardTitle>
          <CardDescription>
            Review the results for each dataset below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DATASET_ORDER.filter((dataset) => selectedDatasets[dataset]).map(
              (dataset) => {
                const result = importResults[dataset];
                return (
                  <div
                    key={dataset}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          {DATASET_LABELS[dataset]}
                        </p>
                        <p className="text-xs text-gray-500">
                          Processed {result?.processed ?? 0}
                        </p>
                      </div>
                      {result && result.failed === 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" />
                          Success
                        </span>
                      ) : (
                        <Badge variant="secondary">Needs review</Badge>
                      )}
                    </div>
                    {result && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="primary">
                          Created {result.created}
                        </Badge>
                        <Badge variant="secondary">
                          Updated {result.updated}
                        </Badge>
                        <Badge variant="secondary">
                          Failed {result.failed}
                        </Badge>
                        <Badge variant="outline">
                          Skipped {result.skipped}
                        </Badge>
                      </div>
                    )}
                    {result?.failures.length ||
                    result?.skipped_details?.length ? (
                      <Alert className="mt-3" variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {result.failures.slice(0, 5).map((failure) => (
                            <div
                              key={`failure-${failure.rowIndex}-${failure.title ?? ""}`}
                            >
                              Row {failure.rowIndex}: {failure.reason}
                            </div>
                          ))}
                          {result.skipped_details
                            ?.slice(0, 5)
                            .map((skipped) => (
                              <div
                                key={`skipped-${skipped.rowIndex}-${skipped.title ?? ""}`}
                              >
                                Row {skipped.rowIndex}: {skipped.reason}
                              </div>
                            ))}
                        </AlertDescription>
                      </Alert>
                    ) : null}
                  </div>
                );
              },
            )}
          </div>

          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep("datasets");
                setSelectedDatasets({
                  "product-knowledge": false,
                  "specimen-definition": false,
                  "observation-definition": false,
                  "activity-definition": false,
                });
                setDatasetSummaries({});
                setDatasetErrors({});
                setProcessedData({});
                setImportResults({});
                setImportProgress({ processed: 0, total: 0 });
              }}
            >
              Start Another Import
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
