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
import type { ImportProgress as ImportProgressData } from "@/hooks/useImportMutation";
import type { ImportResults } from "@/internalTypes/common";
import { CheckCircle2, Download, XCircle } from "lucide-react";
import { useCallback } from "react";

export interface ImportProgressProps {
  /** Resource name for display */
  resourceName: string;

  /** Current progress data */
  progress: ImportProgressData;

  /** Final results (shown when import completes) */
  results: ImportResults | null;

  /** Whether import is currently running */
  isImporting: boolean;

  /** Called when user wants to start a new import */
  onReset: () => void;

  /** Called when user clicks "Back" during import (optional cancel) */
  onBack?: () => void;
}

export function ImportProgress({
  resourceName,
  progress,
  results,
  isImporting,
  onReset,
  onBack,
}: ImportProgressProps) {
  const downloadFailures = useCallback(() => {
    if (!results || results.failures.length === 0) return;

    const csvContent = [
      "Row,Identifier,Reason",
      ...results.failures.map((f) =>
        [
          f.rowIndex,
          f.identifier ?? "",
          `"${f.reason.replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resourceName.toLowerCase()}_import_failures.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [results, resourceName]);

  // Import in progress
  if (isImporting) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Importing {resourceName}s...</CardTitle>
          <CardDescription>
            Please wait while the import is in progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progress.percentComplete} className="h-3" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>
                {progress.processed} of {progress.total} processed
              </span>
              <span>{progress.percentComplete}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Import complete
  if (results) {
    const hasFailures = results.failures.length > 0;
    const allFailed = results.created === 0 && results.updated === 0;
    const allSucceeded = results.failures.length === 0;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {allFailed ? (
              <XCircle className="h-5 w-5 text-red-500" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
            Import {allFailed ? "Failed" : "Complete"}
          </CardTitle>
          <CardDescription>
            {allSucceeded
              ? `All ${resourceName.toLowerCase()}s were imported successfully.`
              : allFailed
                ? `No ${resourceName.toLowerCase()}s were imported.`
                : `Import completed with some issues.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Summary badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-gray-50">
                {results.processed} processed
              </Badge>
              {results.created > 0 && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {results.created} created
                </Badge>
              )}
              {results.updated > 0 && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {results.updated} updated
                </Badge>
              )}
              {results.skipped > 0 && (
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700"
                >
                  {results.skipped} skipped
                </Badge>
              )}
              {results.failed > 0 && (
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  {results.failed} failed
                </Badge>
              )}
            </div>

            {/* Failure details */}
            {hasFailures && (
              <Alert variant="destructive">
                <AlertDescription className="w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {results.failures.length} row(s) failed to import
                      </p>
                      <ul className="mt-2 text-sm list-disc list-inside max-h-32 overflow-auto">
                        {results.failures.slice(0, 5).map((f, i) => (
                          <li key={i}>
                            Row {f.rowIndex}
                            {f.identifier && ` (${f.identifier})`}: {f.reason}
                          </li>
                        ))}
                        {results.failures.length > 5 && (
                          <li>...and {results.failures.length - 5} more</li>
                        )}
                      </ul>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadFailures}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Failures
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="flex justify-between">
              {onBack && (
                <Button variant="outline" onClick={onBack}>
                  Back
                </Button>
              )}
              <Button onClick={onReset} className={onBack ? "" : "ml-auto"}>
                Import More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Fallback (shouldn't happen)
  return null;
}
