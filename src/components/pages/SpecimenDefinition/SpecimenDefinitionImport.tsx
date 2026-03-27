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
import { csvEscape } from "@/utils/importHelpers";
import { AlertCircle, Database, Upload } from "lucide-react";
import { useState } from "react";

import MasterDataFileSelector from "@/components/shared/MasterDataFileSelector";
import SpecimenDefinitionCsvImport from "./SpecimenDefinitionCsvImport";
import SpecimenDefinitionMasterImport from "./SpecimenDefinitionMasterImport";

interface SpecimenDefinitionImportProps {
  facilityId?: string;
}

type ActiveView =
  | { kind: "upload" }
  | { kind: "csv"; csvText: string }
  | { kind: "master-select" }
  | { kind: "master"; csvText: string };

export default function SpecimenDefinitionImport({
  facilityId,
}: SpecimenDefinitionImportProps) {
  const [activeView, setActiveView] = useState<ActiveView>({ kind: "upload" });
  const [uploadError, setUploadError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const { availability, files } = useMasterDataAvailability();
  const repoFileAvailable = availability["specimen-definition"];
  const disableManualUpload = disableOverride && repoFileAvailable;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setUploadError("");
        setUploadedFileName(file.name);
        setActiveView({ kind: "csv", csvText });
      } catch {
        setUploadError("Error reading CSV file");
      }
    };
    reader.readAsText(file);
  };

  const handleBundledImport = () => {
    setActiveView({ kind: "master-select" });
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

  const handleBack = () => {
    setActiveView({ kind: "upload" });
    setUploadedFileName("");
  };

  if (activeView.kind === "csv") {
    return (
      <SpecimenDefinitionCsvImport
        facilityId={facilityId}
        initialCsvText={activeView.csvText}
        onBack={handleBack}
      />
    );
  }

  if (activeView.kind === "master-select") {
    return (
      <MasterDataFileSelector
        title="Specimen Definitions"
        files={files["specimen-definition"]}
        onFileSelected={(csvText) => setActiveView({ kind: "master", csvText })}
        onBack={handleBack}
      />
    );
  }

  if (activeView.kind === "master") {
    return (
      <SpecimenDefinitionMasterImport
        facilityId={facilityId}
        initialCsvText={activeView.csvText}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2 items-start">
      <Card className="h-full">
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
                  Required columns: title, slug_value, description,
                  type_collected_system, type_collected_code,
                  type_collected_display
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
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Import Specimen Definitions from dataset</CardTitle>
          <CardDescription>
            Import data for Specimen Definitions from available master dataset.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1">
          <div className="rounded-lg border border-gray-200 px-6 py-8 text-center text-s">
            <div className="flex flex-col items-center gap-4">
              <Database className="h-12 w-12 text-gray-400" />
              <div className="space-y-3">
                {repoFileAvailable ? (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-lg font-medium text-gray-600">
                      Click to Upload from master dataset
                    </p>
                    <p className="text-xs text-gray-400">
                      A bundled dataset is available in this build. You can
                      import it directly without uploading a CSV file.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBundledImport}
                      disabled={!repoFileAvailable}
                    >
                      Import Master Data
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    No bundled dataset was detected for this build. You can
                    upload a CSV file to import specimen definitions manually.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
