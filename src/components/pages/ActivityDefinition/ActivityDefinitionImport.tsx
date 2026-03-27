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
import { downloadSampleCsv } from "@/utils/activityDefinitionHelper";
import { AlertCircle, Database, Upload } from "lucide-react";
import { useState } from "react";

import MasterDataFileSelector from "@/components/shared/MasterDataFileSelector";
import ActivityDefinitionCsvImport from "./ActivityDefinitionCsvImport";
import ActivityDefinitionMasterImport from "./ActivityDefinitionMasterImport";

interface ActivityDefinitionImportProps {
  facilityId?: string;
}

type ActiveView =
  | { kind: "upload" }
  | { kind: "csv"; csvText: string }
  | { kind: "master-select" }
  | { kind: "master"; csvText: string };

export default function ActivityDefinitionImport({
  facilityId,
}: ActivityDefinitionImportProps) {
  const [activeView, setActiveView] = useState<ActiveView>({ kind: "upload" });
  const [uploadError, setUploadError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const { availability, files } = useMasterDataAvailability();
  const repoFileAvailable = availability["activity-definition"];
  const disableManualUpload = disableOverride && repoFileAvailable;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disableManualUpload) {
      setUploadError(
        "Manual uploads are disabled because activity definition data is bundled with this build.",
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

  const handleBack = () => {
    setActiveView({ kind: "upload" });
    setUploadedFileName("");
  };

  if (activeView.kind === "csv") {
    return (
      <ActivityDefinitionCsvImport
        facilityId={facilityId}
        initialCsvText={activeView.csvText}
        onBack={handleBack}
      />
    );
  }

  if (activeView.kind === "master-select") {
    return (
      <MasterDataFileSelector
        title="Activity Definitions"
        files={files["activity-definition"]}
        onFileSelected={(csvText) => setActiveView({ kind: "master", csvText })}
        onBack={handleBack}
      />
    );
  }

  if (activeView.kind === "master") {
    return (
      <ActivityDefinitionMasterImport
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
            Import Activity Definitions from CSV
          </CardTitle>
          <CardDescription>
            Upload a CSV file to create activity definitions and validate them
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
              id="activity-definition-csv-upload"
              disabled={disableManualUpload}
            />
            <label
              htmlFor="activity-definition-csv-upload"
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
                  Required columns: title, slug_value, description, usage,
                  status, classification, category_name, code_system,
                  code_value, code_display
                </p>
                <Button variant="outline" size="sm" onClick={downloadSampleCsv}>
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
                Manual uploads are disabled because this build includes an
                activity definition dataset in the repository.
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
          <CardTitle>Import Activity Definitions from dataset</CardTitle>
          <CardDescription>
            Check if this build already includes an activity definition dataset.
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
                      Import data for Activity Definitions from available master
                      dataset.
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
                    upload a CSV file to import activity definitions manually.
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
