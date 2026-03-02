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
  ProductKnowledgeBase,
  ProductKnowledgeCreate,
  ProductKnowledgeStatus,
  ProductKnowledgeType,
  ProductNameTypes,
} from "@/types/inventory/productKnowledge/productKnowledge";
import { parseCsvText } from "@/utils/csv";
import { createSlug } from "@/utils/slug";

interface ProductKnowledgeImportProps {
  facilityId?: string;
}

const HEADER_MAP = {
  resourceCategory: 0,
  slug: 1,
  name: 2,
  productType: 3,
  codeDisplay: 4,
  codeValue: 5,
  baseUnitDisplay: 6,
  dosageFormDisplay: 7,
  dosageFormCode: 8,
  routeCode: 9,
  routeDisplay: 10,
  alternateIdentifier: 11,
  alternateNameType: 12,
  alternateNameValue: 13,
};

const REQUIRED_HEADERS = [
  "resourceCategory",
  "name",
  "productType",
  "baseUnitDisplay",
] as const;

const SNOMED_SYSTEM = "http://snomed.info/sct";

const DOSAGE_UNITS_CODES = [
  { system: "http://unitsofmeasure.org", code: "{tbl}", display: "tablets" },
  {
    system: "http://unitsofmeasure.org",
    code: "{Capsule}",
    display: "capsules",
  },
  { system: "http://unitsofmeasure.org", code: "mL", display: "milliliter" },
  { system: "http://unitsofmeasure.org", code: "mg", display: "milligram" },
  { system: "http://unitsofmeasure.org", code: "g", display: "gram" },
  { system: "http://unitsofmeasure.org", code: "ug", display: "microgram" },
  { system: "http://unitsofmeasure.org", code: "L", display: "liter" },
  {
    system: "http://unitsofmeasure.org",
    code: "[iU]",
    display: "international unit",
  },
  { system: "http://unitsofmeasure.org", code: "{count}", display: "count" },
  { system: "http://unitsofmeasure.org", code: "[drp]", display: "drop" },
  {
    system: "http://unitsofmeasure.org",
    code: "mg/mL",
    display: "milligram per milliliter",
  },
] as const;

const parseCsvList = (value?: string) =>
  value
    ? value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
    : [];

interface ProcessedRow {
  rowIndex: number;
  raw: Record<string, string>;
  errors: string[];
  normalized: ReturnType<typeof getValidatedDatapoint> | null;
}

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
        const { rows } = parseCsvText(csvText);

        const processed = rows.map((row, index) => {
          const datapoint = (
            Object.keys(HEADER_MAP) as Array<keyof typeof HEADER_MAP>
          ).reduce(
            (acc, key) => {
              const idx = HEADER_MAP[key];
              acc[key] = row[idx] ?? "";
              return acc;
            },
            {} as Record<keyof typeof HEADER_MAP, string>,
          );

          try {
            const normalized = getValidatedDatapoint(datapoint);
            return {
              rowIndex: index + 2,
              raw: datapoint,
              errors: [],
              normalized,
            };
          } catch (error) {
            return {
              rowIndex: index + 2,
              raw: datapoint,
              errors: [
                error instanceof Error ? error.message : "Validation failed",
              ],
              normalized: null,
            };
          }
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
    const sampleCSV = `resourceCategory,slug,name,productType,codeDisplay,codeValue,baseUnitDisplay,dosageFormDisplay,dosageFormCode,routeCode,routeDisplay,alternateIdentifier,alternateNameType,alternateNameValue
Medicines,,Paracetamol,medication,Paracetamol,12345,tablet,Tablet,123456,123456,Oral,,,`;
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

    await upsertResourceCategories(facilityId, resourceCategories);

    const existingSlugs = await getExistingProductKnowledgeSlugs(facilityId);

    for (const row of validRows) {
      const datapoint = await resolveDatapoint(row.normalized!);
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

      const productKnowledge: ProductKnowledgeCreate = {
        slug_value: datapoint.slug,
        name: datapoint.name,
        facility: facilityId,
        product_type: datapoint.productType,
        status: ProductKnowledgeStatus.active,
        base_unit: datapoint.baseUnit,
        category: `f-${facilityId}-pk-${await createSlug(datapoint.resourceCategory)}`,
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
              />
              <label
                htmlFor="product-knowledge-upload"
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

function getValidatedDatapoint(
  datapoint: Record<keyof typeof HEADER_MAP, string>,
) {
  if (REQUIRED_HEADERS.some((key) => !datapoint[key].trim())) {
    throw new Error("Missing required fields");
  }

  const baseUnit = DOSAGE_UNITS_CODES.find(
    (unit) => unit.display === datapoint.baseUnitDisplay.toLowerCase(),
  );
  if (!baseUnit) {
    throw new Error(
      `Could not resolve base unit for '${datapoint.baseUnitDisplay}'`,
    );
  }

  const slugPromise = datapoint.slug
    ? Promise.resolve(datapoint.slug)
    : createProductKnowledgeSlug(datapoint.name);

  const productType = [
    ProductKnowledgeType.consumable,
    ProductKnowledgeType.medication,
    ProductKnowledgeType.nutritional_product,
  ].find((type) => type === datapoint.productType.toLowerCase());

  if (!productType) {
    throw new Error(`Product type '${datapoint.productType}' is not valid`);
  }

  let alternateNameType: ProductNameTypes | undefined;

  if (datapoint?.alternateNameType) {
    alternateNameType = [
      ProductNameTypes.trade_name,
      ProductNameTypes.alias,
      ProductNameTypes.original_name,
      ProductNameTypes.preferred,
    ].find(
      (type) =>
        type ===
        datapoint?.alternateNameType.toLowerCase().replace(/\s+/g, "_"),
    );

    if (!alternateNameType) {
      throw new Error(
        `Alternate name type '${datapoint.alternateNameType}' is not valid`,
      );
    }
  }

  const dosageFormCode = datapoint.dosageFormCode?.trim();
  const dosageFormDisplay = datapoint.dosageFormDisplay?.trim();

  const routeCodes = parseCsvList(datapoint.routeCode);
  const routeDisplays = parseCsvList(datapoint.routeDisplay);

  const intendedRoutes = routeCodes.map((code, index) => ({
    system: SNOMED_SYSTEM,
    code,
    display: routeDisplays[index] || routeDisplays[0] || code,
  }));

  const dosageForm = dosageFormCode
    ? {
        system: SNOMED_SYSTEM,
        code: dosageFormCode,
        display: dosageFormDisplay || dosageFormCode,
      }
    : undefined;

  const codeValue = datapoint.codeValue?.trim();
  const codeDisplay = datapoint.codeDisplay?.trim();
  const code = codeValue
    ? {
        system: SNOMED_SYSTEM,
        code: codeValue,
        display: codeDisplay || codeValue,
      }
    : undefined;

  return {
    ...datapoint,
    baseUnit,
    slugPromise,
    productType,
    alternateNameType,
    dosageForm,
    intendedRoutes,
    code,
  };
}

async function createProductKnowledgeSlug(name: string) {
  return await createSlug(name);
}

async function resolveDatapoint(
  datapoint: ReturnType<typeof getValidatedDatapoint>,
) {
  const slug = await datapoint.slugPromise;
  return { ...datapoint, slug } as Omit<typeof datapoint, "slugPromise"> & {
    slug: string;
  };
}

async function upsertResourceCategories(
  facilityId: string,
  resourceCategories: string[],
) {
  const existingCategories = (await request(
    `/api/v1/facility/${facilityId}/resource_category/?limit=100&resource_type=${ResourceCategoryResourceType.product_knowledge}&resource_sub_type=${ResourceCategorySubType.other}`,
    { method: "GET" },
  )) as { results: ResourceCategoryRead[] };

  const existingSlugs = new Set(
    existingCategories.results.map((cat) => cat.slug_config.slug_value),
  );
  const categoryEntries = await Promise.all(
    resourceCategories.map(async (category) => ({
      category,
      slug: await createSlug(category),
    })),
  );
  const categorySlugMap = new Map(
    categoryEntries.map(({ category, slug }) => [category, slug]),
  );
  const newDatapoints = categoryEntries
    .filter(({ slug }) => !existingSlugs.has(`pk-${slug}`))
    .map(({ category }) => category);

  if (newDatapoints.length === 0) {
    return;
  }

  await request(`/api/v1/facility/${facilityId}/resource_category/upsert/`, {
    method: "POST",
    body: JSON.stringify({
      datapoints: newDatapoints.map((data) => {
        const slug = categorySlugMap.get(data);
        if (!slug) {
          throw new Error(`Missing slug for category: ${data}`);
        }
        return {
          title: data,
          slug_value: `pk-${slug}`,
          resource_type: ResourceCategoryResourceType.product_knowledge,
          resource_sub_type: ResourceCategorySubType.other,
        };
      }),
    }),
  });
}

async function getExistingProductKnowledgeSlugs(facilityId: string) {
  const results: ProductKnowledgeBase[] = [];

  let hasNextPage = true;
  let page = 0;

  while (hasNextPage) {
    const response = (await request(
      `/api/v1/product_knowledge/?facility=${facilityId}&limit=100&offset=${page * 100}`,
      { method: "GET" },
    )) as { results: ProductKnowledgeBase[] };

    results.push(...response.results);

    if (response.results.length < 100) {
      hasNextPage = false;
    }

    page++;
  }

  return new Set(results.map((pk) => pk.slug_config.slug_value));
}
