import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

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
import { MonetaryComponentType } from "@/types/base/monetaryComponent/monetaryComponent";
import { ResourceCategoryResourceType } from "@/types/base/resourceCategory/resourceCategory";
import {
  ChargeItemDefinitionCreate,
  ChargeItemDefinitionStatus,
} from "@/types/billing/chargeItemDefinition/chargeItemDefinition";
import {
  ProductKnowledgeCreate,
  ProductKnowledgeStatus,
  ProductKnowledgeType,
} from "@/types/inventory/productKnowledge/productKnowledge";
import { parseCsvText } from "@/utils/csv";
import { upsertResourceCategories } from "@/utils/resourceCategory";
import { createSlug } from "@/utils/slug";

interface ProductImportProps {
  facilityId?: string;
}

type ItemType = "medication" | "consumable";

interface ProductRow {
  name: string;
  type: ItemType;
  basePrice?: string;
  inventoryQuantity: number;
  dosageForm?: string;
  lot_number?: string;
  expiration_date?: string;
  product_knowledge_name?: string;
  charge_item_definition_name?: string;
}

interface ResolvedRow {
  productKnowledgeName: string;
  chargeItemName?: string;
  productKnowledgeSlug?: string;
  chargeItemSlug?: string;
  productKnowledgeExists: boolean;
  chargeItemExists: boolean;
}

interface ProcessedRow {
  rowIndex: number;
  data: ProductRow;
  errors: string[];
  warnings: string[];
  resolved?: ResolvedRow;
}

interface ImportResults {
  processed: number;
  created: number;
  failed: number;
  skipped: number;
  failures: { rowIndex: number; name?: string; reason: string }[];
}

const REQUIRED_HEADERS = ["name", "type"] as const;

const ITEM_TYPES = ["medication", "consumable"] as const;

const normalizeHeader = (header: string) =>
  header.toLowerCase().replace(/[^a-z0-9]/g, "");

const normalizeName = (value: string) => value.trim().toLowerCase();

const getCellValue = (
  row: string[],
  headerMap: Record<string, number>,
  key: string,
) => {
  const index = headerMap[normalizeHeader(key)];
  return index === undefined ? "" : (row[index] ?? "");
};

const csvEscape = (value: string) => `"${value.replace(/"/g, '""')}"`;

const stripMappingWarnings = (warnings: string[]) =>
  warnings.filter(
    (warning) =>
      !warning.startsWith("Product knowledge not found:") &&
      !warning.startsWith("Charge item definition not found:"),
  );

interface PaginatedResponse<T> {
  results: T[];
}

const buildProductPayload = (
  productKnowledgeSlug: string,
  chargeItemSlug: string | undefined,
  row: ProductRow,
) => {
  const payload: {
    product_knowledge: string;
    status: string;
    extensions: Record<string, unknown>;
    charge_item_definition?: string;
    batch?: { lot_number: string };
    expiration_date?: string;
  } = {
    product_knowledge: productKnowledgeSlug,
    status: "active",
    extensions: {},
  };

  if (chargeItemSlug) {
    payload.charge_item_definition = chargeItemSlug;
  }

  if (row.lot_number?.trim()) {
    payload.batch = { lot_number: row.lot_number.trim() };
  }

  if (row.expiration_date?.trim()) {
    payload.expiration_date = row.expiration_date.trim();
  }

  return payload;
};

export default function ProductImport({ facilityId }: ProductImportProps) {
  const [currentStep, setCurrentStep] = useState<
    "upload" | "review" | "importing" | "done"
  >("upload");
  const [uploadError, setUploadError] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [processedRows, setProcessedRows] = useState<ProcessedRow[]>([]);
  const [results, setResults] = useState<ImportResults | null>(null);
  const [totalToImport, setTotalToImport] = useState(0);
  const [mappingStatus, setMappingStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [mappingIssues, setMappingIssues] = useState<string[]>([]);
  const [lastMappingSignature, setLastMappingSignature] = useState<string>("");

  const summary = useMemo(() => {
    const valid = processedRows.filter((row) => row.errors.length === 0).length;
    const invalid = processedRows.length - valid;
    return { total: processedRows.length, valid, invalid };
  }, [processedRows]);

  const mappingSignature = useMemo(() => {
    if (!facilityId) return "";
    const pkNames = new Set<string>();
    const cidNames = new Set<string>();

    processedRows.forEach((row) => {
      const pkName = row.data.product_knowledge_name?.trim() || row.data.name;
      if (pkName) {
        pkNames.add(pkName);
      }

      const shouldCheckCid =
        Boolean(row.data.charge_item_definition_name?.trim()) ||
        Boolean(row.data.basePrice?.trim());
      if (shouldCheckCid) {
        const cidName =
          row.data.charge_item_definition_name?.trim() || row.data.name;
        if (cidName) {
          cidNames.add(cidName);
        }
      }
    });

    return `${Array.from(pkNames).sort().join("|")}::${Array.from(cidNames)
      .sort()
      .join("|")}`;
  }, [facilityId, processedRows]);

  const resolveMappings = useCallback(async () => {
    if (!facilityId) return;
    if (!mappingSignature) {
      setMappingIssues([]);
      setMappingStatus("ready");
      return;
    }

    setMappingStatus("loading");
    setMappingIssues([]);

    const issues: string[] = [];
    const productKnowledgeMap: Record<string, string | null> = {};
    const chargeItemMap: Record<string, string | null> = {};

    const pkNames = new Set<string>();
    const cidNames = new Set<string>();

    processedRows.forEach((row) => {
      const pkName = row.data.product_knowledge_name?.trim() || row.data.name;
      if (pkName) {
        pkNames.add(pkName);
      }

      const shouldCheckCid =
        Boolean(row.data.charge_item_definition_name?.trim()) ||
        Boolean(row.data.basePrice?.trim());
      if (shouldCheckCid) {
        const cidName =
          row.data.charge_item_definition_name?.trim() || row.data.name;
        if (cidName) {
          cidNames.add(cidName);
        }
      }
    });

    try {
      await Promise.all(
        Array.from(pkNames).map(async (name) => {
          try {
            const response = await request<
              PaginatedResponse<{ name: string; slug: string }>
            >(
              `/api/v1/product_knowledge/${queryString({
                facility: facilityId,
                name,
                limit: 10,
              })}`,
              { method: "GET" },
            );
            const match = response.results.find(
              (item) => normalizeName(item.name) === normalizeName(name),
            );
            productKnowledgeMap[normalizeName(name)] = match?.slug ?? null;
          } catch (error) {
            if (error instanceof APIError && error.status === 404) {
              productKnowledgeMap[normalizeName(name)] = null;
              return;
            }
            issues.push(`Failed to validate product knowledge: ${name}`);
          }
        }),
      );

      await Promise.all(
        Array.from(cidNames).map(async (name) => {
          try {
            const response = await request<
              PaginatedResponse<{ title: string; slug: string }>
            >(
              `/api/v1/facility/${facilityId}/charge_item_definition/${queryString(
                {
                  title: name,
                  limit: 10,
                },
              )}`,
              { method: "GET" },
            );
            const match = response.results.find(
              (item) => normalizeName(item.title) === normalizeName(name),
            );
            chargeItemMap[normalizeName(name)] = match?.slug ?? null;
          } catch (error) {
            if (error instanceof APIError && error.status === 404) {
              chargeItemMap[normalizeName(name)] = null;
              return;
            }
            issues.push(`Failed to validate charge item definition: ${name}`);
          }
        }),
      );
    } catch {
      issues.push("Failed to resolve reference data.");
    }

    setMappingIssues(issues);
    setMappingStatus(issues.length ? "error" : "ready");
    setLastMappingSignature(mappingSignature);

    setProcessedRows((prevRows) =>
      prevRows.map((row) => {
        const productKnowledgeName =
          row.data.product_knowledge_name?.trim() || row.data.name;
        const shouldCheckCid =
          Boolean(row.data.charge_item_definition_name?.trim()) ||
          Boolean(row.data.basePrice?.trim());
        const chargeItemName = shouldCheckCid
          ? row.data.charge_item_definition_name?.trim() || row.data.name
          : undefined;

        const updatedWarnings = stripMappingWarnings(row.warnings);
        const pkSlug = productKnowledgeName
          ? productKnowledgeMap[normalizeName(productKnowledgeName)]
          : null;
        const cidSlug = chargeItemName
          ? chargeItemMap[normalizeName(chargeItemName)]
          : null;
        const pkExists = Boolean(pkSlug);
        const cidExists = chargeItemName ? Boolean(cidSlug) : true;

        if (!pkExists) {
          updatedWarnings.push(
            `Product knowledge not found: ${productKnowledgeName}. It will be created during import.`,
          );
        }

        if (chargeItemName && !cidExists) {
          if (!row.data.basePrice?.trim()) {
            updatedWarnings.push(
              `Charge item definition not found: ${chargeItemName}. It will be skipped because basePrice is missing.`,
            );
          } else {
            updatedWarnings.push(
              `Charge item definition not found: ${chargeItemName}. It will be created during import.`,
            );
          }
        }

        return {
          ...row,
          warnings: updatedWarnings,
          resolved: {
            productKnowledgeName,
            chargeItemName,
            productKnowledgeSlug: pkSlug ?? undefined,
            chargeItemSlug: cidSlug ?? undefined,
            productKnowledgeExists: pkExists,
            chargeItemExists: cidExists,
          },
        };
      }),
    );
  }, [facilityId, mappingSignature, processedRows]);

  useEffect(() => {
    if (currentStep !== "review") return;
    if (!facilityId) return;
    if (!mappingSignature) return;
    if (mappingStatus === "loading") return;
    if (mappingSignature === lastMappingSignature) return;

    resolveMappings();
  }, [
    currentStep,
    facilityId,
    mappingSignature,
    mappingStatus,
    lastMappingSignature,
    resolveMappings,
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
          const warnings: string[] = [];
          const name = getCellValue(row, headerMap, "name").trim();
          const type = getCellValue(row, headerMap, "type").trim();
          const basePrice = getCellValue(row, headerMap, "basePrice").trim();
          const inventoryQuantity = Number.parseInt(
            getCellValue(row, headerMap, "inventoryQuantity").trim(),
            10,
          );

          if (!name) errors.push("Missing name");
          if (!type) errors.push("Missing type");
          if (type && !ITEM_TYPES.includes(type as ItemType)) {
            errors.push("Invalid type (must be medication or consumable)");
          }

          if (!basePrice) {
            warnings.push(
              "Base price is missing. Charge item will not be created unless a charge_item_definition_slug is provided.",
            );
          }

          const data: ProductRow = {
            name,
            type: (type as ItemType) || "consumable",
            basePrice: basePrice || undefined,
            inventoryQuantity: Number.isNaN(inventoryQuantity)
              ? 0
              : inventoryQuantity,
            dosageForm: getCellValue(row, headerMap, "dosageForm").trim(),
            lot_number: getCellValue(row, headerMap, "lot_number").trim(),
            expiration_date: getCellValue(
              row,
              headerMap,
              "expiration_date",
            ).trim(),
            product_knowledge_name: getCellValue(
              row,
              headerMap,
              "product_knowledge_name",
            ).trim(),
            charge_item_definition_name: getCellValue(
              row,
              headerMap,
              "charge_item_definition_name",
            ).trim(),
          };

          return {
            rowIndex: index + 2,
            data,
            errors,
            warnings,
          };
        });

        setUploadError("");
        setUploadedFileName(file.name);
        setProcessedRows(processed);
        setResults(null);
        setMappingIssues([]);
        setMappingStatus("idle");
        setLastMappingSignature("");
        setCurrentStep("review");
      } catch {
        setUploadError("Error processing CSV file");
      }
    };
    reader.readAsText(file);
  };

  const downloadSample = () => {
    const headers = [
      "name",
      "type",
      "basePrice",
      "inventoryQuantity",
      "dosageForm",
      "lot_number",
      "expiration_date",
      "product_knowledge_name",
      "charge_item_definition_name",
    ];

    const rows = [
      [
        "Paracetamol 500mg",
        "medication",
        "12.5",
        "100",
        "tablet",
        "LOT-0001",
        "2027-12-31",
        "Paracetamol",
        "Paracetamol Charge",
      ].map(csvEscape),
      [
        "Surgical Gloves",
        "consumable",
        "",
        "250",
        "",
        "",
        "",
        "Surgical Gloves",
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
    a.download = "sample_product_import.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const runImport = async () => {
    if (!facilityId) {
      setUploadError("Select a facility to import products");
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
      failed: 0,
      skipped: invalidRows,
      failures: [],
    });

    const pkCategories = new Set<string>();
    const cidCategories = new Set<string>();

    validRows.forEach((row) => {
      if (row.data.type === "medication") {
        pkCategories.add("Medicines");
        cidCategories.add("Medications");
      } else {
        pkCategories.add("Consumables");
        cidCategories.add("Consumables");
      }
    });

    const pkCategoryMap = await upsertResourceCategories({
      facilityId,
      categories: Array.from(pkCategories),
      resourceType: ResourceCategoryResourceType.product_knowledge,
      slugPrefix: "pk",
    });
    const cidCategoryMap = await upsertResourceCategories({
      facilityId,
      categories: Array.from(cidCategories),
      resourceType: ResourceCategoryResourceType.charge_item_definition,
      slugPrefix: "cid",
    });

    for (const row of validRows) {
      try {
        const productKnowledgeName =
          row.data.product_knowledge_name?.trim() || row.data.name;
        const chargeItemName =
          row.data.charge_item_definition_name?.trim() || row.data.name;

        let resolvedProductKnowledgeSlug = row.resolved?.productKnowledgeSlug;
        let resolvedChargeItemSlug = row.resolved?.chargeItemSlug;

        if (!row.resolved?.productKnowledgeExists) {
          const slugValue = await createSlug(productKnowledgeName);
          const categoryName =
            row.data.type === "medication" ? "Medicines" : "Consumables";
          const categorySlug = pkCategoryMap.get(normalizeName(categoryName));

          const payload: ProductKnowledgeCreate = {
            facility: facilityId,
            slug_value: slugValue,
            name: row.data.name,
            status: ProductKnowledgeStatus.active,
            names: [],
            storage_guidelines: [],
            product_type:
              row.data.type === "medication"
                ? ProductKnowledgeType.medication
                : ProductKnowledgeType.consumable,
            base_unit: {
              system: "http://unitsofmeasure.org",
              code: "{count}",
              display: "count",
            },
            category: categorySlug ?? "",
            is_instance_level: false,
            definitional: row.data.dosageForm
              ? {
                  dosage_form: {
                    system: "system-medication",
                    code: row.data.dosageForm,
                    display: row.data.dosageForm,
                  },
                  intended_routes: [],
                  ingredients: [],
                  nutrients: [],
                  drug_characteristic: [],
                }
              : undefined,
          };

          const pkResponse = await request<{ slug: string }>(
            `/api/v1/product_knowledge/`,
            {
              method: "POST",
              body: JSON.stringify(payload),
            },
          );
          resolvedProductKnowledgeSlug = pkResponse.slug;
        }

        const shouldCreateCid =
          Boolean(row.data.basePrice?.trim()) &&
          !row.resolved?.chargeItemExists;

        if (shouldCreateCid) {
          const slugValue = await createSlug(chargeItemName);
          const categoryName =
            row.data.type === "medication" ? "Medications" : "Consumables";
          const categorySlug = cidCategoryMap.get(normalizeName(categoryName));
          const payload: ChargeItemDefinitionCreate = {
            title: row.data.name,
            slug_value: slugValue,
            status: ChargeItemDefinitionStatus.active,
            can_edit_charge_item: true,
            category: categorySlug ?? "",
            price_components: [
              {
                monetary_component_type: "base" as MonetaryComponentType,
                amount: row.data.basePrice ?? "",
              },
            ],
          };

          const cidResponse = await request<{ slug: string }>(
            `/api/v1/facility/${facilityId}/charge_item_definition/`,
            {
              method: "POST",
              body: JSON.stringify(payload),
            },
          );
          resolvedChargeItemSlug = cidResponse.slug;
        }

        const productPayload = buildProductPayload(
          resolvedProductKnowledgeSlug ?? "",
          resolvedChargeItemSlug,
          row.data,
        );

        await request(`/api/v1/facility/${facilityId}/product/`, {
          method: "POST",
          body: JSON.stringify(productPayload),
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
                  { rowIndex: row.rowIndex, name: row.data.name, reason },
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
              Import Products from CSV
            </CardTitle>
            <CardDescription>
              Upload a CSV file to validate products, product knowledge, and
              charge items before import.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="product-csv-upload"
              />
              <label htmlFor="product-csv-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium">
                      Click to upload CSV file
                    </p>
                    <p className="text-sm text-gray-500">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Required columns: name, type. Optional columns: basePrice,
                    inventoryQuantity, dosageForm, lot_number, expiration_date,
                    product_knowledge_name, charge_item_definition_name
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
            <CardTitle>Product Import Wizard</CardTitle>
            <CardDescription>
              Review and validate products before importing.
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

            {(mappingStatus === "loading" || mappingIssues.length > 0) && (
              <Alert
                className="mb-4"
                variant={mappingIssues.length > 0 ? "destructive" : "default"}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {mappingStatus === "loading" &&
                    "Validating product knowledge and charge item definitions..."}
                  {mappingIssues.length > 0 && (
                    <div className="space-y-1">
                      {mappingIssues.map((issue) => (
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
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedRows.map((row) => {
                      const notes = [...row.errors, ...row.warnings];
                      return (
                        <tr
                          key={row.rowIndex}
                          className="border-t border-gray-100"
                        >
                          <td className="px-4 py-2 text-gray-500">
                            {row.rowIndex}
                          </td>
                          <td className="px-4 py-2">{row.data.name}</td>
                          <td className="px-4 py-2">{row.data.type}</td>
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
                            {notes.length > 0 ? notes.join("; ") : "-"}
                          </td>
                        </tr>
                      );
                    })}
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
                disabled={
                  summary.valid === 0 ||
                  mappingStatus === "loading" ||
                  mappingStatus === "error"
                }
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
            <CardTitle>Importing Products</CardTitle>
            <CardDescription>
              Please keep this window open while we import your data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <Badge variant="outline">Processed: {processed}</Badge>
              <Badge variant="primary">Created: {results?.created ?? 0}</Badge>
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
          <CardTitle>Product Import Results</CardTitle>
          <CardDescription>
            Import completed. Review the summary and any failed rows below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Badge variant="primary">Created: {results?.created ?? 0}</Badge>
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
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.failures.map((failure) => (
                      <tr
                        key={`${failure.rowIndex}-${failure.name}`}
                        className="border-t border-gray-100"
                      >
                        <td className="px-4 py-2 text-gray-500">
                          {failure.rowIndex}
                        </td>
                        <td className="px-4 py-2">{failure.name ?? "-"}</td>
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
                setMappingIssues([]);
                setMappingStatus("idle");
                setLastMappingSignature("");
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
