import { Database } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { HttpError, request } from "@/apis/request";
import { ImportFlow } from "@/components/imports";
import {
  SD_CSV_REVIEW_COLUMNS,
  SD_HEADER_MAP,
  SD_REQUIRED_HEADERS,
  SD_REVIEW_COLUMNS,
  SD_SAMPLE_CSV,
  SpecimenDefinitionRowSchema,
  parseMasterCsvToRows,
  parseSpecimenDefinitionRow,
  toSpecimenDefinitionCsvPayload,
  toSpecimenDefinitionDatapoint,
  validateSpecimenDefinitionMasterRows,
  validateSpecimenDefinitionRows,
  type SpecimenDefinitionCsvRow,
  type SpecimenDefinitionRow,
} from "@/components/pages/SpecimenDefinition/utils";
import MasterDataFileSelector from "@/components/shared/MasterDataFileSelector";
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
import specimenDefinitionApi from "@/types/emr/specimenDefinition/specimenDefinitionApi";
import { mutate } from "@/Utils/request/mutate";

interface SpecimenDefinitionImportNewProps {
  facilityId?: string;
}

type ActiveView =
  | { kind: "upload" }
  | { kind: "csv-flow" }
  | { kind: "master-select" }
  | {
      kind: "master-import";
      processedRows: ProcessedRow<SpecimenDefinitionRow>[];
    };

/**
 * SpecimenDefinition import page supporting both CSV upload and master data imports.
 *
 * - CSV path: ImportFlow handles upload/validation via config (zod schema)
 * - Master data path: parse → validating (code lookup) → ImportFlow with processedRows
 */
export default function SpecimenDefinitionImportNew({
  facilityId,
}: SpecimenDefinitionImportNewProps) {
  const [activeView, setActiveView] = useState<ActiveView>({ kind: "upload" });

  const { availability, files } = useMasterDataAvailability();
  const hasMasterFiles = availability["specimen-definition"];
  const disableManualUpload = disableOverride && hasMasterFiles;

  // ─── Base Config (shared by CSV and master paths) ─────────────────
  const createBaseConfig = useCallback(() => {
    const base = {
      resourceName: "Specimen Definition" as const,
      resourceNamePlural: "Specimen Definitions" as const,
      getRowIdentifier: (row: { slug_value?: string }) => row.slug_value ?? "",

      checkExists: async (row: { slug_value?: string }) => {
        if (!facilityId) return undefined;
        const slug = `f-${facilityId}-${row.slug_value}`;
        try {
          await request(specimenDefinitionApi.retrieveSpecimenDefinition, {
            pathParams: { facilityId, specimenSlug: slug },
          });
          return slug;
        } catch (error) {
          if (error instanceof HttpError && error.status === 404) {
            return undefined;
          }
          throw error;
        }
      },
    };
    return base;
  }, [facilityId]);

  // ─── CSV Import Config ────────────────────────────────────────────
  const csvImportConfig: ImportConfig<SpecimenDefinitionCsvRow> = useMemo(
    () => ({
      ...createBaseConfig(),

      // CSV parsing
      requiredHeaders: SD_REQUIRED_HEADERS,
      headerMap: SD_HEADER_MAP,
      schema: SpecimenDefinitionRowSchema,
      parseRow: parseSpecimenDefinitionRow,

      // Cross-row validation (async — also validates codes against valueset API)
      validateRows: (rows) => validateSpecimenDefinitionRows(rows),

      // API operations
      createResource: async (row) => {
        if (!facilityId) return;
        await mutate(specimenDefinitionApi.createSpecimenDefinition, {
          pathParams: { facilityId },
        })(toSpecimenDefinitionCsvPayload(row));
      },

      updateResource: async (existingSlug, row) => {
        if (!facilityId) return;
        await mutate(specimenDefinitionApi.updateSpecimenDefinition, {
          pathParams: { facilityId, specimenSlug: existingSlug },
        })(toSpecimenDefinitionCsvPayload(row, existingSlug));
      },

      // UI
      reviewColumns: SD_CSV_REVIEW_COLUMNS,
      description:
        "Upload a CSV to import specimen definitions. Codes will be validated during import.",
      uploadHints: [
        "Required: title, slug_value, description, type_collected (system/code/display)",
        "Existing items with same slug will be updated",
      ],
      sampleCsv: SD_SAMPLE_CSV,
    }),
    [facilityId, createBaseConfig],
  );

  // ─── Master Data Import Config ────────────────────────────────────
  const masterImportConfig: ImportConfig<SpecimenDefinitionRow> = useMemo(
    () => ({
      ...createBaseConfig(),
      reviewColumns: SD_REVIEW_COLUMNS,

      // Cross-row validation (async — validates codes against valueset API)
      validateRows: (rows) => validateSpecimenDefinitionMasterRows(rows),

      createResource: async (row) => {
        if (!facilityId) return;
        await mutate(specimenDefinitionApi.createSpecimenDefinition, {
          pathParams: { facilityId },
        })(toSpecimenDefinitionDatapoint(row));
      },

      updateResource: async (existingSlug, row) => {
        if (!facilityId) return;
        await mutate(specimenDefinitionApi.updateSpecimenDefinition, {
          pathParams: { facilityId, specimenSlug: existingSlug },
        })(toSpecimenDefinitionDatapoint(row, existingSlug));
      },
    }),
    [facilityId, createBaseConfig],
  );

  // ─── Handlers ────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    setActiveView({ kind: "upload" });
  }, []);

  const handleMasterCsvText = useCallback((csvText: string) => {
    const rows = parseMasterCsvToRows(csvText);
    setActiveView({ kind: "master-import", processedRows: rows });
  }, []);

  // ─── Upload Screen ─────────────────────────────────────────────────
  if (activeView.kind === "upload" || activeView.kind === "csv-flow") {
    const showGrid = activeView.kind === "upload";
    return (
      <div
        className={
          showGrid
            ? "max-w-5xl mx-auto grid gap-6 md:grid-cols-2 items-start"
            : ""
        }
      >
        <ImportFlow
          config={csvImportConfig}
          disableUpload={disableManualUpload}
          disabledMessage="Manual uploads are disabled because this build includes a specimen definition dataset in the repository."
          onStepChange={(step) =>
            setActiveView({ kind: step === "upload" ? "upload" : "csv-flow" })
          }
        />
        {/* Master Data Card */}
        {showGrid && (
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Import Specimen Definitions from dataset
              </CardTitle>
              <CardDescription>
                Import data for Specimen Definitions from available master
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
    );
  }

  // ─── Master File Selector ─────────────────────────────────────────
  if (activeView.kind === "master-select") {
    return (
      <MasterDataFileSelector
        title="Specimen Definitions"
        files={files["specimen-definition"]}
        onFileSelected={(csvText) => handleMasterCsvText(csvText)}
        onBack={handleBack}
      />
    );
  }

  // ─── Master Data Import Flow (default) ────────────────────────────
  return (
    <ImportFlow
      config={masterImportConfig}
      processedRows={activeView.processedRows}
      onBack={handleBack}
    />
  );
}
