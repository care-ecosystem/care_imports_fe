import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import type { Page } from "@playwright/test";

/**
 * Create a temporary CSV file from headers and rows.
 * Returns the absolute file path.
 */
export function createTempCsv(
  headers: string[],
  rows: string[][],
  filename = "test-import.csv",
): string {
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "e2e-csv-"));
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, csvContent, "utf-8");
  return filePath;
}

/**
 * Upload a CSV file to the standard ImportFlow CsvUploader component.
 * Uses `page.setInputFiles` on the hidden file input.
 */
export async function uploadCsvFile(page: Page, filePath: string | string[]) {
  // The CsvUploader uses a hidden <input type="file" accept=".csv">
  const fileInput = page.locator('input[type="file"][accept=".csv"]');
  await fileInput.setInputFiles(filePath);
}

/**
 * Upload a CSV file to the ValueSet import page (which uses a different input).
 */
export async function uploadValueSetCsv(page: Page, filePath: string) {
  const fileInput = page.locator("#valueset-csv-upload");
  await fileInput.setInputFiles(filePath);
}

/**
 * Clean up a temporary file created by createTempCsv.
 */
export function cleanupTempFile(filePath: string) {
  try {
    fs.unlinkSync(filePath);
    fs.rmdirSync(path.dirname(filePath));
  } catch {
    // Ignore cleanup errors
  }
}
