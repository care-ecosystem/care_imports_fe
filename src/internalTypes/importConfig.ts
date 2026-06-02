import type { ImportResults } from "@/internalTypes/common";
import type { z } from "zod";

/**
 * Additional parameters passed to createResource by the import hook.
 * Can be spread into API payloads.
 */
export type ImportParams = Record<string, unknown>[];

/**
 * Configuration for a specific import type.
 * Each import page provides a config object implementing this interface.
 *
 * CSV-specific fields (parsing, schema, sampleCsv, etc.) are optional —
 * they're only needed when ImportFlow owns CSV upload. When `processedRows`
 * is provided externally, only the review + import fields are required.
 *
 * @template TRow - The validated row type from CSV
 * @template TCreated - Return type of createResource (defaults to void)
 * @template TBefore - Return type of beforeImport hook (defaults to void)
 * @template TPreCreate - Return type of preCreate hook (defaults to void)
 */
export interface ImportConfig<
  TRow,
  TCreated = void,
  TBefore = void,
  TPreCreate = void,
> {
  // ─── Resource Info ─────────────────────────────────────────────────
  /** Display name for the resource type (e.g., "Users", "Locations") */
  resourceName: string;

  /** Plural display name (defaults to resourceName + "s") */
  resourceNamePlural?: string;

  // ─── Parsing (optional — only needed when ImportFlow owns CSV upload) ───
  /** Headers that must be present in the CSV */
  requiredHeaders?: readonly string[];

  /** Map of normalized header names to canonical field names */
  headerMap?: Record<string, string>;

  /** Zod schema for validating parsed rows (output type must match TRow, input can differ due to transforms) */
  schema?: z.ZodType<TRow, z.ZodTypeDef, unknown>;

  /**
   * Transform a raw CSV row array into an object for validation.
   * @param row - Array of cell values from a single CSV row
   * @param headerIndices - Map of canonical field name → column index
   */
  parseRow?: (
    row: string[],
    headerIndices: Record<string, number>,
  ) => Record<string, unknown>;

  // ─── Lifecycle Hooks ───────────────────────────────────────────────
  /**
   * Optional hook to run once before processing any rows.
   * Useful for setup tasks like ensuring categories exist.
   * @returns Data to be passed to preCreate
   */
  beforeImport?: () => Promise<TBefore>;

  /**
   * Optional hook to run per-row before createResource.
   * Useful for creating dependent resources (e.g., ProductKnowledge before Product).
   * @param row - Validated row data
   * @param beforeResult - Result from beforeImport hook
   * @returns Data to be passed to createResource/updateResource
   */
  preCreateUpdate?: (row: TRow, beforeResult: TBefore) => Promise<TPreCreate>;

  /**
   * Optional hook to run once after all rows are processed.
   * Useful for batch operations like creating delivery orders.
   * @param results - Import results summary
   * @param createdItems - Array of all successfully created items
   */
  afterImport?: (
    results: ImportResults,
    createdItems: TCreated[],
  ) => Promise<void>;

  // ─── API Operations ────────────────────────────────────────────────
  /**
   * Check if a resource already exists.
   * @returns The existing resource ID if found, undefined otherwise
   */
  checkExists?: (row: TRow) => Promise<string | undefined>;

  /**
   * Create a new resource from a validated row.
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
   * Update an existing resource (called when checkExists returns an ID).
   * @param id - The existing resource ID
   * @param row - Validated row data
   * @param preCreateResult - Result from preCreate hook (if provided)
   */
  updateResource?: (
    id: string,
    row: TRow,
    preCreateResult?: TPreCreate,
  ) => Promise<void>;

  /** Optional post-creation hook (e.g., create inventory after product) */
  postCreate?: (row: TRow, created: TCreated) => Promise<void>;

  // ─── Cross-Row Validation ──────────────────────────────────────────
  /**
   * Validate all rows together (e.g., detect circular references, duplicates,
   * or reference existence against the backend).
   * Called after individual row validation.
   * May return synchronously or asynchronously.
   */
  validateRows?: (
    rows: TRow[],
  ) =>
    | { identifier: string; reason: string }[]
    | Promise<{ identifier: string; reason: string }[]>;

  // ─── Hierarchical Support ──────────────────────────────────────────
  /**
   * For hierarchical imports (Location, Department):
   * Returns the identifier of the parent row, or undefined if no parent.
   */
  resolveParent?: (row: TRow) => string | undefined;

  /**
   * Returns a unique identifier for the row (used for dependency ordering and ID tracking).
   * Required if resolveParent is provided.
   */
  getRowIdentifier?: (row: TRow) => string;

  // ─── Execution ─────────────────────────────────────────────────────
  /** Number of rows to process in parallel. Default: 1 (sequential) */
  batchSize?: number;

  /** Query keys to invalidate after import completes */
  invalidateKeys?: string[][];

  // ─── UI ────────────────────────────────────────────────────────────
  /** Sample CSV data for download */
  sampleCsv?: {
    headers: string[];
    rows: string[][];
  };

  /** Columns to display in the review table */
  reviewColumns: ReviewColumn<TRow>[];

  /** Optional description shown in the upload card */
  description?: string;

  /** Optional hints shown below the upload area */
  uploadHints?: string[];
}

/**
 * Column configuration for the review table.
 */
export interface ReviewColumn<TRow> {
  /** Column header text */
  header: string;

  /** Width class (e.g., "w-24", "w-48") */
  width?: string;

  /** Accessor function or field key */
  accessor: keyof TRow | ((row: TRow) => string | number | undefined);
}

/**
 * Represents a parsed and validated row ready for review.
 */
export interface ProcessedRow<TRow> {
  /** Original row index in CSV (1-indexed, accounting for header) */
  rowIndex: number;

  /** Raw cell values from CSV */
  raw: string[];

  /** Validation errors (empty if row is valid) */
  errors: string[];

  /** Parsed data (always present for display, check errors for validity) */
  data: TRow;
}

/**
 * Step in the import flow state machine.
 */
export type ImportStep =
  | "upload"
  | "validating"
  | "review"
  | "importing"
  | "done";
