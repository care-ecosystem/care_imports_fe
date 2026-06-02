import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProcessedRow, ReviewColumn } from "@/internalTypes/importConfig";
import { useCallback, useMemo, useState } from "react";

export interface ReviewTableProps<TRow> {
  /** Processed rows to display */
  rows: ProcessedRow<TRow>[];

  /** Column definitions */
  columns: ReviewColumn<TRow>[];

  /** Resource name for display */
  resourceName: string;

  /** Called when user clicks "Start Import" with selected row indices */
  onStartImport: (selectedRowIndices: Set<number>) => void;

  /** Called when user clicks "Back" */
  onBack: () => void;

  /** Whether the import button should be disabled */
  importDisabled?: boolean;

  /** Label for the continue/import button */
  continueLabel?: string;

  /** Show row selection checkboxes (default: true) */
  selectable?: boolean;
}

export function ReviewTable<TRow>({
  rows,
  columns,
  resourceName,
  onStartImport,
  onBack,
  importDisabled = false,
  continueLabel,
  selectable,
}: ReviewTableProps<TRow>) {
  const validRowIds = useMemo(
    () =>
      rows.filter((row) => row.errors.length === 0).map((row) => row.rowIndex),
    [rows],
  );

  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(
    () => new Set(validRowIds),
  );

  const validCount = validRowIds.length;
  const invalidCount = rows.length - validCount;

  const selectedValidCount = useMemo(
    () => validRowIds.filter((id) => selectedRowIds.has(id)).length,
    [selectedRowIds, validRowIds],
  );

  const allValidSelected = validCount > 0 && selectedValidCount === validCount;

  const importCount = selectable ? selectedValidCount : validCount;

  const handleToggleRow = useCallback((rowIndex: number, isValid: boolean) => {
    if (!isValid) return;
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowIndex)) {
        next.delete(rowIndex);
      } else {
        next.add(rowIndex);
      }
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(
    (checked: boolean) => {
      setSelectedRowIds(checked ? new Set(validRowIds) : new Set());
    },
    [validRowIds],
  );

  const handleStartImport = useCallback(() => {
    onStartImport(selectable ? selectedRowIds : new Set(validRowIds));
  }, [onStartImport, selectable, selectedRowIds, validRowIds]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review {resourceName}</CardTitle>
        <CardDescription>
          {selectable
            ? "Select items to import. Rows with errors cannot be selected."
            : "Validate data before importing. Rows with errors will be skipped."}
        </CardDescription>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {validCount} valid
          </Badge>
          {invalidCount > 0 && (
            <Badge variant="outline" className="bg-red-50 text-red-700">
              {invalidCount} invalid
            </Badge>
          )}
          <Badge variant="outline" className="bg-gray-50 text-gray-600">
            {rows.length} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {selectable && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
            <div>
              Selected {selectedValidCount} of {validCount} valid rows
            </div>
            <div className="flex items-center gap-2">
              <input
                id="review-table-select-all"
                type="checkbox"
                className="rounded border-gray-300"
                checked={allValidSelected}
                onChange={(e) => handleToggleAll(e.target.checked)}
                disabled={validCount === 0}
              />
              <label
                htmlFor="review-table-select-all"
                className="cursor-pointer"
              >
                Select all valid rows
              </label>
            </div>
          </div>
        )}

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="max-h-[60vh] overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 sticky top-0">
                <tr>
                  {selectable && (
                    <th className="px-4 py-2 text-left w-12">Select</th>
                  )}
                  <th className="px-4 py-2 text-left w-16">Row</th>
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      className={`px-4 py-2 text-left ${col.width ?? ""}`}
                    >
                      {col.header}
                    </th>
                  ))}
                  {invalidCount > 0 && (
                    <th className="px-4 py-2 text-left">Errors</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isValid = row.errors.length === 0;
                  const isSelected = selectedRowIds.has(row.rowIndex);

                  return (
                    <tr
                      key={row.rowIndex}
                      className={`border-t border-gray-100 ${
                        !isValid
                          ? "bg-red-50/50"
                          : selectable && isSelected
                            ? "bg-blue-50/30"
                            : ""
                      }`}
                    >
                      {selectable && (
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={isSelected}
                            onChange={() =>
                              handleToggleRow(row.rowIndex, isValid)
                            }
                            disabled={!isValid}
                          />
                        </td>
                      )}
                      <td className="px-4 py-2 text-gray-500">
                        {row.rowIndex}
                      </td>
                      {columns.map((col, i) => (
                        <td key={i} className="px-4 py-2">
                          {row.data
                            ? typeof col.accessor === "function"
                              ? (col.accessor(row.data) ?? "—")
                              : ((row.data[col.accessor] as string) ?? "—")
                            : "—"}
                        </td>
                      ))}
                      <td className="px-4 py-2">
                        {isValid ? (
                          <span className="text-green-600 text-sm">Valid</span>
                        ) : (
                          <span
                            className="text-red-600 text-sm"
                            title={row.errors.join("\n")}
                          >
                            {row.errors.join(", ")}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={handleStartImport}
            disabled={importDisabled || importCount === 0}
          >
            {continueLabel ??
              `Import ${importCount} ${importCount === 1 ? resourceName : `${resourceName}s`}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
