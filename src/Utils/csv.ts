import { buildHeaderMap, validateRow } from "@/internalTypes/common";
import type { ImportConfig, ProcessedRow } from "@/internalTypes/importConfig";

export interface CsvParseResult {
  headers: string[];
  rows: string[][];
}

export function parseCsvText(csvText: string): CsvParseResult {
  const rows = parseCsvRows(csvText);

  if (rows.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = rows[0];
  return { headers, rows: rows.slice(1) };
}

/**
 * Parse CSV text into rows, correctly handling quoted fields that contain
 * newlines, commas, and escaped quotes.
 */
function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++;
        } else {
          // End of quoted field
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(current.trim());
        current = "";
      } else if (char === "\r" || char === "\n") {
        // Skip \n after \r
        if (char === "\r" && text[i + 1] === "\n") {
          i++;
        }
        row.push(current.trim());
        current = "";
        if (row.some((cell) => cell.length > 0)) {
          rows.push(row);
        }
        row = [];
      } else {
        current += char;
      }
    }
  }

  // Handle last field/row
  row.push(current.trim());
  if (row.some((cell) => cell.length > 0)) {
    rows.push(row);
  }

  return rows;
}

/**
 * Split a comma-separated cell value into an array of trimmed, non-empty strings.
 */
export function splitCsvList(value?: string): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Trigger a browser download of a string as a CSV file.
 */
export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

interface CsvParsingConfig<TRow> {
  requiredHeaders?: ImportConfig<TRow>["requiredHeaders"];
  headerMap?: ImportConfig<TRow>["headerMap"];
  schema?: ImportConfig<TRow>["schema"];
  parseRow?: ImportConfig<TRow>["parseRow"];
  validateRows?: ImportConfig<TRow>["validateRows"];
  getRowIdentifier?: ImportConfig<TRow>["getRowIdentifier"];
}

/**
 * Parse a CSV string into ProcessedRow[] using the same pipeline as ImportFlow.
 *
 * Runs: parseCsvText → buildHeaderMap → check required headers →
 *       parseRow per row → Zod validate → sync cross-row validation.
 *
 * Async validateRows is NOT run here — pass the result to ImportFlow
 * with processedRows and let it handle async validation via its
 * "validating" step.
 */
export function parseCsvToProcessedRows<TRow>(
  csvText: string,
  config: CsvParsingConfig<TRow>,
): ProcessedRow<TRow>[] {
  const {
    requiredHeaders,
    headerMap,
    schema,
    parseRow,
    validateRows,
    getRowIdentifier,
  } = config;

  if (!requiredHeaders || !headerMap || !schema || !parseRow) {
    return [];
  }

  const { headers, rows } = parseCsvText(csvText);
  if (headers.length === 0) return [];

  const headerIndices = buildHeaderMap(headers, headerMap);

  const missingHeaders = requiredHeaders.filter(
    (header) => headerIndices[header] === undefined,
  );

  if (missingHeaders.length > 0) {
    return [
      {
        rowIndex: 1,
        raw: [],
        errors: [`Missing required headers: ${missingHeaders.join(", ")}`],
        data: {} as TRow,
      },
    ];
  }

  const processed: ProcessedRow<TRow>[] = rows.map((row, index) => {
    const rowIndex = index + 2;
    const rawObject = parseRow(row, headerIndices);
    const validation = validateRow(schema, rawObject);

    if (!validation.success) {
      return {
        rowIndex,
        raw: row,
        errors: validation.errors,
        data: rawObject as TRow,
      };
    }

    return {
      rowIndex,
      raw: row,
      errors: [],
      data: validation.data as TRow,
    };
  });

  // Sync cross-row validation only
  if (validateRows && getRowIdentifier) {
    const validRows = processed.filter((p) => p.errors.length === 0);
    const validData = validRows.map((p) => p.data);
    const result = validateRows(validData);

    // Only apply if result is synchronous (not a Promise)
    if (!(result instanceof Promise)) {
      const identifierToRows = new Map<string, ProcessedRow<TRow>[]>();
      for (const p of processed) {
        const id = getRowIdentifier(p.data);
        const existing = identifierToRows.get(id) || [];
        existing.push(p);
        identifierToRows.set(id, existing);
      }

      for (const error of result) {
        const matchingRows = identifierToRows.get(error.identifier);
        if (matchingRows) {
          for (const row of matchingRows) {
            row.errors.push(error.reason);
          }
        }
      }
    }
  }

  return processed;
}
