import { AlertCircle, Database, Upload } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { ImportFlow } from "@/components/imports";
import {
  OBS_DEF_REVIEW_COLUMNS,
  parseMasterCsvToRows,
  toObservationDefinitionDatapoint,
  type ObservationDefinitionRow,
} from "@/components/pages/ObservationDefinition/utils";
import MasterDataFileSelector from "@/components/shared/MasterDataFileSelector";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import observationDefinitionApi from "@/types/emr/observationDefinition/observationDefinitionApi";
import { batchFetchAll } from "@/Utils/importHelpers";
import {
  generateSampleComponentsCsv,
  generateSampleDefinitionsCsv,
} from "@/Utils/observationDefinitionConstants";
import { mutate } from "@/Utils/request/mutate";

interface ObservationDefinitionImportNewProps {
  facilityId?: string;
}

type ActiveView =
  | { kind: "upload" }
  | { kind: "master-select" }
  | { kind: "import"; processedRows: ProcessedRow<ObservationDefinitionRow>[] };

/**
 * Detect which of two CSV texts is definitions vs components.
 * The components CSV contains an "observation_slug" header.
 */
function detectCsvPair(
  texts: string[],
): { defsCsvText: string; compCsvText: string | undefined } | undefined {
  let defsCsvText: string | undefined = undefined;
  let compCsvText: string | undefined = undefined;

  for (const text of texts) {
    const firstLine = text.split(/\r?\n/)[0] ?? "";
    const headers = firstLine.toLowerCase().replace(/[^a-z0-9_,]/g, "");
    if (headers.includes("observation_slug")) {
      compCsvText = text;
    } else {
      defsCsvText = text;
    }
  }

  if (texts.length === 2 && (!defsCsvText || !compCsvText)) return undefined;

  if (!defsCsvText) return undefined;
  return { defsCsvText, compCsvText };
}

function downloadSampleCsvs() {
  const defsCsv = generateSampleDefinitionsCsv();
  const defsBlob = new Blob([defsCsv], { type: "text/csv" });
  const defsUrl = window.URL.createObjectURL(defsBlob);
  const defsLink = document.createElement("a");
  defsLink.href = defsUrl;
  defsLink.download = "sample_observation_definitions.csv";
  defsLink.click();
  window.URL.revokeObjectURL(defsUrl);

  const compCsv = generateSampleComponentsCsv();
  const compBlob = new Blob([compCsv], { type: "text/csv" });
  const compUrl = window.URL.createObjectURL(compBlob);
  const compLink = document.createElement("a");
  compLink.href = compUrl;
  compLink.download = "sample_observation_components.csv";
  compLink.click();
  window.URL.revokeObjectURL(compUrl);
}

/**
 * ObservationDefinition import page supporting both CSV upload and master data imports.
 *
 * Both paths converge on the same ImportFlow after parsing, since OD always
 * needs two files (definitions + components) and has a single upsert API endpoint.
 *
 * Flow options:
 * - CSV: user selects 2 files → auto-detect defs/components → ImportFlow with processedRows
 * - Master: MasterDataFileSelector (selectCount=2) → auto-detect → ImportFlow with processedRows
 */
export default function ObservationDefinitionImportNew({
  facilityId,
}: ObservationDefinitionImportNewProps) {
  const [activeView, setActiveView] = useState<ActiveView>({ kind: "upload" });
  const [uploadError, setUploadError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const { availability, files } = useMasterDataAvailability();
  const repoFileAvailable = availability["observation-definition"];
  const disableManualUpload = disableOverride && repoFileAvailable;

  // ─── Import Config (shared by both CSV and master paths) ──────────
  // Closure-scoped cache for existing slugs, populated by beforeImport
  const importConfig: ImportConfig<
    ObservationDefinitionRow,
    void,
    Set<string>
  > = useMemo(() => {
    let existingSlugsCache: Set<string> | null = null;

    return {
      resourceName: "Observation Definition",
      resourceNamePlural: "Observation Definitions",
      reviewColumns: OBS_DEF_REVIEW_COLUMNS,
      getRowIdentifier: (row) => row.slug_value,

      beforeImport: async () => {
        if (!facilityId) return new Set<string>();
        const results = await batchFetchAll<{ slug: string }>(
          observationDefinitionApi.listObservationDefinition,
          { queryParams: { facility: facilityId } },
        );
        existingSlugsCache = new Set(results.map((item) => item.slug));
        return existingSlugsCache;
      },

      checkExists: async (row) => {
        if (!facilityId) return undefined;
        const slug = `f-${facilityId}-${row.slug_value}`;
        if (existingSlugsCache) {
          return existingSlugsCache.has(slug) ? slug : undefined;
        }
      },

      createResource: async (row) => {
        if (!facilityId) return;
        await mutate(observationDefinitionApi.createObservationDefinition)(
          toObservationDefinitionDatapoint(row, facilityId),
        );
      },

      updateResource: async (existingSlug, row) => {
        if (!facilityId) return;
        await mutate(observationDefinitionApi.updateObservationDefinition, {
          pathParams: { observationSlug: existingSlug },
        })(toObservationDefinitionDatapoint(row, facilityId, existingSlug));
      },
    };
  }, [facilityId]);

  // ─── Handlers ────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    setActiveView({ kind: "upload" });
    setUploadedFileName("");
    setUploadError("");
  }, []);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disableManualUpload) {
        setUploadError(
          "Manual uploads are disabled because observation definition data is bundled with this build.",
        );
        setUploadedFileName("");
        return;
      }

      const fileList = event.target.files;
      if (!fileList || fileList.length === 0) return;

      const csvFiles = Array.from(fileList).filter(
        (f) => f.type === "text/csv" || f.name.endsWith(".csv"),
      );

      if (csvFiles.length === 0) {
        setUploadError("Please upload valid CSV files");
        setUploadedFileName("");
        return;
      }

      Promise.all(
        csvFiles.map(
          (file) =>
            new Promise<{ name: string; text: string }>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (e) =>
                resolve({ name: file.name, text: e.target?.result as string });
              reader.onerror = () =>
                reject(new Error(`Error reading ${file.name}`));
              reader.readAsText(file);
            }),
        ),
      )
        .then((results) => {
          const pair = detectCsvPair(results.map((r) => r.text));

          if (!pair) {
            setUploadError(
              'Could not detect which file is definitions vs components. Make sure one file has an "observation_slug" header.',
            );
            setUploadedFileName("");
            return;
          }

          setUploadError("");
          setUploadedFileName(results.map((r) => r.name).join(", "));
          setActiveView({
            kind: "import",
            processedRows: parseMasterCsvToRows(
              pair.defsCsvText,
              pair.compCsvText,
            ),
          });
        })
        .catch(() => setUploadError("Error reading CSV files"));
    },
    [disableManualUpload],
  );

  // ─── Upload Screen ────────────────────────────────────────────────
  if (activeView.kind === "upload") {
    return (
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2 items-start">
        {/* CSV Upload Card */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Observation Definitions from CSV
            </CardTitle>
            <CardDescription>
              Upload CSV files to create observation definitions and validate
              them before import. Select both files at once from the file
              picker.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="obs-def-csv-upload"
                disabled={disableManualUpload}
              />
              <label
                htmlFor="obs-def-csv-upload"
                className={
                  disableManualUpload
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                }
              >
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium">
                      Click to upload CSV files
                    </p>
                    <p className="text-sm text-gray-500">
                      Select both definitions &amp; components CSVs at once
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      downloadSampleCsvs();
                    }}
                  >
                    Download Sample CSVs
                  </Button>
                </div>
              </label>
            </div>

            {uploadedFileName && (
              <p className="mt-3 text-sm text-gray-600">
                Selected: {uploadedFileName}
              </p>
            )}

            {disableManualUpload && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Manual uploads are disabled because this build includes an
                  observation definition dataset in the repository.
                </AlertDescription>
              </Alert>
            )}

            {uploadError && (
              <Alert className="mt-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Master Data Card */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Import Observation Definitions from dataset
            </CardTitle>
            <CardDescription>
              Import data for Observation Definitions from available master
              dataset.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1">
            <div className="rounded-lg border border-gray-200 px-6 py-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <Database className="h-12 w-12 text-gray-400" />
                {repoFileAvailable ? (
                  <>
                    <p className="text-lg font-medium text-gray-600">
                      Upload from master dataset
                    </p>
                    <p className="text-xs text-gray-400">
                      A bundled dataset is available in this build.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveView({ kind: "master-select" })}
                    >
                      Import Master Data
                    </Button>
                  </>
                ) : (
                  <p className="text-gray-600 text-sm">
                    No bundled dataset was detected for this build. Upload a CSV
                    file to import manually.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Master File Selector ─────────────────────────────────────────
  if (activeView.kind === "master-select") {
    return (
      <MasterDataFileSelector
        title="Observation Definitions"
        files={files["observation-definition"]}
        selectCount={2}
        onFilesSelected={(selectedFiles) => {
          const pair = detectCsvPair(selectedFiles.map((f) => f.csvText));

          // Fall back gracefully if detection fails
          const defsCsvText =
            pair?.defsCsvText ?? selectedFiles[0]?.csvText ?? "";
          const compCsvText =
            pair?.compCsvText ?? selectedFiles[1]?.csvText ?? "";

          setActiveView({
            kind: "import",
            processedRows: parseMasterCsvToRows(defsCsvText, compCsvText),
          });
        }}
        onBack={handleBack}
      />
    );
  }

  // ─── Import Flow (shared by CSV and master paths) ─────────────────
  return (
    <ImportFlow
      config={importConfig}
      processedRows={activeView.processedRows}
      onBack={handleBack}
    />
  );
}
