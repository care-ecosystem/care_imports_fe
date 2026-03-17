import { AlertCircle, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { APIError, request } from "@/apis/request";
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
import { disableOverride } from "@/config";
import { useMasterDataAvailability } from "@/hooks/useMasterDataAvailability";
import {
  parseSpecimenDefinitionCsv,
  type SpecimenProcessedRow,
} from "@/utils/masterImport/specimenDefinition";
import { createSlug } from "@/utils/slug";

import {
  CodeReference,
  ContainerSpec,
  ImportResults,
  Preference,
  SpecimenDefinitionCreate,
  SpecimenDefinitionImportProps,
  TypeTestedSpec,
} from "@/types/emr/specimenDefinition/specimenDefinition";

const CODE_ERROR_PREFIX = "Invalid code:";

const stripLookupErrors = (errors: string[]) =>
  errors.filter((error) => !error.startsWith(CODE_ERROR_PREFIX));

const csvEscape = (value: string) => `"${value.replace(/"/g, '""')}"`;

export default function SpecimenDefinitionImport({
  facilityId,
}: SpecimenDefinitionImportProps) {
  const [currentStep, setCurrentStep] = useState<
    "upload" | "review" | "importing" | "done"
  >("upload");
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [processedRows, setProcessedRows] = useState<SpecimenProcessedRow[]>(
    [],
  );
  const [results, setResults] = useState<ImportResults | null>(null);
  const [totalToImport, setTotalToImport] = useState(0);
  const [lookupStatus, setLookupStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [lastLookupSignature, setLastLookupSignature] = useState<string>("");
  const { availability } = useMasterDataAvailability();
  const repoFileAvailable = availability["specimen-definition"];
  const disableManualUpload = disableOverride && repoFileAvailable;
  console.log(disableOverride);

  const summary = useMemo(() => {
    const valid = processedRows.filter((row) => row.errors.length === 0).length;
    const invalid = processedRows.length - valid;
    return { total: processedRows.length, valid, invalid };
  }, [processedRows]);

  const uniqueCodeReferences = useMemo(() => {
    const map = new Map<string, CodeReference>();
    processedRows.forEach((row) => {
      row.codeReferences.forEach((ref) => {
        if (!map.has(ref.signature)) {
          map.set(ref.signature, ref);
        }
      });
    });
    return Array.from(map.values());
  }, [processedRows]);

  const lookupSignature = useMemo(
    () => uniqueCodeReferences.map((ref) => ref.signature).join("||"),
    [uniqueCodeReferences],
  );

  const resolveCodeLookups = useCallback(async () => {
    if (!lookupSignature) {
      setLookupStatus("ready");
      return;
    }

    setLookupStatus("loading");
    const invalidSignatures = new Set<string>();
    const issues: string[] = [];

    await Promise.all(
      uniqueCodeReferences.map(async (ref) => {
        try {
          await request("/api/v1/valueset/lookup_code/", {
            method: "POST",
            body: JSON.stringify({
              system: ref.code.system,
              code: ref.code.code,
            }),
          });
        } catch {
          invalidSignatures.add(ref.signature);
          issues.push(`${ref.label}: ${ref.code.system} | ${ref.code.code}`);
        }
      }),
    );

    setLookupStatus(issues.length ? "error" : "ready");
    setLastLookupSignature(lookupSignature);

    setProcessedRows((prevRows) =>
      prevRows.map((row) => {
        const updatedErrors = stripLookupErrors(row.errors);
        row.codeReferences.forEach((ref) => {
          if (invalidSignatures.has(ref.signature)) {
            updatedErrors.push(
              `${CODE_ERROR_PREFIX} ${ref.label} (${ref.code.system} | ${ref.code.code})`,
            );
          }
        });
        return {
          ...row,
          errors: updatedErrors,
        };
      }),
    );
  }, [lookupSignature, uniqueCodeReferences]);

  useEffect(() => {
    if (currentStep !== "review") return;
    if (!lookupSignature) {
      setLookupStatus("ready");
      return;
    }
    if (lookupStatus === "loading") return;
    if (lookupSignature === lastLookupSignature) return;

    resolveCodeLookups();
  }, [
    currentStep,
    lookupSignature,
    lookupStatus,
    lastLookupSignature,
    resolveCodeLookups,
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(disableManualUpload);
    if (disableManualUpload) {
      setUploadError(
        "Manual uploads are disabled because specimen definition data is bundled with this build.",
      );
      setUploadedFileName("");
      return;
    }
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setUploadError("Please upload a valid CSV file");
      setUploadedFileName("");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const processed = parseSpecimenDefinitionCsv(csvText);

        setUploadError("");
        setUploadedFileName(file.name);
        setProcessedRows(processed);
        setResults(null);
        setLookupStatus("idle");
        setLastLookupSignature("");
        setCurrentStep("review");
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Error processing CSV file",
        );
      }
    };
    reader.readAsText(file);
  };

  const downloadSample = () => {
    const headers = [
      "title",
      "slug_value",
      "description",
      "derived_from_uri",
      "type_collected_system",
      "type_collected_code",
      "type_collected_display",
      "collection_system",
      "collection_code",
      "collection_display",
      "is_derived",
      "preference",
      "single_use",
      "requirement",
      "retention_value",
      "retention_unit_system",
      "retention_unit_code",
      "retention_unit_display",
      "container_description",
      "container_capacity_value",
      "container_capacity_unit_system",
      "container_capacity_unit_code",
      "container_capacity_unit_display",
      "container_minimum_volume_quantity_value",
      "container_minimum_volume_quantity_unit_system",
      "container_minimum_volume_quantity_unit_code",
      "container_minimum_volume_quantity_unit_display",
      "container_minimum_volume_string",
      "container_cap_system",
      "container_cap_code",
      "container_cap_display",
      "container_preparation",
    ];

    const rows = [
      [
        "Blood",
        "blood",
        "Blood",
        "",
        "http://terminology.hl7.org/CodeSystem/v2-0487",
        "ACNFLD",
        "Fluid, Acne",
        "http://snomed.info/sct",
        "278450005",
        "Finger stick",
        "true",
        "preferred",
        "true",
        "Requirement",
        "1.00",
        "http://unitsofmeasure.org",
        "h",
        "hours",
        "Container Description",
        "5.00",
        "http://unitsofmeasure.org",
        "mL",
        "milliliter",
        "5.00",
        "http://unitsofmeasure.org",
        "mL",
        "milliliter",
        "",
        "http://terminology.hl7.org/CodeSystem/container-cap",
        "black",
        "black cap",
        "Container Prep",
      ].map(csvEscape),
    ];

    const sampleCSV =
      `${headers.join(",")}` +
      `\n${rows.map((row) => row.join(",")).join("\n")}`;
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_specimen_definition.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

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

  const runImport = async () => {
    if (!facilityId) {
      setUploadError("Select a facility to import specimen definitions");
      setCurrentStep("upload");
      return;
    }

    const validRows = processedRows.filter((row) => row.errors.length === 0);
    const invalidRows = processedRows.length - validRows.length;
    setTotalToImport(validRows.length);

    if (validRows.length === 0) {
      setResults({
        processed: 0,
        created: 0,
        updated: 0,
        failed: 0,
        skipped: invalidRows,
        failures: [],
      });
      setCurrentStep("done");
      return;
    }

    setCurrentStep("importing");
    setResults({
      processed: 0,
      created: 0,
      updated: 0,
      failed: 0,
      skipped: invalidRows,
      failures: [],
    });

    for (const row of validRows) {
      try {
        const slug = row.data.slug_value?.trim()
          ? row.data.slug_value.trim()
          : await createSlug(row.data.title, 25);

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
              preference: row.data.preference ?? Preference.preferred,
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

        const detailPath = `/api/v1/facility/${facilityId}/specimen_definition/${slug}/`;
        const listPath = `/api/v1/facility/${facilityId}/specimen_definition/`;

        try {
          await request(detailPath, { method: "GET" });
          await request(detailPath, {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          setResults((prev) =>
            prev
              ? {
                  ...prev,
                  processed: prev.processed + 1,
                  updated: prev.updated + 1,
                }
              : prev,
          );
        } catch (error) {
          if (error instanceof APIError && error.status !== 404) {
            throw error;
          }

          await request(listPath, {
            method: "POST",
            body: JSON.stringify(payload),
          });
          setResults((prev) =>
            prev
              ? {
                  ...prev,
                  processed: prev.processed + 1,
                  created: prev.created + 1,
                }
              : prev,
          );
        }
      } catch (error) {
        const reason = error instanceof Error ? error.message : "Unknown error";
        setResults((prev) =>
          prev
            ? {
                ...prev,
                processed: prev.processed + 1,
                failed: prev.failed + 1,
                failures: [
                  ...prev.failures,
                  { rowIndex: row.rowIndex, title: row.data.title, reason },
                ],
              }
            : prev,
        );
      }
    }

    setCurrentStep("done");
  };

  if (currentStep === "upload") {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Specimen Definitions from CSV
            </CardTitle>
            <CardDescription>
              Upload a CSV file to create specimen definitions and validate them
              before import.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="specimen-definition-csv-upload"
                disabled={disableManualUpload}
              />
              <label
                htmlFor="specimen-definition-csv-upload"
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
                      Click to upload CSV file
                    </p>
                    <p className="text-sm text-gray-500">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Required columns: title, description, type_collected_system,
                    type_collected_code, type_collected_display
                  </p>
                  <Button variant="outline" size="sm" onClick={downloadSample}>
                    Download Sample CSV
                  </Button>
                </div>
              </label>
            </div>

            {uploadedFileName && (
              <p className="mt-3 text-sm text-gray-600">
                Selected file: {uploadedFileName}
              </p>
            )}

            {disableManualUpload && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Manual uploads are disabled because this build includes a
                  specimen definition dataset in the repository.
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
      </div>
    );
  }

  if (currentStep === "review") {
    return (
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Specimen Definition Import Wizard</CardTitle>
            <CardDescription>
              Review and validate specimen definitions before importing.
            </CardDescription>
            <div className="mt-4">
              <Progress value={100} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-4">
              <Badge variant="outline">Total: {summary.total}</Badge>
              <Badge variant="primary">Valid: {summary.valid}</Badge>
              <Badge variant="secondary">Invalid: {summary.invalid}</Badge>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full table-fixed text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left w-14">Row</th>
                    <th className="px-4 py-2 text-left w-1/3">Title</th>
                    <th className="px-4 py-2 text-left w-24">Status</th>
                    <th className="px-4 py-2 text-left">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {processedRows.map((row) => (
                    <tr key={row.rowIndex} className="border-t border-gray-100">
                      <td className="px-4 py-2 text-gray-500 align-top">
                        {row.rowIndex}
                      </td>
                      <td className="px-4 py-2 align-top whitespace-normal break-words">
                        {row.data.title}
                      </td>
                      <td className="px-4 py-2 align-top">
                        {row.errors.length === 0 ? (
                          <span className="text-emerald-700">Valid</span>
                        ) : (
                          <span className="text-red-600">Invalid</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-600 align-top whitespace-normal break-words">
                        {row.errors.length > 0
                          ? row.errors.join("; ")
                          : "All checks passed"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("upload")}
              >
                Back
              </Button>
              <Button
                onClick={runImport}
                disabled={summary.valid === 0 || lookupStatus === "loading"}
              >
                Import
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "importing") {
    const processed = results?.processed ?? 0;
    const progress = totalToImport
      ? Math.round((processed / totalToImport) * 100)
      : 0;

    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Importing Specimen Definitions</CardTitle>
            <CardDescription>
              Please keep this window open while we import your data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <Badge variant="outline">Processed: {processed}</Badge>
              <Badge variant="primary">Created: {results?.created ?? 0}</Badge>
              <Badge variant="secondary">
                Updated: {results?.updated ?? 0}
              </Badge>
              <Badge variant="secondary">Failed: {results?.failed ?? 0}</Badge>
              <Badge variant="outline">Skipped: {results?.skipped ?? 0}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Specimen Definition Import Results</CardTitle>
          <CardDescription>
            Import completed. Review the summary and any failed rows below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Badge variant="primary">Created: {results?.created ?? 0}</Badge>
            <Badge variant="secondary">Updated: {results?.updated ?? 0}</Badge>
            <Badge variant="secondary">Failed: {results?.failed ?? 0}</Badge>
            <Badge variant="outline">Skipped: {results?.skipped ?? 0}</Badge>
          </div>

          {results?.failures.length ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-64 overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-2 text-left">Row</th>
                      <th className="px-4 py-2 text-left">Title</th>
                      <th className="px-4 py-2 text-left">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.failures.map((failure) => (
                      <tr
                        key={`${failure.rowIndex}-${failure.title}`}
                        className="border-t border-gray-100"
                      >
                        <td className="px-4 py-2 text-gray-500">
                          {failure.rowIndex}
                        </td>
                        <td className="px-4 py-2">{failure.title ?? "-"}</td>
                        <td className="px-4 py-2 text-xs text-gray-600">
                          {failure.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">No failed rows 🎉</p>
          )}

          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setProcessedRows([]);
                setResults(null);
                setUploadedFileName("");
                setUploadError("");
                setLookupStatus("idle");
                setLastLookupSignature("");
                setCurrentStep("upload");
              }}
            >
              Upload Another File
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
