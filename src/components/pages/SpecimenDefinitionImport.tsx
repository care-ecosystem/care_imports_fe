import { AlertCircle, Upload } from "lucide-react";
import { useMemo, useState } from "react";

import { request } from "@/apis/request";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Preference,
  SpecimenDefinitionCreate,
  SpecimenDefinitionStatus,
  TypeTestedSpec,
} from "@/types/emr/specimenDefinition/specimenDefinition";
import { parseCsvText } from "@/utils/csv";
import { createSlug } from "@/utils/slug";

interface SpecimenImportProps {
  facilityId?: string;
}

const REQUIRED_HEADERS = [
  "title",
  "description",
  "type_collected_code",
  "type_collected_system",
  "type_collected_display",
] as const;

const OPTIONAL_HEADERS = [
  "patient_preparation_code",
  "patient_preparation_system",
  "patient_preparation_display",
  "collection_code",
  "collection_system",
  "collection_display",
  "preference",
  "requirement",
  "single_use",
  "container_description",
  "container_capacity_value",
  "container_capacity_unit_code",
  "container_capacity_unit_system",
  "container_capacity_unit_display",
  "container_minimumvolume_string",
  "container_cap_code",
  "container_cap_system",
  "container_cap_display",
  "container_minimumvolume",
  "container_minimumvolume_unit_code",
  "container_minimumvolume_unit_system",
  "container_minimumvolume_unit_display",
  "container_preparation",
  "retention_time_value",
  "retention_time_unit_code",
  "retention_time_unit_system",
  "retention_time_unit_display",
] as const;

type SpecimenCsvRow = {
  title: string;
  description?: string;
  status: string;
  patient_preparation_code?: string;
  patient_preparation_system?: string;
  patient_preparation_display?: string;
  collection_code?: string;
  collection_system?: string;
  collection_display?: string;
  type_collected_code: string;
  type_collected_system: string;
  type_collected_display: string;
  preference?: string;
  requirement?: string;
  single_use?: string;
  container_description?: string;
  container_capacity_value?: string;
  container_capacity_unit_code?: string;
  container_capacity_unit_system?: string;
  container_capacity_unit_display?: string;
  container_minimumvolume_string?: string;
  container_cap_code?: string;
  container_cap_system?: string;
  container_cap_display?: string;
  container_minimumvolume?: string;
  container_minimumvolume_unit_code?: string;
  container_minimumvolume_unit_system?: string;
  container_minimumvolume_unit_display?: string;
  container_preparation?: string;
  retention_time_value?: string;
  retention_time_unit_code?: string;
  retention_time_unit_system?: string;
  retention_time_unit_display?: string;
};

interface ProcessedRow {
  rowIndex: number;
  data: SpecimenCsvRow;
  errors: string[];
}

interface ImportResults {
  processed: number;
  created: number;
  failed: number;
  failures: { rowIndex: number; title?: string; reason: string }[];
}

const createCode = (code?: string, system?: string, display?: string) => {
  if (code && system && display) {
    return { code, system, display };
  }
  return undefined;
};

export default function SpecimenDefinitionImport({
  facilityId,
}: SpecimenImportProps) {
  const [currentStep, setCurrentStep] = useState<
    "upload" | "review" | "importing" | "done"
  >("upload");
  const [uploadError, setUploadError] = useState("");
  const [processedRows, setProcessedRows] = useState<ProcessedRow[]>([]);
  const [results, setResults] = useState<ImportResults | null>(null);

  const summary = useMemo(() => {
    const valid = processedRows.filter((row) => row.errors.length === 0).length;
    const invalid = processedRows.length - valid;
    return { total: processedRows.length, valid, invalid };
  }, [processedRows]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setUploadError("Please upload a valid CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const { headers, rows } = parseCsvText(csvText);

        if (headers.length === 0) {
          setUploadError("CSV is empty or missing headers");
          return;
        }

        const headerMap = headers.reduce<Record<string, number>>(
          (acc, header, index) => {
            const key = header.trim();
            acc[key] = index;
            return acc;
          },
          {},
        );

        const missingHeaders = REQUIRED_HEADERS.filter(
          (header) => headerMap[header] === undefined,
        );

        if (missingHeaders.length > 0) {
          setUploadError(
            `Missing required headers: ${missingHeaders.join(", ")}`,
          );
          return;
        }

        const processed = rows.map((row, index) => {
          const data: SpecimenCsvRow = {
            title: row[headerMap.title] ?? "",
            description:
              headerMap.description !== undefined
                ? row[headerMap.description]
                : undefined,
            status: "active",
            patient_preparation_code:
              headerMap.patient_preparation_code !== undefined
                ? row[headerMap.patient_preparation_code]
                : undefined,
            patient_preparation_system:
              headerMap.patient_preparation_system !== undefined
                ? row[headerMap.patient_preparation_system]
                : undefined,
            patient_preparation_display:
              headerMap.patient_preparation_display !== undefined
                ? row[headerMap.patient_preparation_display]
                : undefined,
            collection_code:
              headerMap.collection_code !== undefined
                ? row[headerMap.collection_code]
                : undefined,
            collection_system:
              headerMap.collection_system !== undefined
                ? row[headerMap.collection_system]
                : undefined,
            collection_display:
              headerMap.collection_display !== undefined
                ? row[headerMap.collection_display]
                : undefined,
            type_collected_code: row[headerMap.type_collected_code] ?? "",
            type_collected_system: row[headerMap.type_collected_system] ?? "",
            type_collected_display: row[headerMap.type_collected_display] ?? "",
            preference:
              headerMap.preference !== undefined
                ? row[headerMap.preference]
                : undefined,
            requirement:
              headerMap.requirement !== undefined
                ? row[headerMap.requirement]
                : undefined,
            single_use:
              headerMap.single_use !== undefined
                ? row[headerMap.single_use]
                : undefined,
            container_description:
              headerMap.container_description !== undefined
                ? row[headerMap.container_description]
                : undefined,
            container_capacity_value:
              headerMap.container_capacity_value !== undefined
                ? row[headerMap.container_capacity_value]
                : undefined,
            container_capacity_unit_code:
              headerMap.container_capacity_unit_code !== undefined
                ? row[headerMap.container_capacity_unit_code]
                : undefined,
            container_capacity_unit_system:
              headerMap.container_capacity_unit_system !== undefined
                ? row[headerMap.container_capacity_unit_system]
                : undefined,
            container_capacity_unit_display:
              headerMap.container_capacity_unit_display !== undefined
                ? row[headerMap.container_capacity_unit_display]
                : undefined,
            container_minimumvolume_string:
              headerMap.container_minimumvolume_string !== undefined
                ? row[headerMap.container_minimumvolume_string]
                : undefined,
            container_cap_code:
              headerMap.container_cap_code !== undefined
                ? row[headerMap.container_cap_code]
                : undefined,
            container_cap_system:
              headerMap.container_cap_system !== undefined
                ? row[headerMap.container_cap_system]
                : undefined,
            container_cap_display:
              headerMap.container_cap_display !== undefined
                ? row[headerMap.container_cap_display]
                : undefined,
            container_minimumvolume:
              headerMap.container_minimumvolume !== undefined
                ? row[headerMap.container_minimumvolume]
                : undefined,
            container_minimumvolume_unit_code:
              headerMap.container_minimumvolume_unit_code !== undefined
                ? row[headerMap.container_minimumvolume_unit_code]
                : undefined,
            container_minimumvolume_unit_system:
              headerMap.container_minimumvolume_unit_system !== undefined
                ? row[headerMap.container_minimumvolume_unit_system]
                : undefined,
            container_minimumvolume_unit_display:
              headerMap.container_minimumvolume_unit_display !== undefined
                ? row[headerMap.container_minimumvolume_unit_display]
                : undefined,
            container_preparation:
              headerMap.container_preparation !== undefined
                ? row[headerMap.container_preparation]
                : undefined,
            retention_time_value:
              headerMap.retention_time_value !== undefined
                ? row[headerMap.retention_time_value]
                : undefined,
            retention_time_unit_code:
              headerMap.retention_time_unit_code !== undefined
                ? row[headerMap.retention_time_unit_code]
                : undefined,
            retention_time_unit_system:
              headerMap.retention_time_unit_system !== undefined
                ? row[headerMap.retention_time_unit_system]
                : undefined,
            retention_time_unit_display:
              headerMap.retention_time_unit_display !== undefined
                ? row[headerMap.retention_time_unit_display]
                : undefined,
          };

          const errors: string[] = [];
          if (!data.title.trim()) errors.push("Missing title");
          if (!data.type_collected_code.trim())
            errors.push("Missing type_collected_code");
          if (!data.type_collected_system.trim())
            errors.push("Missing type_collected_system");
          if (!data.type_collected_display.trim())
            errors.push("Missing type_collected_display");

          return {
            rowIndex: index + 2,
            data,
            errors,
          };
        });

        setUploadError("");
        setProcessedRows(processed);
        setCurrentStep("review");
      } catch (error) {
        setUploadError("Error processing CSV file");
      }
    };
    reader.readAsText(file);
  };

  const downloadSample = () => {
    const sampleCSV = `title,description,patient_preparation_code,patient_preparation_system,patient_preparation_display,collection_code,collection_system,collection_display,type_collected_code,type_collected_system,type_collected_display,preference,requirement,single_use,container_description,container_capacity_value,container_capacity_unit_code,container_capacity_unit_system,container_capacity_unit_display,container_minimumvolume_string,container_cap_code,container_cap_system,container_cap_display,container_minimumvolume,container_minimumvolume_unit_code,container_minimumvolume_unit_system,container_minimumvolume_unit_display,container_preparation,retention_time_value,retention_time_unit_code,retention_time_unit_system,retention_time_unit_display
Blood collection,Description,,,,129300006,http://snomed.info/sct,Puncture - action,WB,http://terminology.hl7.org/CodeSystem/v2-0487,"Blood, Whole",preferred,Requirement,true,Container Description,5.00,mL,http://unitsofmeasure.org,milliliter,12,black,http://terminology.hl7.org/CodeSystem/container-cap,black cap,,,,,Preparation,24.00,h,http://unitsofmeasure.org,hours`;
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_specimen_definition.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const runImport = async () => {
    const validRows = processedRows.filter((row) => row.errors.length === 0);
    if (validRows.length === 0) {
      setResults({
        processed: 0,
        created: 0,
        failed: 0,
        failures: [],
      });
      setCurrentStep("done");
      return;
    }

    setCurrentStep("importing");
    setResults({
      processed: 0,
      created: 0,
      failed: 0,
      failures: [],
    });

    if (!facilityId) return;

    for (const row of validRows) {
      try {
        const slug = await createSlug(row.data.title);
        const typeCollected = createCode(
          row.data.type_collected_code,
          row.data.type_collected_system,
          row.data.type_collected_display,
        );

        if (!typeCollected) {
          throw new Error("Missing type_collected information");
        }

        const containerCap = createCode(
          row.data.container_cap_code,
          row.data.container_cap_system,
          row.data.container_cap_display,
        );

        const patientPreparation = createCode(
          row.data.patient_preparation_code,
          row.data.patient_preparation_system,
          row.data.patient_preparation_display,
        );

        const collection = createCode(
          row.data.collection_code,
          row.data.collection_system,
          row.data.collection_display,
        );

        const containerCapacityUnit = createCode(
          row.data.container_capacity_unit_code,
          row.data.container_capacity_unit_system,
          row.data.container_capacity_unit_display,
        );

        const containerCapacityValue = row.data.container_capacity_value
          ? parseFloat(row.data.container_capacity_value)
          : 0;

        const minimumVolumeUnit = createCode(
          row.data.container_minimumvolume_unit_code,
          row.data.container_minimumvolume_unit_system,
          row.data.container_minimumvolume_unit_display,
        );

        const minimumVolumeValue = row.data.container_minimumvolume
          ? parseFloat(row.data.container_minimumvolume)
          : 0;

        const containerMinimumVolume = row.data.container_minimumvolume_string
          ? { string: row.data.container_minimumvolume_string }
          : minimumVolumeUnit && minimumVolumeValue > 0
            ? {
                quantity: {
                  value: minimumVolumeValue.toString(),
                  unit: minimumVolumeUnit,
                },
              }
            : undefined;

        const container =
          containerCap ||
          containerMinimumVolume ||
          row.data.container_description ||
          row.data.container_preparation ||
          (containerCapacityUnit && containerCapacityValue > 0)
            ? {
                ...(row.data.container_description && {
                  description: row.data.container_description,
                }),
                ...(containerCapacityUnit && containerCapacityValue > 0
                  ? {
                      capacity: {
                        value: containerCapacityValue.toString(),
                        unit: containerCapacityUnit,
                      },
                    }
                  : {}),
                ...(containerMinimumVolume && {
                  minimum_volume: containerMinimumVolume,
                }),
                ...(containerCap && { cap: containerCap }),
                ...(row.data.container_preparation && {
                  preparation: row.data.container_preparation,
                }),
              }
            : undefined;

        const retentionTimeUnit = createCode(
          row.data.retention_time_unit_code,
          row.data.retention_time_unit_system,
          row.data.retention_time_unit_display,
        );

        const typeTested: TypeTestedSpec = {
          is_derived: false,
          preference:
            (row.data.preference as Preference) || Preference.preferred,
          ...(container && { container }),
          ...(row.data.requirement && { requirement: row.data.requirement }),
          retention_time: {
            value: row.data.retention_time_value || "24",
            unit:
              retentionTimeUnit ||
              createCode("h", "http://unitsofmeasure.org", "hours")!,
          },
          single_use:
            row.data.single_use !== undefined
              ? row.data.single_use.toLowerCase() === "true"
              : true,
        };

        const payload: SpecimenDefinitionCreate = {
          title: row.data.title,
          slug_value: slug,
          status:
            (row.data.status as SpecimenDefinitionStatus) ||
            SpecimenDefinitionStatus.active,
          description: row.data.description ?? "",
          type_collected: typeCollected,
          patient_preparation: patientPreparation ? [patientPreparation] : [],
          ...(collection && { collection }),
          type_tested: typeTested,
        };

        await request(`/api/v1/facility/${facilityId}/specimen_definition/`, {
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
              Upload a CSV file to import specimen definitions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="specimen-definition-upload"
              />
              <label
                htmlFor="specimen-definition-upload"
                className="cursor-pointer"
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
                    Expected columns: {REQUIRED_HEADERS.join(", ")}.
                  </p>
                  <p className="text-xs text-gray-400">
                    Optional columns: {OPTIONAL_HEADERS.join(", ")}.
                  </p>
                  <Button variant="outline" size="sm" onClick={downloadSample}>
                    Download Sample CSV
                  </Button>
                </div>
              </label>
            </div>

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
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Review All Specimen Definitions
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-80 overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-4 py-2 text-left">Row</th>
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-left">Type Collected</th>
                        <th className="px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedRows.map((row) => (
                        <tr
                          key={row.rowIndex}
                          className="border-t border-gray-100"
                        >
                          <td className="px-4 py-2 text-gray-500">
                            {row.rowIndex}
                          </td>
                          <td className="px-4 py-2">{row.data.title}</td>
                          <td className="px-4 py-2">
                            {row.data.type_collected_display || "-"}
                          </td>
                          <td className="px-4 py-2">
                            {row.errors.length === 0 ? (
                              <span className="text-green-600">Valid</span>
                            ) : (
                              <span className="text-red-600">
                                {row.errors.join("; ")}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                className="mt-4"
                onClick={runImport}
                disabled={summary.valid === 0}
              >
                Start Import
              </Button>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("upload")}
              >
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "importing") {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Importing Specimen Definitions</CardTitle>
            <CardDescription>
              {results?.processed ?? 0}/{summary.valid} processed
            </CardDescription>
            <div className="mt-4">
              <Progress
                value={
                  summary.valid
                    ? ((results?.processed ?? 0) / summary.valid) * 100
                    : 0
                }
                className="h-2"
              />
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Specimen Definition Import Complete</CardTitle>
          <CardDescription>
            Created: {results?.created ?? 0} · Failed: {results?.failed ?? 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results && results.failures.length > 0 && (
            <Alert className="mb-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {results.failures.slice(0, 5).map((failure) => (
                  <div key={`${failure.rowIndex}-${failure.title}`}>
                    Row {failure.rowIndex}: {failure.reason}
                  </div>
                ))}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setCurrentStep("upload")}>
              Import Another File
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
