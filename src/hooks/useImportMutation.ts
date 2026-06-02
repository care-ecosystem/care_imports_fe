import type { ImportFailure, ImportResults } from "@/internalTypes/common";
import { createEmptyResults } from "@/internalTypes/common";
import type { ImportParams } from "@/internalTypes/importConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export interface UseImportMutationOptions<
  TRow,
  TCreated = void,
  TBefore = void,
  TPreCreate = void,
> {
  /**
   * Function to create a single resource from a row.
   * @param row - Validated row data
   * @param params - Additional params (e.g., parentId for hierarchical imports)
   * @param preCreateResult - Result from preCreate hook (if provided)
   */
  createResource: (
    row: TRow,
    params: ImportParams,
    preCreateResult?: TPreCreate,
  ) => Promise<TCreated>;

  /**
   * Optional function to run once before processing any rows.
   * Useful for setup tasks like ensuring categories exist.
   * @returns Data to be passed to preCreate and createResource
   */
  beforeImport?: () => Promise<TBefore>;

  /**
   * Optional function to run per-row before createResource/updateResource.
   * Useful for creating dependent resources (e.g., ProductKnowledge before Product).
   * @param row - Validated row data
   * @param beforeResult - Result from beforeImport hook
   * @returns Data to be passed to createResource/updateResource
   */
  preCreateUpdate?: (row: TRow, beforeResult: TBefore) => Promise<TPreCreate>;

  /**
   * Optional function to run after creation (e.g., create inventory delivery after product).
   */
  postCreate?: (row: TRow, created: TCreated) => Promise<void>;

  /**
   * Optional function to run once after all rows are processed.
   * Useful for batch operations like creating delivery orders.
   * @param results - Import results summary
   * @param createdItems - Array of all successfully created items
   */
  afterImport?: (
    results: ImportResults,
    createdItems: TCreated[],
  ) => Promise<void>;

  /**
   * Optional function to check if resource already exists.
   * Returns the existing ID if found, undefined otherwise.
   */
  checkExists?: (row: TRow) => Promise<string | undefined>;

  /**
   * Optional function to update an existing resource.
   * @param id - The existing resource ID
   * @param row - Validated row data
   * @param preCreateResult - Result from preCreate hook (if provided)
   */
  updateResource?: (
    id: string,
    row: TRow,
    preCreateResult?: TPreCreate,
  ) => Promise<void>;

  /**
   * Query keys to invalidate after import completes.
   */
  invalidateKeys?: string[][];

  /**
   * Extract a unique identifier from a row (used for dependency tracking and error reporting).
   */
  getRowIdentifier?: (row: TRow) => string;

  /**
   * For hierarchical imports: returns the parent's identifier from a row.
   * The hook will look up the parent's created ID automatically.
   */
  resolveParent?: (row: TRow) => string | undefined;

  /**
   * Batch size for parallel processing. Default: 1 (sequential).
   */
  batchSize?: number;
}

export interface ImportProgress {
  total: number;
  processed: number;
  percentComplete: number;
}

export interface UseImportMutationReturn<TRow> {
  /**
   * Execute import for the given rows.
   */
  execute: (rows: TRow[]) => Promise<ImportResults>;

  /**
   * Current import progress.
   */
  progress: ImportProgress;

  /**
   * Final results after import completes.
   */
  results: ImportResults | null;

  /**
   * Whether import is currently running.
   */
  isImporting: boolean;

  /**
   * Reset state for a new import.
   */
  reset: () => void;
}

export function useImportMutation<
  TRow,
  TCreated = void,
  TBefore = void,
  TPreCreate = void,
>(
  options: UseImportMutationOptions<TRow, TCreated, TBefore, TPreCreate>,
): UseImportMutationReturn<TRow> {
  const {
    createResource,
    beforeImport,
    preCreateUpdate,
    postCreate,
    afterImport,
    checkExists,
    updateResource,
    invalidateKeys = [],
    getRowIdentifier,
    resolveParent,
    batchSize = 1,
  } = options;

  const queryClient = useQueryClient();

  const [progress, setProgress] = useState<ImportProgress>({
    total: 0,
    processed: 0,
    percentComplete: 0,
  });

  const [results, setResults] = useState<ImportResults | null>(null);

  const mutation = useMutation({
    mutationFn: async (rows: TRow[]): Promise<ImportResults> => {
      const importResults = createEmptyResults();

      // Track created resource IDs for hierarchical imports
      const createdIds = new Map<string, string>();

      // Collect created items for afterImport
      const createdItems: TCreated[] = [];

      setProgress({
        total: rows.length,
        processed: 0,
        percentComplete: 0,
      });

      // Run beforeImport hook (once before all rows)
      let beforeResult: TBefore | undefined;
      if (beforeImport) {
        beforeResult = await beforeImport();
      }

      // Process rows in batches
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);

        // Process batch (in parallel if batchSize > 1, sequential for hierarchical)
        const batchResults = await Promise.all(
          batch.map(async (row, batchIndex) => {
            const rowIndex = i + batchIndex + 2; // +2 for 1-indexed + header row
            // Run preCreateUpdate hook for creates/updates (if it exists)
            let preCreateUpdateResult: TPreCreate | undefined;
            if (preCreateUpdate) {
              preCreateUpdateResult = await preCreateUpdate(
                row,
                beforeResult as TBefore,
              );
            }

            try {
              // Check if resource already exists
              if (checkExists) {
                const existingId = await checkExists(row);
                if (existingId) {
                  // Store existing ID for hierarchical lookups
                  if (getRowIdentifier) {
                    createdIds.set(getRowIdentifier(row), existingId);
                  }
                  if (updateResource) {
                    await updateResource(
                      existingId,
                      row,
                      preCreateUpdateResult,
                    );
                    return { status: "updated" as const, created: undefined };
                  }
                  return { status: "skipped" as const, created: undefined };
                }
              }

              // Build params for createResource
              const params: ImportParams = [];
              if (resolveParent) {
                const parentIdentifier = resolveParent(row);
                if (parentIdentifier) {
                  params.push({ parent: createdIds.get(parentIdentifier) });
                }
              }

              // Create the resource
              const created = await createResource(
                row,
                params,
                preCreateUpdateResult,
              );

              // Store created ID for hierarchical lookups
              if (getRowIdentifier) {
                const identifier = getRowIdentifier(row);
                // Extract ID from created resource (assumes { id: string } shape or string)
                const createdId =
                  typeof created === "string"
                    ? created
                    : (created as { id?: string })?.id;
                if (createdId) {
                  createdIds.set(identifier, createdId);
                }
              }

              // Run post-create hook if provided
              if (postCreate) {
                await postCreate(row, created);
              }

              return { status: "created" as const, created };
            } catch (error) {
              const reason =
                error instanceof Error ? error.message : "Unknown error";
              return {
                status: "failed" as const,
                created: undefined,
                failure: {
                  rowIndex,
                  identifier: getRowIdentifier?.(row),
                  reason,
                } as ImportFailure,
              };
            }
          }),
        );

        // Aggregate results
        for (const result of batchResults) {
          importResults.processed++;
          importResults[result.status]++;
          if (result.status === "failed" && result.failure) {
            importResults.failures.push(result.failure);
          }
          if (result.status === "created" && result.created !== undefined) {
            createdItems.push(result.created);
          }
        }

        // Update progress
        setProgress({
          total: rows.length,
          processed: importResults.processed,
          percentComplete: Math.round(
            (importResults.processed / rows.length) * 100,
          ),
        });
      }

      // Run afterImport hook (once after all rows)
      if (afterImport && createdItems.length > 0) {
        await afterImport(importResults, createdItems);
      }

      return importResults;
    },
    onSuccess: (data) => {
      setResults(data);

      // Invalidate specified query keys
      for (const key of invalidateKeys) {
        queryClient.invalidateQueries({ queryKey: key });
      }
    },
    onError: (error) => {
      console.error("Import failed:", error);
    },
  });

  const execute = useCallback(
    async (rows: TRow[]): Promise<ImportResults> => {
      return mutation.mutateAsync(rows);
    },
    [mutation],
  );

  const reset = useCallback(() => {
    setProgress({ total: 0, processed: 0, percentComplete: 0 });
    setResults(null);
    mutation.reset();
  }, [mutation]);

  return {
    execute,
    progress,
    results,
    isImporting: mutation.isPending,
    reset,
  };
}
