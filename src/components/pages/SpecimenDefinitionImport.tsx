import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
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
import { parseCsvText } from "@/utils/csv";
import { createSlug } from "@/utils/slug";

import {
  CodeReference,
  ContainerSpec,
  DurationSpec,
  ImportResults,
  Preference,
  ProcessedRow,
  QuantitySpec,
  SpecimenDefinitionImportProps,
  SpecimenRow,
  SpecimenDefinitionCreate,
  SpecimenDefinitionStatus,
  TypeTestedSpec,
} from "@/types/emr/specimenDefinition/specimenDefinition";

const REQUIRED_HEADERS = [
  "title",
  "description",
  "type_collected_system",
  "type_collected_code",
  "type_collected_display",
] as const;

const PREFERENCES = [Preference.preferred, Preference.alternate] as const;

const CODE_ERROR_PREFIX = "Invalid code:";

const normalizeHeader = (header: string) =>
  header.toLowerCase().replace(/[^a-z0-9]/g, "");

const isNonEmptyString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

const parseBoolean = (value?: string) => {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes"].includes(normalized)) return true;
  if (["false", "0", "no"].includes(normalized)) return false;
  return undefined;
};

const getCellValue = (
  row: string[],
  headerMap: Record<string, number>,
  key: string,
) => {
  const index = headerMap[normalizeHeader(key)];
  return index === undefined ? "" : (row[index] ?? "");
};

const buildRequiredCode = (
  system: string,
  code: string,
  display: string,
  errors: string[],
  label: string,
) => {
  if (!system || !code || !display) {
    errors.push(`${label} requires system, code, and display`);
    return null;
  }
  return { system, code, display };
};

const buildOptionalCode = (
  system: string,
  code: string,
  display: string,
  errors: string[],
  label: string,
) => {
  if (!system && !code && !display) return null;
  if (!system || !code || !display) {
    errors.push(`${label} requires system, code, and display if provided`);
    return null;
  }
  return { system, code, display };
};

const buildOptionalQuantity = (
  value: string,
  unitSystem: string,
  unitCode: string,
  unitDisplay: string,
  errors: string[],
  label: string,
) => {
  if (!value && !unitSystem && !unitCode && !unitDisplay) return null;
  if (!value || !unitSystem || !unitCode || !unitDisplay) {
    errors.push(`${label} requires value and unit (system, code, display)`);
    return null;
  }
  return {
    value,
    unit: { system: unitSystem, code: unitCode, display: unitDisplay },
  };
};

const buildCodeSignature = (code: CodeReference["code"]) =>
  `${code.system}||${code.code}`;

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
  const [processedRows, setProcessedRows] = useState<ProcessedRow[]>([]);
  const [results, setResults] = useState<ImportResults | null>(null);
  const [totalToImport, setTotalToImport] = useState(0);
  const [lookupStatus, setLookupStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [lookupIssues, setLookupIssues] = useState<string[]>([]);
  const [lastLookupSignature, setLastLookupSignature] = useState<string>("");

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
      setLookupIssues([]);
      setLookupStatus("ready");
      return;
    }

    setLookupStatus("loading");
    setLookupIssues([]);

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

    setLookupIssues(issues);
    setLookupStatus(issues.length ? "error" : "ready");
    setLastLookupSignature(lookupSignature);

    setProcessedRows((prevRows) =>
      prevRows.map((row) => {
        const updatedErrors = stripLookupErrors(row.errors);
        row.codeReferences.forEach((ref) => {
          if (invalidSignatures.has(ref.signature)) {
            updatedErrors.push(`${CODE_ERROR_PREFIX} ${ref.label}`);
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
        const { headers, rows } = parseCsvText(csvText);

        if (headers.length === 0) {
          setUploadError("CSV is empty or missing headers");
          return;
        }

        const headerMap = headers.reduce<Record<string, number>>(
          (acc, header, index) => {
            acc[normalizeHeader(header)] = index;
            return acc;
          },
          {},
        );

        const missingHeaders = REQUIRED_HEADERS.filter(
          (header) => headerMap[normalizeHeader(header)] === undefined,
        );

        if (missingHeaders.length > 0) {
          setUploadError(
            `Missing required headers: ${missingHeaders.join(", ")}`,
          );
          return;
        }

        const processed = rows.map((row, index) => {
          const errors: string[] = [];
          const codeReferences: CodeReference[] = [];

          const title = getCellValue(row, headerMap, "title").trim();
          const description = getCellValue(
            row,
            headerMap,
            "description",
          ).trim();
          const slugValue = getCellValue(row, headerMap, "slug_value").trim();
          const derivedFromUri = getCellValue(
            row,
            headerMap,
            "derived_from_uri",
          ).trim();

          const typeCollected = buildRequiredCode(
            getCellValue(row, headerMap, "type_collected_system").trim(),
            getCellValue(row, headerMap, "type_collected_code").trim(),
            getCellValue(row, headerMap, "type_collected_display").trim(),
            errors,
            "Type collected",
          );

          if (!title) errors.push("Missing title");
          if (!description) errors.push("Missing description");

          if (derivedFromUri) {
            try {
              new URL(derivedFromUri);
            } catch {
              errors.push("derived_from_uri must be a valid URL");
            }
          }

          const patientPreparationRaw = getCellValue(
            row,
            headerMap,
            "patient_preparation",
          ).trim();
          const patientPreparation: CodeReference["code"][] = [];
          if (patientPreparationRaw) {
            try {
              const parsed = JSON.parse(patientPreparationRaw);
              if (!Array.isArray(parsed)) {
                errors.push("patient_preparation must be a JSON array");
              } else {
                parsed.forEach((item, prepIndex) => {
                  if (
                    !item ||
                    !isNonEmptyString(item.system) ||
                    !isNonEmptyString(item.code) ||
                    !isNonEmptyString(item.display)
                  ) {
                    errors.push(
                      `patient_preparation ${prepIndex + 1} must include system, code, and display`,
                    );
                    return;
                  }
                  const codePayload = {
                    system: item.system.trim(),
                    code: item.code.trim(),
                    display: item.display.trim(),
                  };
                  patientPreparation.push(codePayload);
                  codeReferences.push({
                    signature: buildCodeSignature(codePayload),
                    label: `Patient preparation ${prepIndex + 1}`,
                    code: codePayload,
                  });
                });
              }
            } catch {
              errors.push("patient_preparation JSON could not be parsed");
            }
          }

          const collectionCode = buildOptionalCode(
            getCellValue(row, headerMap, "collection_system").trim(),
            getCellValue(row, headerMap, "collection_code").trim(),
            getCellValue(row, headerMap, "collection_display").trim(),
            errors,
            "Collection",
          );

          const isDerivedRaw = getCellValue(
            row,
            headerMap,
            "is_derived",
          ).trim();
          const isDerived = parseBoolean(isDerivedRaw);
          if (isDerivedRaw && isDerived === undefined) {
            errors.push("is_derived must be a boolean value");
          }

          const preferenceRaw = getCellValue(
            row,
            headerMap,
            "preference",
          ).trim();
          const preference = preferenceRaw as Preference;
          if (preferenceRaw && !PREFERENCES.includes(preference as never)) {
            errors.push("Invalid preference value");
          }

          const singleUseRaw = getCellValue(
            row,
            headerMap,
            "single_use",
          ).trim();
          const singleUse = parseBoolean(singleUseRaw);
          if (singleUseRaw && singleUse === undefined) {
            errors.push("single_use must be a boolean value");
          }

          const requirement = getCellValue(
            row,
            headerMap,
            "requirement",
          ).trim();

          const retentionTime = buildOptionalQuantity(
            getCellValue(row, headerMap, "retention_value").trim(),
            getCellValue(row, headerMap, "retention_unit_system").trim(),
            getCellValue(row, headerMap, "retention_unit_code").trim(),
            getCellValue(row, headerMap, "retention_unit_display").trim(),
            errors,
            "Retention time",
          ) as DurationSpec | null;

          const containerDescription = getCellValue(
            row,
            headerMap,
            "container_description",
          ).trim();

          const containerCapacity = buildOptionalQuantity(
            getCellValue(row, headerMap, "container_capacity_value").trim(),
            getCellValue(
              row,
              headerMap,
              "container_capacity_unit_system",
            ).trim(),
            getCellValue(row, headerMap, "container_capacity_unit_code").trim(),
            getCellValue(
              row,
              headerMap,
              "container_capacity_unit_display",
            ).trim(),
            errors,
            "Container capacity",
          ) as QuantitySpec | null;

          const minimumVolumeQuantity = buildOptionalQuantity(
            getCellValue(
              row,
              headerMap,
              "container_minimum_volume_quantity_value",
            ).trim(),
            getCellValue(
              row,
              headerMap,
              "container_minimum_volume_quantity_unit_system",
            ).trim(),
            getCellValue(
              row,
              headerMap,
              "container_minimum_volume_quantity_unit_code",
            ).trim(),
            getCellValue(
              row,
              headerMap,
              "container_minimum_volume_quantity_unit_display",
            ).trim(),
            errors,
            "Minimum volume quantity",
          ) as QuantitySpec | null;

          const minimumVolumeString = getCellValue(
            row,
            headerMap,
            "container_minimum_volume_string",
          ).trim();

          if (minimumVolumeQuantity && minimumVolumeString) {
            errors.push(
              "Minimum volume cannot include both quantity and string",
            );
          }

          const containerCap = buildOptionalCode(
            getCellValue(row, headerMap, "container_cap_system").trim(),
            getCellValue(row, headerMap, "container_cap_code").trim(),
            getCellValue(row, headerMap, "container_cap_display").trim(),
            errors,
            "Container cap",
          );

          const containerPreparation = getCellValue(
            row,
            headerMap,
            "container_preparation",
          ).trim();

          const containerPayload: ContainerSpec | null =
            containerDescription ||
            containerCapacity ||
            minimumVolumeQuantity ||
            minimumVolumeString ||
            containerCap ||
            containerPreparation
              ? {
                  description: containerDescription || undefined,
                  capacity: containerCapacity || undefined,
                  minimum_volume:
                    minimumVolumeQuantity || minimumVolumeString
                      ? {
                          quantity: minimumVolumeQuantity || undefined,
                          string: minimumVolumeString || undefined,
                        }
                      : undefined,
                  cap: containerCap || undefined,
                  preparation: containerPreparation || undefined,
                }
              : null;

          if (typeCollected) {
            codeReferences.push({
              signature: buildCodeSignature(typeCollected),
              label: "Type collected",
              code: typeCollected,
            });
          }

          if (collectionCode) {
            codeReferences.push({
              signature: buildCodeSignature(collectionCode),
              label: "Collection",
              code: collectionCode,
            });
          }

          if (retentionTime?.unit) {
            codeReferences.push({
              signature: buildCodeSignature(retentionTime.unit),
              label: "Retention unit",
              code: retentionTime.unit,
            });
          }

          if (containerCapacity?.unit) {
            codeReferences.push({
              signature: buildCodeSignature(containerCapacity.unit),
              label: "Container capacity unit",
              code: containerCapacity.unit,
            });
          }

          if (minimumVolumeQuantity?.unit) {
            codeReferences.push({
              signature: buildCodeSignature(minimumVolumeQuantity.unit),
              label: "Minimum volume unit",
              code: minimumVolumeQuantity.unit,
            });
          }

          if (containerCap) {
            codeReferences.push({
              signature: buildCodeSignature(containerCap),
              label: "Container cap",
              code: containerCap,
            });
          }

          const data: SpecimenRow = {
            title,
            slug_value: slugValue || undefined,
            status: SpecimenDefinitionStatus.active,
            description,
            derived_from_uri: derivedFromUri || undefined,
            type_collected: typeCollected || {
              system: "",
              code: "",
              display: "",
            },
            patient_preparation: patientPreparation,
            collection: collectionCode,
            is_derived: isDerived,
            preference: preferenceRaw ? preference : undefined,
            single_use: singleUse,
            requirement: requirement || undefined,
            retention_time: retentionTime || undefined,
            container: containerPayload || undefined,
          };

          return {
            rowIndex: index + 2,
            data,
            errors,
            codeReferences,
          };
        });

        setUploadError("");
        setUploadedFileName(file.name);
        setProcessedRows(processed);
        setResults(null);
        setLookupIssues([]);
        setLookupStatus("idle");
        setLastLookupSignature("");
        setCurrentStep("review");
      } catch {
        setUploadError("Error processing CSV file");
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
      "patient_preparation",
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

    const patientPreparationExample = JSON.stringify([
      {
        system: "http://snomed.info/sct",
        code: "47501000087100",
        display: "Fractionated dose",
      },
    ]);

    const rows = [
      [
        "Blood",
        "blood",
        "Blood",
        "",
        "http://terminology.hl7.org/CodeSystem/v2-0487",
        "ACNFLD",
        "Fluid, Acne",
        patientPreparationExample,
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
          patient_preparation: row.data.patient_preparation || [],
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
              />
              <label
                htmlFor="specimen-definition-csv-upload"
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

            {(lookupStatus === "loading" || lookupIssues.length > 0) && (
              <Alert
                className="mb-4"
                variant={lookupIssues.length > 0 ? "destructive" : "default"}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {lookupStatus === "loading" &&
                    "Validating codes via value set lookup..."}
                  {lookupIssues.length > 0 && (
                    <div className="space-y-1">
                      {lookupIssues.map((issue) => (
                        <div key={issue}>{issue}</div>
                      ))}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-80 overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-2 text-left">Row</th>
                      <th className="px-4 py-2 text-left">Title</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Issues</th>
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
                          {row.errors.length === 0 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700">
                              <CheckCircle2 className="h-4 w-4" />
                              Valid
                            </span>
                          ) : (
                            <span className="text-red-600">Invalid</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-600">
                          {row.errors.length > 0 ? row.errors.join("; ") : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                setLookupIssues([]);
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
