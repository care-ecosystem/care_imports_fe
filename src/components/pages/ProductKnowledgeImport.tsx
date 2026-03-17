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
import { disableOverride } from "@/config";
import { useMasterDataAvailability } from "@/hooks/useMasterDataAvailability";
import { ResourceCategoryResourceType } from "@/types/base/resourceCategory/resourceCategory";
import {
  ProductKnowledgeCreate,
  ProductKnowledgeStatus,
} from "@/types/inventory/productKnowledge/productKnowledge";
import {
  getExistingProductKnowledgeSlugs,
  normalizeProductKnowledgeName,
  parseProductKnowledgeCsv,
  resolveProductKnowledgeDatapoint,
  type ProductKnowledgeProcessedRow,
} from "@/utils/masterImport/productKnowledge";
import { upsertResourceCategories } from "@/utils/resourceCategory";
import { createSlug } from "@/utils/slug";

interface ProductKnowledgeImportProps {
  facilityId?: string;
}

type ProcessedRow = ProductKnowledgeProcessedRow;

interface ImportResults {
  processed: number;
  created: number;
  skipped: number;
  failed: number;
  failures: { rowIndex: number; name?: string; reason: string }[];
}

export default function ProductKnowledgeImport({
  facilityId,
}: ProductKnowledgeImportProps) {
  const [currentStep, setCurrentStep] = useState<
    "upload" | "review" | "importing" | "done"
  >("upload");
  const [uploadError, setUploadError] = useState("");
  const [processedRows, setProcessedRows] = useState<ProcessedRow[]>([]);
  const [results, setResults] = useState<ImportResults | null>(null);
  const { availability } = useMasterDataAvailability();
  const repoFileAvailable = availability["product-knowledge"];
  const disableManualUpload = disableOverride && repoFileAvailable;

  const summary = useMemo(() => {
    const valid = processedRows.filter((row) => row.errors.length === 0).length;
    const invalid = processedRows.length - valid;
    return { total: processedRows.length, valid, invalid };
  }, [processedRows]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disableManualUpload) {
      setUploadError(
        "Manual uploads are disabled because product knowledge data is bundled with this build.",
      );
      return;
    }
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
        setUploadError("");
        setProcessedRows(parseProductKnowledgeCsv(csvText));
        setCurrentStep("review");
      } catch (error) {
        setUploadError("Error processing CSV file");
      }
    };
    reader.readAsText(file);
  };

  const downloadSample = () => {
    const sampleCSV = `resourceCategory,slug,name,productType,codeDisplay,codeValue,baseUnitDisplay,dosageFormDisplay,dosageFormCode,routeCode,routeDisplay,alternateIdentifier,alternateNameType,alternateNameValue
Medication,,Isoflurane inhaler,Medication,Product containing precisely isoflurane 999 milligram/1 milliliter conventional release solution for inhalation,784978007,milligram per milliliter, solution for inhalation,420641004,447694001,Respiratory tract route,,,`;
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_product_knowledge.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const runImport = async () => {
    const validRows = processedRows.filter((row) => row.errors.length === 0);

    if (validRows.length === 0) {
      setResults({
        processed: 0,
        created: 0,
        skipped: 0,
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
      skipped: 0,
      failed: 0,
      failures: [],
    });

    if (!facilityId) return;

    const resourceCategories = [
      ...new Set(validRows.map((row) => row.normalized!.resourceCategory)),
    ];

    const categorySlugMap = await upsertResourceCategories({
      facilityId,
      categories: resourceCategories,
      resourceType: ResourceCategoryResourceType.product_knowledge,
      slugPrefix: "pk",
    });

    const existingSlugs = await getExistingProductKnowledgeSlugs(facilityId);

    for (const row of validRows) {
      const datapoint = await resolveProductKnowledgeDatapoint(row.normalized!);
      if (existingSlugs.has(datapoint.slug)) {
        setResults((prev) =>
          prev
            ? {
                ...prev,
                processed: prev.processed + 1,
                skipped: prev.skipped + 1,
              }
            : prev,
        );
        continue;
      }

      const categorySlug =
        categorySlugMap.get(
          normalizeProductKnowledgeName(datapoint.resourceCategory),
        ) ||
        `f-${facilityId}-pk-${await createSlug(datapoint.resourceCategory)}`;
      const productKnowledge: ProductKnowledgeCreate = {
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
        productKnowledge.code = datapoint.code;
      }

      if (datapoint.dosageForm) {
        productKnowledge.definitional = {
          dosage_form: datapoint.dosageForm,
          intended_routes: datapoint.intendedRoutes,
          ingredients: [],
          nutrients: [],
          drug_characteristic: [],
        };
      }

      if (datapoint.alternateIdentifier) {
        productKnowledge.alternate_identifier = datapoint.alternateIdentifier;
      }

      if (datapoint.alternateNameType && datapoint.alternateNameValue) {
        productKnowledge.names = [
          {
            name_type: datapoint.alternateNameType,
            name: datapoint.alternateNameValue,
          },
        ];
      }

      try {
        await request("/api/v1/product_knowledge/", {
          method: "POST",
          body: JSON.stringify(productKnowledge),
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
                  {
                    rowIndex: row.rowIndex,
                    name: datapoint.name,
                    reason,
                  },
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
              Import Product Knowledge from CSV
            </CardTitle>
            <CardDescription>
              Upload a CSV file to import product knowledge entries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="product-knowledge-upload"
                disabled={disableManualUpload}
              />
              <label
                htmlFor="product-knowledge-upload"
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
                    Expected columns: resourceCategory, slug, name, productType,
                    codeDisplay, codeValue, baseUnitDisplay, dosageFormDisplay,
                    dosageFormCode, routeCode, routeDisplay,
                    alternateIdentifier, alternateNameType, alternateNameValue
                  </p>
                  <Button variant="outline" size="sm" onClick={downloadSample}>
                    Download Sample CSV
                  </Button>
                </div>
              </label>
            </div>

            {disableManualUpload && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Manual uploads are disabled because this build includes a
                  product knowledge dataset in the repository.
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
            <CardTitle>Product Knowledge Import Wizard</CardTitle>
            <CardDescription>
              Review and validate product knowledge before importing
            </CardDescription>
            <div className="mt-4">
              <Progress value={100} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Review All Product Knowledge
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-80 overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="px-4 py-2 text-left">Row</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Type</th>
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
                          <td className="px-4 py-2">
                            {row.normalized?.name || "—"}
                          </td>
                          <td className="px-4 py-2">
                            {row.normalized?.productType || "—"}
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
            <CardTitle>Importing Product Knowledge</CardTitle>
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
          <CardTitle>Product Knowledge Import Complete</CardTitle>
          <CardDescription>
            Created: {results?.created ?? 0} · Skipped: {results?.skipped ?? 0}{" "}
            · Failed: {results?.failed ?? 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results && results.failures.length > 0 && (
            <Alert className="mb-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {results.failures.map((failure) => (
                  <div key={`${failure.rowIndex}-${failure.name}`}>
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
