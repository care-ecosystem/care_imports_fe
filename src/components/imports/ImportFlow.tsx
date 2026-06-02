import { CsvUploader } from "@/components/imports/CsvUploader";
import { ImportProgress } from "@/components/imports/ImportProgress";
import { ReviewTable } from "@/components/imports/ReviewTable";
import { useImportMutation } from "@/hooks/useImportMutation";
import { buildHeaderMap, validateRow } from "@/internalTypes/common";
import type {
  ImportConfig,
  ImportStep,
  ProcessedRow,
} from "@/internalTypes/importConfig";
import { parseCsvText } from "@/Utils/csv";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ImportFlowProps<
  TRow,
  TCreated = void,
  TBefore = void,
  TPreCreate = void,
> {
  /** Configuration for this import type */
  config: ImportConfig<TRow, TCreated, TBefore, TPreCreate>;

  /** Pre-parsed rows — when provided, skips upload and starts at review */
  processedRows?: ProcessedRow<TRow>[];

  /** Show row selection checkboxes in review table (default: true) */
  selectable?: boolean;

  /** Optional: Disable manual upload (e.g., when master data override is active) */
  disableUpload?: boolean;

  /** Optional: Message to show when upload is disabled */
  disabledMessage?: string;

  /** Callback when user clicks Back from review (only used when processedRows is provided) */
  onBack?: () => void;

  /** Callback when the internal step changes */
  onStepChange?: (step: ImportStep) => void;

  /** Optional: Custom wrapper class */
  className?: string;
}

export function ImportFlow<
  TRow,
  TCreated = void,
  TBefore = void,
  TPreCreate = void,
>({
  config,
  processedRows: externalRows,
  selectable = false,
  disableUpload = false,
  disabledMessage,
  onBack: externalOnBack,
  onStepChange,
  className = "w-full mx-auto",
}: ImportFlowProps<TRow, TCreated, TBefore, TPreCreate>) {
  const hasExternalRows = externalRows !== undefined;
  const needsExternalValidation =
    hasExternalRows && !!config.validateRows && !!config.getRowIdentifier;
  const selectableReview = hasExternalRows ? true : selectable;
  const [currentStep, _setCurrentStep] = useState<ImportStep>(
    hasExternalRows
      ? needsExternalValidation
        ? "validating"
        : "review"
      : "upload",
  );

  const setCurrentStep = useCallback(
    (step: ImportStep) => {
      _setCurrentStep(step);
      onStepChange?.(step);
    },
    [onStepChange],
  );
  const [uploadError, setUploadError] = useState<string>("");
  const [internalRows, setInternalRows] = useState<ProcessedRow<TRow>[]>([]);
  const [validatedExternalRows, setValidatedExternalRows] = useState<
    ProcessedRow<TRow>[] | null
  >(null);

  const processedRows = hasExternalRows
    ? (validatedExternalRows ?? externalRows)
    : internalRows;

  // Run validateRows on external rows when provided
  const hasRunExternalValidation = useRef(false);
  useEffect(() => {
    if (
      !needsExternalValidation ||
      !externalRows ||
      hasRunExternalValidation.current
    )
      return;
    hasRunExternalValidation.current = true;

    runCrossRowValidation(
      externalRows,
      config.validateRows!,
      config.getRowIdentifier!,
    )
      .then((validated) => {
        setValidatedExternalRows(validated);
        setCurrentStep("review");
      })
      .catch(() => {
        setValidatedExternalRows(null);
        setCurrentStep("review");
      });
  }, [needsExternalValidation, externalRows, config]);

  const {
    execute,
    progress,
    results,
    isImporting,
    reset: resetMutation,
  } = useImportMutation<TRow, TCreated, TBefore, TPreCreate>({
    createResource: config.createResource,
    beforeImport: config.beforeImport,
    preCreateUpdate: config.preCreateUpdate,
    postCreate: config.postCreate,
    afterImport: config.afterImport,
    checkExists: config.checkExists,
    updateResource: config.updateResource,
    invalidateKeys: config.invalidateKeys,
    getRowIdentifier: config.getRowIdentifier,
    resolveParent: config.resolveParent,
    batchSize: config.batchSize,
  });

  const handleFileSelect = useCallback(
    (file: File) => {
      if (
        !config.headerMap ||
        !config.requiredHeaders ||
        !config.parseRow ||
        !config.schema
      ) {
        return;
      }

      const { headerMap, requiredHeaders, parseRow, schema } = config;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvText = e.target?.result as string;
          const { headers, rows } = parseCsvText(csvText);

          if (headers.length === 0) {
            setUploadError("CSV is empty or missing headers");
            return;
          }

          // Build header index map
          const headerIndices = buildHeaderMap(headers, headerMap);

          // Check for missing required headers
          const missingHeaders = requiredHeaders.filter(
            (header) => headerIndices[header] === undefined,
          );

          if (missingHeaders.length > 0) {
            setUploadError(
              `Missing required headers: ${missingHeaders.join(", ")}`,
            );
            return;
          }

          // Process each row
          const processed: ProcessedRow<TRow>[] = rows.map((row, index) => {
            const rowIndex = index + 2; // 1-indexed, +1 for header row
            const rawObject = parseRow(row, headerIndices);
            const validation = validateRow(schema, rawObject);

            return {
              rowIndex,
              raw: row,
              errors: validation.success ? [] : validation.errors,
              data: (validation.success ? validation.data : rawObject) as TRow,
            };
          });

          // Run cross-row validation (e.g., circular references, duplicates, reference checks)
          // validateRows may be async (e.g., checking references against the backend)
          if (config.validateRows && config.getRowIdentifier) {
            setUploadError("");
            setInternalRows(processed);
            setCurrentStep("validating");

            // Run async validation in the background
            runCrossRowValidation(
              processed,
              config.validateRows,
              config.getRowIdentifier,
            )
              .then((validatedRows) => {
                setInternalRows(validatedRows);
                setCurrentStep("review");
              })
              .catch((err) => {
                setUploadError(
                  err instanceof Error ? err.message : "Validation failed",
                );
                setCurrentStep("upload");
                setInternalRows([]);
              });
          } else {
            setUploadError("");
            setInternalRows(processed);
            setCurrentStep("review");
          }
        } catch (error) {
          setUploadError(
            error instanceof Error
              ? error.message
              : "Error processing CSV file",
          );
        }
      };
      reader.readAsText(file);
    },
    [config],
  );

  const handleStartImport = useCallback(
    async (selectedRowIndices: Set<number>) => {
      const rowsToImport = processedRows
        .filter(
          (row) =>
            row.errors.length === 0 && selectedRowIndices.has(row.rowIndex),
        )
        .map((row) => row.data);

      if (rowsToImport.length === 0) {
        return;
      }

      setCurrentStep("importing");

      // Handle hierarchical imports with two-pass approach
      if (config.resolveParent && config.getRowIdentifier) {
        const sortedRows = sortByDependencies(
          rowsToImport,
          config.resolveParent,
          config.getRowIdentifier,
        );
        await execute(sortedRows);
      } else {
        await execute(rowsToImport);
      }

      setCurrentStep("done");
    },
    [processedRows, execute, config],
  );

  const handleReset = useCallback(() => {
    if (hasExternalRows) {
      externalOnBack?.();
    } else {
      setCurrentStep("upload");
      setInternalRows([]);
    }
    setUploadError("");
    resetMutation();
  }, [hasExternalRows, externalOnBack, resetMutation]);

  const handleBack = useCallback(() => {
    if (currentStep === "review") {
      if (hasExternalRows) {
        externalOnBack?.();
      } else {
        setCurrentStep("upload");
        setInternalRows([]);
      }
    } else if (currentStep === "done") {
      setCurrentStep("review");
    }
  }, [currentStep, hasExternalRows, externalOnBack]);

  return (
    <div className={className}>
      {currentStep === "upload" && (
        <CsvUploader
          title={`Import ${config.resourceNamePlural ?? config.resourceName + "s"} from CSV`}
          description={config.description}
          onFileSelect={handleFileSelect}
          error={uploadError}
          sampleCsv={config.sampleCsv}
          sampleFilename={`sample_${config.resourceName.toLowerCase()}_import.csv`}
          hints={config.uploadHints}
          disabled={disableUpload}
          disabledMessage={disabledMessage}
        />
      )}

      {currentStep === "validating" && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Validating {processedRows.length} row
            {processedRows.length !== 1 ? "s" : ""}…
          </p>
        </div>
      )}

      {currentStep === "review" && (
        <ReviewTable
          rows={processedRows}
          columns={config.reviewColumns}
          resourceName={config.resourceName}
          onStartImport={handleStartImport}
          onBack={handleBack}
          selectable={selectableReview}
        />
      )}

      {(currentStep === "importing" || currentStep === "done") && (
        <ImportProgress
          resourceName={config.resourceName}
          progress={progress}
          results={results}
          isImporting={isImporting}
          onReset={handleReset}
          onBack={currentStep === "done" ? handleReset : undefined}
        />
      )}
    </div>
  );
}

/**
 * Sort rows by dependency depth for hierarchical imports.
 * Rows without parents come first, then their children, etc.
 */
function sortByDependencies<TRow>(
  rows: TRow[],
  resolveParent: (row: TRow) => string | undefined,
  getRowIdentifier: (row: TRow) => string,
): TRow[] {
  const rowMap = new Map<string, TRow>();
  const childrenMap = new Map<string, TRow[]>();
  const roots: TRow[] = [];

  // Build maps
  for (const row of rows) {
    const id = getRowIdentifier(row);
    rowMap.set(id, row);

    const parentId = resolveParent(row);
    if (!parentId) {
      roots.push(row);
    } else {
      const siblings = childrenMap.get(parentId) ?? [];
      siblings.push(row);
      childrenMap.set(parentId, siblings);
    }
  }

  // BFS to get sorted order
  const sorted: TRow[] = [];
  const queue = [...roots];

  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);

    const id = getRowIdentifier(current);
    const children = childrenMap.get(id) ?? [];
    queue.push(...children);
  }

  // Add any orphans (rows whose parent isn't in the CSV) at the beginning
  const sortedIds = new Set(sorted.map(getRowIdentifier));
  const orphans = rows.filter((row) => !sortedIds.has(getRowIdentifier(row)));

  return [...orphans, ...sorted];
}

/**
 * Run cross-row validation (sync or async) and merge errors into ProcessedRows.
 * Returns a new array of ProcessedRows with cross-row errors appended.
 */
async function runCrossRowValidation<TRow>(
  processed: ProcessedRow<TRow>[],
  validateRows: (
    rows: TRow[],
  ) =>
    | { identifier: string; reason: string }[]
    | Promise<{ identifier: string; reason: string }[]>,
  getRowIdentifier: (row: TRow) => string,
): Promise<ProcessedRow<TRow>[]> {
  const validData = processed
    .filter((p) => p.errors.length === 0)
    .map((p) => p.data);

  const crossRowErrors = await validateRows(validData);

  // Build a map of identifier -> row indices
  const identifierToIndices = new Map<string, number[]>();
  for (const p of processed) {
    const id = getRowIdentifier(p.data);
    const indices = identifierToIndices.get(id) || [];
    indices.push(p.rowIndex);
    identifierToIndices.set(id, indices);
  }

  // Clone processed rows and append cross-row errors
  const result = processed.map((p) => ({ ...p, errors: [...p.errors] }));
  for (const error of crossRowErrors) {
    const rowIndices = identifierToIndices.get(error.identifier);
    if (rowIndices) {
      for (const rowIndex of rowIndices) {
        const row = result.find((p) => p.rowIndex === rowIndex);
        if (row) {
          row.errors.push(error.reason);
        }
      }
    }
  }

  return result;
}
