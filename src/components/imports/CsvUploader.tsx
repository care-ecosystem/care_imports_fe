import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { downloadCsv } from "@/Utils/csv";
import { csvEscape } from "@/Utils/importHelpers";
import { AlertCircle, Download, Upload } from "lucide-react";
import { useCallback, useId, useRef } from "react";

export interface CsvUploaderProps {
  /** Title displayed in the card header */
  title: string;

  /** Description displayed below the title */
  description?: string;

  /** Called when a valid CSV file is selected */
  onFileSelect: (file: File) => void;

  /** Error message to display (e.g., missing headers) */
  error?: string;

  /** Sample CSV data for download */
  sampleCsv?: {
    headers: string[];
    rows: string[][];
  };

  /** Filename for the sample download */
  sampleFilename?: string;

  /** Optional hints shown below the upload area */
  hints?: string[];

  /** Whether the uploader is disabled (e.g., master data override) */
  disabled?: boolean;

  /** Message to show when disabled */
  disabledMessage?: string;
}

export function CsvUploader({
  title,
  description,
  onFileSelect,
  error,
  sampleCsv,
  sampleFilename = "sample.csv",
  hints,
  disabled = false,
  disabledMessage,
}: CsvUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        // Let the parent handle the error through onFileSelect
        // and they can set the error prop
        return;
      }

      onFileSelect(file);

      // Reset input so same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [onFileSelect],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (disabled) return;

      const file = event.dataTransfer.files?.[0];
      if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
        onFileSelect(file);
      }
    },
    [onFileSelect, disabled],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    },
    [],
  );

  const downloadSample = useCallback(() => {
    if (!sampleCsv) return;
    const csvContent = [
      sampleCsv.headers.map(csvEscape).join(","),
      ...sampleCsv.rows?.map((row) => row.map(csvEscape).join(",")),
    ].join("\n");
    downloadCsv(sampleFilename, csvContent);
  }, [sampleCsv, sampleFilename]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {disabled && disabledMessage ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{disabledMessage}</AlertDescription>
          </Alert>
        ) : (
          <>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  inputRef.current?.click();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Upload CSV file"
            >
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id={inputId}
                disabled={disabled}
              />
              <div className="flex flex-col items-center gap-4">
                <Upload className="h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium">
                    Click to upload CSV file
                  </p>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                </div>
                {hints && hints.length > 0 && (
                  <div className="text-xs text-gray-400 space-y-1">
                    {hints.map((hint, i) => (
                      <p key={i}>{hint}</p>
                    ))}
                  </div>
                )}
                {sampleCsv && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadSample();
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Sample CSV
                  </Button>
                )}
              </div>
            </div>

            {error && (
              <Alert className="mt-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
