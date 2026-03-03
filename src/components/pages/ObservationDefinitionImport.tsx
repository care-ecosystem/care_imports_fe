import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { useMemo, useState } from "react";

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
import { parseCsvText } from "@/utils/csv";
import { createSlug } from "@/utils/slug";

interface ObservationDefinitionImportProps {
  facilityId?: string;
}

type CodePayload = {
  system: string;
  code: string;
  display: string;
};

type JsonObject = Record<string, unknown>;

type ObservationComponentPayload = JsonObject;

type ObservationRow = {
  title: string;
  description: string;
  category: string;
  status: string;
  code: CodePayload;
  permitted_data_type: string;
  component: ObservationComponentPayload[];
  body_site: CodePayload | null;
  method: CodePayload | null;
  permitted_unit: CodePayload | null;
  qualified_ranges: JsonObject[];
  derived_from_uri?: string;
};

interface ProcessedRow {
  rowIndex: number;
  data: ObservationRow;
  errors: string[];
}

interface ImportResults {
  processed: number;
  created: number;
  updated: number;
  failed: number;
  skipped: number;
  failures: { rowIndex: number; title?: string; reason: string }[];
}

const REQUIRED_HEADERS = [
  "title",
  "description",
  "category",
  "permitted_data_type",
  "code_system",
  "code_value",
  "code_display",
] as const;

const OBSERVATION_CATEGORIES = [
  "social_history",
  "vital_signs",
  "imaging",
  "laboratory",
  "procedure",
  "survey",
  "exam",
  "therapy",
  "activity",
] as const;

const OBSERVATION_STATUSES = ["draft", "active", "retired", "unknown"] as const;

const QUESTION_TYPES = [
  "boolean",
  "decimal",
  "integer",
  "dateTime",
  "time",
  "string",
  "quantity",
] as const;

const normalizeHeader = (header: string) =>
  header.toLowerCase().replace(/[^a-z0-9]/g, "");

const isJsonObject = (value: unknown): value is JsonObject =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isNonEmptyString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

const validateCodeObject = (
  value: unknown,
  errors: string[],
  label: string,
  indexLabel?: string,
) => {
  if (!isJsonObject(value)) {
    errors.push(`${label}${indexLabel ? ` ${indexLabel}` : ""} is invalid`);
    return false;
  }

  const system = value.system;
  const code = value.code;
  const display = value.display;

  if (
    !isNonEmptyString(system) ||
    !isNonEmptyString(code) ||
    !isNonEmptyString(display)
  ) {
    errors.push(
      `${label}${indexLabel ? ` ${indexLabel}` : ""} must include system, code, and display`,
    );
    return false;
  }

  return true;
};

const validateQualifiedRanges = (
  ranges: JsonObject[],
  errors: string[],
  prefix: string,
) => {
  ranges.forEach((range, rangeIndex) => {
    const indexLabel = `${prefix} ${rangeIndex + 1}`;
    if (!isJsonObject(range)) {
      errors.push(`${indexLabel} is invalid`);
      return;
    }

    const conditions = range.conditions;
    if (!Array.isArray(conditions)) {
      errors.push(`${indexLabel} must include conditions array`);
    } else {
      conditions.forEach((condition, conditionIndex) => {
        if (!isJsonObject(condition)) {
          errors.push(
            `${indexLabel} condition ${conditionIndex + 1} is invalid`,
          );
          return;
        }
        if (!isNonEmptyString(condition.metric)) {
          errors.push(
            `${indexLabel} condition ${conditionIndex + 1} missing metric`,
          );
        }
        if (!isNonEmptyString(condition.operation)) {
          errors.push(
            `${indexLabel} condition ${conditionIndex + 1} missing operation`,
          );
        }
        const value = condition.value;
        const hasValue =
          isNonEmptyString(value) ||
          (isJsonObject(value) && Object.keys(value).length > 0);
        if (!hasValue) {
          errors.push(
            `${indexLabel} condition ${conditionIndex + 1} missing value`,
          );
        }
      });
    }

    const numericRanges = range.ranges;
    if (!Array.isArray(numericRanges) || numericRanges.length === 0) {
      errors.push(`${indexLabel} must include ranges array`);
    } else {
      numericRanges.forEach((numericRange, numericIndex) => {
        if (!isJsonObject(numericRange)) {
          errors.push(`${indexLabel} range ${numericIndex + 1} is invalid`);
          return;
        }
        const interpretation = numericRange.interpretation;
        if (
          !isJsonObject(interpretation) ||
          !isNonEmptyString(interpretation.display)
        ) {
          errors.push(
            `${indexLabel} range ${numericIndex + 1} missing interpretation display`,
          );
        }
        const min = numericRange.min;
        const max = numericRange.max;
        const hasMin = typeof min === "number" || isNonEmptyString(min);
        const hasMax = typeof max === "number" || isNonEmptyString(max);
        if (!hasMin && !hasMax) {
          errors.push(
            `${indexLabel} range ${numericIndex + 1} must include min or max`,
          );
        }
      });
    }
  });
};

const getCellValue = (
  row: string[],
  headerMap: Record<string, number>,
  key: string,
) => {
  const index = headerMap[normalizeHeader(key)];
  return index === undefined ? "" : (row[index] ?? "");
};

const buildOptionalCode = (
  system: string | undefined,
  code: string | undefined,
  display: string | undefined,
  errors: string[],
  label: string,
  defaultSystem?: string,
) => {
  const trimmedCode = code?.trim();
  const trimmedDisplay = display?.trim();
  if (!trimmedCode && !trimmedDisplay) {
    return null;
  }
  if (!trimmedCode || !trimmedDisplay) {
    errors.push(`${label} requires both code and display if provided`);
    return null;
  }
  const resolvedSystem = system?.trim() || defaultSystem;
  if (!resolvedSystem) {
    errors.push(`${label} requires system if provided`);
    return null;
  }
  return { system: resolvedSystem, code: trimmedCode, display: trimmedDisplay };
};

const csvEscape = (value: string) => `"${value.replace(/"/g, '""')}"`;

export default function ObservationDefinitionImport({
  facilityId,
}: ObservationDefinitionImportProps) {
  const [currentStep, setCurrentStep] = useState<
    "upload" | "review" | "importing" | "done"
  >("upload");
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [processedRows, setProcessedRows] = useState<ProcessedRow[]>([]);
  const [results, setResults] = useState<ImportResults | null>(null);
  const [totalToImport, setTotalToImport] = useState(0);

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
          const title = getCellValue(row, headerMap, "title").trim();
          const description = getCellValue(
            row,
            headerMap,
            "description",
          ).trim();
          const category = getCellValue(row, headerMap, "category").trim();
          const status = getCellValue(row, headerMap, "status").trim();
          const permittedDataType = getCellValue(
            row,
            headerMap,
            "permitted_data_type",
          ).trim();
          const codeSystem = getCellValue(row, headerMap, "code_system").trim();
          const codeValue = getCellValue(row, headerMap, "code_value").trim();
          const codeDisplay = getCellValue(
            row,
            headerMap,
            "code_display",
          ).trim();

          if (!title) errors.push("Missing title");
          if (!description) errors.push("Missing description");
          if (!category) {
            errors.push("Missing category");
          } else if (!OBSERVATION_CATEGORIES.includes(category as never)) {
            errors.push("Invalid category value");
          }

          if (!permittedDataType) {
            errors.push("Missing permitted_data_type");
          } else if (!QUESTION_TYPES.includes(permittedDataType as never)) {
            errors.push("Invalid permitted_data_type");
          }

          const resolvedCodeSystem =
            codeSystem.trim() || "http://loinc.org";
          if (!codeValue || !codeDisplay) {
            errors.push("Missing code value/display");
          }

          if (status && !OBSERVATION_STATUSES.includes(status as never)) {
            errors.push("Invalid status value");
          }

          const bodySite = buildOptionalCode(
            getCellValue(row, headerMap, "body_site_system").trim(),
            getCellValue(row, headerMap, "body_site_code").trim(),
            getCellValue(row, headerMap, "body_site_display").trim(),
            errors,
            "Body site",
          );
          const method = buildOptionalCode(
            getCellValue(row, headerMap, "method_system").trim(),
            getCellValue(row, headerMap, "method_code").trim(),
            getCellValue(row, headerMap, "method_display").trim(),
            errors,
            "Method",
            "http://snomed.info/sct",
          );
          const permittedUnit = buildOptionalCode(
            getCellValue(row, headerMap, "permitted_unit_system").trim(),
            getCellValue(row, headerMap, "permitted_unit_code").trim(),
            getCellValue(row, headerMap, "permitted_unit_display").trim(),
            errors,
            "Permitted unit",
            "http://unitsofmeasure.org",
          );

          const componentRaw = getCellValue(row, headerMap, "component").trim();
          let component: ObservationComponentPayload[] = [];
          if (componentRaw) {
            try {
              const parsed = JSON.parse(componentRaw);
              if (Array.isArray(parsed)) {
                const allObjects = parsed.every(isJsonObject);
                if (!allObjects) {
                  errors.push("Component must be a JSON array of objects");
                } else {
                  component = parsed as ObservationComponentPayload[];
                  component.forEach((item, componentIndex) => {
                    const indexLabel = `${componentIndex + 1}`;
                    if (
                      !validateCodeObject(
                        item.code,
                        errors,
                        "Component code",
                        indexLabel,
                      )
                    ) {
                      return;
                    }
                    if (!isNonEmptyString(item.permitted_data_type)) {
                      errors.push(
                        `Component ${indexLabel} missing permitted_data_type`,
                      );
                    }
                    if (
                      item.permitted_unit !== undefined &&
                      item.permitted_unit !== null
                    ) {
                      validateCodeObject(
                        item.permitted_unit,
                        errors,
                        "Component permitted unit",
                        indexLabel,
                      );
                    }
                    if (Array.isArray(item.qualified_ranges)) {
                      validateQualifiedRanges(
                        item.qualified_ranges as JsonObject[],
                        errors,
                        `Component ${indexLabel} qualified range`,
                      );
                    } else if (item.qualified_ranges !== undefined) {
                      errors.push(
                        `Component ${indexLabel} qualified_ranges must be an array`,
                      );
                    }
                  });
                }
              } else {
                errors.push("Component must be a JSON array");
              }
            } catch {
              errors.push("Component JSON could not be parsed");
            }
          }

          const qualifiedRangesRaw = getCellValue(
            row,
            headerMap,
            "qualified_ranges",
          ).trim();
          let qualifiedRanges: JsonObject[] = [];
          if (qualifiedRangesRaw) {
            try {
              const parsedRanges = JSON.parse(qualifiedRangesRaw);
              if (Array.isArray(parsedRanges)) {
                const allObjects = parsedRanges.every(isJsonObject);
                if (!allObjects) {
                  errors.push(
                    "Qualified ranges must be a JSON array of objects",
                  );
                } else {
                  qualifiedRanges = parsedRanges as JsonObject[];
                  validateQualifiedRanges(
                    qualifiedRanges,
                    errors,
                    "Qualified range",
                  );
                }
              } else {
                errors.push("Qualified ranges must be a JSON array");
              }
            } catch {
              errors.push("Qualified ranges JSON could not be parsed");
            }
          }

          const data: ObservationRow = {
            title,
            description,
            category,
            status: status || "active",
            code: {
              system: resolvedCodeSystem,
              code: codeValue,
              display: codeDisplay,
            },
            permitted_data_type: permittedDataType,
            component,
            body_site: bodySite,
            method,
            permitted_unit: permittedUnit,
            qualified_ranges: qualifiedRanges,
            derived_from_uri: getCellValue(
              row,
              headerMap,
              "derived_from_uri",
            ).trim(),
          };

          return {
            rowIndex: index + 2,
            data,
            errors,
          };
        });

        setUploadError("");
        setUploadedFileName(file.name);
        setProcessedRows(processed);
        setResults(null);
        setCurrentStep("review");
      } catch (error) {
        setUploadError("Error processing CSV file");
      }
    };
    reader.readAsText(file);
  };

  const downloadSample = () => {
    const headers = [
      "title",
      "description",
      "category",
      "status",
      "code_system",
      "code_value",
      "code_display",
      "permitted_data_type",
      "component",
      "body_site_system",
      "body_site_code",
      "body_site_display",
      "method_system",
      "method_code",
      "method_display",
      "permitted_unit_system",
      "permitted_unit_code",
      "permitted_unit_display",
      "derived_from_uri",
    ];

    const componentExample = JSON.stringify([
      {
        code: {
          system: "http://loinc.org",
          code: "8480-6",
          display: "Systolic blood pressure",
        },
        permitted_data_type: "quantity",
        permitted_unit: {
          system: "http://unitsofmeasure.org",
          code: "mm[Hg]",
          display: "mmHg",
        },
        qualified_ranges: [],
      },
    ]);

    const rows = [
      [
        "Blood Pressure",
        "Systolic blood pressure",
        "vital_signs",
        "active",
        "http://loinc.org",
        "8480-6",
        "Systolic blood pressure",
        "quantity",
        componentExample,
        "",
        "",
        "",
        "http://snomed.info/sct",
        "272394005",
        "Technique",
        "http://unitsofmeasure.org",
        "mm[Hg]",
        "mmHg",
        "",
      ].map(csvEscape),
      [
        "Fasting Blood Sugar",
        "Fasting blood glucose",
        "laboratory",
        "active",
        "http://loinc.org",
        "1558-6",
        "Glucose [Moles/volume] in Serum or Plasma",
        "quantity",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "http://unitsofmeasure.org",
        "mmol/L",
        "mmol/L",
        "",
      ].map(csvEscape),
    ];

    const sampleCSV = `${headers.join(",")}\n${rows
      .map((row) => row.join(","))
      .join("\n")}`;
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_observation_definition.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const runImport = async () => {
    if (!facilityId) {
      setUploadError("Select a facility to import observation definitions");
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
        const slug = await createSlug(row.data.title, 25);
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

        const detailPath = `/api/v1/observation_definition/${slug}/${queryString({ facility: facilityId })}`;
        const listPath = "/api/v1/observation_definition/";

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
              Import Observation Definitions from CSV
            </CardTitle>
            <CardDescription>
              Upload a CSV file to create observation definitions and validate
              them before import.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="observation-definition-csv-upload"
              />
              <label
                htmlFor="observation-definition-csv-upload"
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
                    Required columns: title, description, category,
                    permitted_data_type, code_system, code_value, code_display
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
            <CardTitle>Observation Definition Import Wizard</CardTitle>
            <CardDescription>
              Review and validate observation definitions before importing.
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
              <div className="max-h-80 overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-2 text-left">Row</th>
                      <th className="px-4 py-2 text-left">Title</th>
                      <th className="px-4 py-2 text-left">Category</th>
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
                        <td className="px-4 py-2">{row.data.category}</td>
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
              <Button onClick={runImport} disabled={summary.valid === 0}>
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
            <CardTitle>Importing Observation Definitions</CardTitle>
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
          <CardTitle>Observation Definition Import Results</CardTitle>
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
