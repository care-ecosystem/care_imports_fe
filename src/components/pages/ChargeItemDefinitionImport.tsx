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
  ResourceCategoryRead,
  ResourceCategoryResourceType,
  ResourceCategorySubType,
} from "@/types/base/resourceCategory/resourceCategory";
import {
  ChargeItemDefinitionCreate,
  ChargeItemDefinitionStatus,
} from "@/types/billing/chargeItemDefinition/chargeItemDefinition";
import { parseCsvText } from "@/utils/csv";
import { createSlug, isUrlSafeSlug } from "@/utils/slug";

interface ChargeItemImportProps {
  facilityId?: string;
}

const REQUIRED_HEADERS = [
  "title",
  "slug_value",
  "description",
  "purpose",
  "price",
] as const;

type ChargeItemRow = {
  title: string;
  slug_value: string;
  description: string;
  purpose: string;
  price: string;
};

interface ProcessedRow {
  rowIndex: number;
  data: ChargeItemRow;
  errors: string[];
}

interface ImportResults {
  processed: number;
  created: number;
  updated: number;
  failed: number;
  failures: { rowIndex: number; title?: string; reason: string }[];
}

const normalizeHeader = (header: string) =>
  header.toLowerCase().replace(/[^a-z0-9]/g, "");

export default function ChargeItemDefinitionImport({
  facilityId,
}: ChargeItemImportProps) {
  const [categoryTitle, setCategoryTitle] = useState("");
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
            const key = normalizeHeader(header);
            acc[key] = index;
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

        const slugSeen = new Map<string, number>();

        const processed = rows.map((row, index) => {
          const data: ChargeItemRow = {
            title: row[headerMap.title] ?? "",
            slug_value: row[headerMap.slugvalue] ?? "",
            description: row[headerMap.description] ?? "",
            purpose: row[headerMap.purpose] ?? "",
            price: row[headerMap.price] ?? "",
          };

          const errors: string[] = [];
          if (!data.title.trim()) errors.push("Missing title");
          const slugVal = data.slug_value.trim();
          if (!slugVal) {
            errors.push("Missing slug_value");
          } else {
            if (!isUrlSafeSlug(slugVal)) {
              errors.push(
                `slug_value "${slugVal}" contains invalid characters (only lowercase letters, digits, hyphens, and underscores are allowed)`,
              );
            }
            const prevRow = slugSeen.get(slugVal);
            if (prevRow !== undefined) {
              errors.push(
                `Duplicate slug_value "${slugVal}" (first seen in row ${prevRow})`,
              );
            } else {
              slugSeen.set(slugVal, index + 2);
            }
          }
          if (!data.price.trim()) errors.push("Missing price");

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
    const sampleCSV = `title,slug_value,description,purpose,price
Consultation Fee,consultation-fee,Doctor consultation fee,Consultation charge,250
Bed Charges,bed-charges,Per day bed charge,Bed usage,1500`;
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_charge_item_definition.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const runImport = async () => {
    if (!categoryTitle.trim()) {
      setUploadError("Category title is required");
      setCurrentStep("upload");
      return;
    }

    const validRows = processedRows.filter((row) => row.errors.length === 0);
    if (validRows.length === 0) {
      setResults({
        processed: 0,
        created: 0,
        updated: 0,
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
      updated: 0,
      failed: 0,
      failures: [],
    });

    if (!facilityId) return;

    const existingCategories = (await request(
      `/api/v1/facility/${facilityId}/resource_category/?limit=100&resource_type=${ResourceCategoryResourceType.charge_item_definition}&resource_sub_type=${ResourceCategorySubType.other}`,
      { method: "GET" },
    )) as { results: ResourceCategoryRead[] };

    const normalizedTitle = categoryTitle.trim().toLowerCase();
    const existingCategory = existingCategories.results.find(
      (category) => category.title.trim().toLowerCase() === normalizedTitle,
    );

    let categorySlug = existingCategory?.slug_config.slug_value;

    if (!categorySlug) {
      categorySlug = await createSlug(categoryTitle);
      await request(`/api/v1/facility/${facilityId}/resource_category/`, {
        method: "POST",
        body: JSON.stringify({
          title: categoryTitle,
          slug_value: categorySlug,
          resource_type: ResourceCategoryResourceType.charge_item_definition,
          resource_sub_type: ResourceCategorySubType.other,
        }),
      });
    }

    const resourceCategorySlug = `f-${facilityId}-${categorySlug}`;

    for (const row of validRows) {
      try {
        const slug = row.data.slug_value.trim();

        const payload: ChargeItemDefinitionCreate = {
          title: row.data.title,
          slug_value: slug,
          status: ChargeItemDefinitionStatus.active,
          category: resourceCategorySlug,
          description: row.data.description,
          purpose: row.data.purpose,
          can_edit_charge_item: true,
          discount_configuration: null,
          price_components: [
            {
              monetary_component_type: "base",
              amount: row.data.price,
            },
          ],
        };

        const url = `/api/v1/facility/${facilityId}/charge_item_definition/f-${facilityId}-${slug}/`;

        try {
          await request(url, { method: "GET" });
          await request(url, {
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
          if (error instanceof Error && "status" in error) {
            const status = (error as Error & { status?: number }).status;
            if (status !== 404) {
              throw error;
            }
          }
          await request(
            `/api/v1/facility/${facilityId}/charge_item_definition/`,
            {
              method: "POST",
              body: JSON.stringify(payload),
            },
          );
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
              Import Charge Item Definitions from CSV
            </CardTitle>
            <CardDescription>
              Upload a CSV file to import charge item definitions under a
              category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">
                Category Title
              </label>
              <input
                value={categoryTitle}
                onChange={(event) => setCategoryTitle(event.target.value)}
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="e.g. Consultation Charges"
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="charge-item-upload"
              />
              <label htmlFor="charge-item-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium">
                      Click to upload CSV file
                    </p>
                    <p className="text-sm text-gray-500">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Expected columns: title, slug_value, description, purpose,
                    price
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
            <CardTitle>Charge Item Import Wizard</CardTitle>
            <CardDescription>
              Review and validate charge items before importing
            </CardDescription>
            <div className="mt-4">
              <Progress value={100} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Review All Charge Items
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-80 overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-4 py-2 text-left">Row</th>
                        <th className="px-4 py-2 text-left">Title</th>
                        <th className="px-4 py-2 text-left">Price</th>
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
                          <td className="px-4 py-2">{row.data.price}</td>
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
            <CardTitle>Importing Charge Items</CardTitle>
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
          <CardTitle>Charge Item Import Complete</CardTitle>
          <CardDescription>
            Created: {results?.created ?? 0} · Updated: {results?.updated ?? 0}{" "}
            · Failed: {results?.failed ?? 0}
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
