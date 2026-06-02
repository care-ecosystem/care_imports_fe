import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Loader2,
  Upload,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

import { HttpError, request } from "@/apis/request";
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
import valueSetApi from "@/types/valueSet/valueSetApi";
import { downloadCsv } from "@/Utils/csv";
import { mutate } from "@/Utils/request/mutate";
import type {
  GroupedValueSet,
  ProcessedValueSetRow,
  ValueSetImportResults,
} from "@/Utils/valuesetHelpers";
import {
  applyVerificationResults,
  buildValueSetPayload,
  generateSampleValueSetCsv,
  groupRowsBySlug,
  parseValueSetCsv,
  verifyAllCodes,
} from "@/Utils/valuesetHelpers";

type ActiveView =
  | { kind: "upload" }
  | { kind: "verifying"; fileName: string }
  | { kind: "review"; rows: ProcessedValueSetRow[]; fileName: string }
  | {
      kind: "importing";
      rows: ProcessedValueSetRow[];
      fileName: string;
      results: ValueSetImportResults;
    }
  | { kind: "done"; results: ValueSetImportResults };

/**
 * Combined ValueSet import page.
 *
 * Flow: upload → verifying (code lookup) → review (group-based) → importing → done
 *
 * ValueSet imports are group-based (rows grouped by slug): all valid groups
 * are auto-imported. ImportFlow is not used here because ValueSets
 * operate on groups of rows rather than individual rows.
 */
export default function ValueSetImportNew() {
  const [activeView, setActiveView] = useState<ActiveView>({ kind: "upload" });
  const [uploadError, setUploadError] = useState("");
  const [verifyProgress, setVerifyProgress] = useState({ done: 0, total: 0 });
  const cancelRef = useRef(false);

  // ─── Verification (direct async, not useEffect) ───────────────────
  const startVerification = useCallback(
    async (rows: ProcessedValueSetRow[], fileName: string) => {
      cancelRef.current = false;
      setVerifyProgress({ done: 0, total: 0 });
      setActiveView({ kind: "verifying", fileName });

      const verificationMap = await verifyAllCodes(rows, (done, total) => {
        if (cancelRef.current) return;
        setVerifyProgress({ done, total });
      });

      if (cancelRef.current) return;

      const updatedRows = applyVerificationResults(rows, verificationMap);
      setActiveView({ kind: "review", rows: updatedRows, fileName });
    },
    [],
  );

  // ─── Handlers ─────────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    cancelRef.current = true;
    setActiveView({ kind: "upload" });
    setUploadError("");
    setVerifyProgress({ done: 0, total: 0 });
  }, []);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setUploadError("Please upload a valid CSV file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target?.result as string;
        const { rows, error } = parseValueSetCsv(csvText);

        if (error) {
          setUploadError(error);
          return;
        }
        if (rows.length === 0) {
          setUploadError("CSV has no data rows");
          return;
        }

        setUploadError("");
        startVerification(rows, file.name);
      };
      reader.onerror = () => setUploadError("Error reading CSV file");
      reader.readAsText(file);
    },
    [startVerification],
  );

  // ─── Upload Screen ─────────────────────────────────────────────────
  if (activeView.kind === "upload") {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Value Sets from CSV
            </CardTitle>
            <CardDescription>
              Upload a CSV file to create or update value sets. Concept codes
              will be verified before import.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="valueset-csv-upload"
              />
              <label htmlFor="valueset-csv-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium">
                      Click to upload CSV file
                    </p>
                    <p className="text-sm text-gray-500">
                      Required: name, slug, compose_type, system, entry_type
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      downloadCsv(
                        "sample_valueset_import.csv",
                        generateSampleValueSetCsv(),
                      );
                    }}
                  >
                    Download Sample CSV
                  </Button>
                </div>
              </label>
            </div>

            {uploadError && (
              <Alert className="mt-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Verifying Codes ───────────────────────────────────────────────
  if (activeView.kind === "verifying") {
    const pct =
      verifyProgress.total > 0
        ? Math.round((verifyProgress.done / verifyProgress.total) * 100)
        : 0;

    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Verifying Codes
            </CardTitle>
            <CardDescription>
              {verifyProgress.total > 0
                ? `Checking ${verifyProgress.done} / ${verifyProgress.total} unique codes against the server…`
                : "Collecting codes to verify…"}
            </CardDescription>
            {verifyProgress.total > 0 && (
              <div className="mt-4">
                <Progress value={pct} className="h-2" />
              </div>
            )}
          </CardHeader>
        </Card>
      </div>
    );
  }

  // ─── Importing Progress ────────────────────────────────────────────
  if (activeView.kind === "importing") {
    const { results } = activeView;
    const groups = groupRowsBySlug(activeView.rows);
    const validCount = groups.filter(
      (g) =>
        g.errors.length === 0 && g.rows.every((r) => r.errors.length === 0),
    ).length;
    const pct =
      validCount > 0 ? Math.round((results.processed / validCount) * 100) : 0;

    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Importing Value Sets
            </CardTitle>
            <CardDescription>
              {results.processed} / {validCount} processed
            </CardDescription>
            <div className="mt-4">
              <Progress value={pct} className="h-2" />
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // ─── Done ──────────────────────────────────────────────────────────
  if (activeView.kind === "done") {
    const { results } = activeView;
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Value Set Import Complete
            </CardTitle>
            <CardDescription>
              Created: {results.created} · Updated: {results.updated} · Failed:{" "}
              {results.failed}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.failures.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {results.failures.slice(0, 10).map((f) => (
                    <div key={f.slug}>
                      <strong>{f.name || f.slug}:</strong> {f.reason}
                    </div>
                  ))}
                </AlertDescription>
              </Alert>
            )}
            <Button variant="outline" onClick={handleBack}>
              Import Another File
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Review Screen ─────────────────────────────────────────────────
  return (
    <ValueSetReviewScreen
      rows={activeView.rows}
      fileName={activeView.fileName}
      onBack={handleBack}
      onViewChange={setActiveView}
    />
  );
}

// ─── Review Screen Component ─────────────────────────────────────────

interface ValueSetReviewScreenProps {
  rows: ProcessedValueSetRow[];
  fileName: string;
  onBack: () => void;
  onViewChange: (view: ActiveView) => void;
}

function ValueSetReviewScreen({
  rows,
  fileName,
  onBack,
  onViewChange,
}: ValueSetReviewScreenProps) {
  const groups = useMemo(() => groupRowsBySlug(rows), [rows]);
  const [expandedSlugs, setExpandedSlugs] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((slug: string) => {
    setExpandedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }, []);

  const validGroupSlugs = useMemo(
    () =>
      groups
        .filter(
          (g) =>
            g.errors.length === 0 && g.rows.every((r) => r.errors.length === 0),
        )
        .map((g) => g.slug),
    [groups],
  );

  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(
    () => new Set(validGroupSlugs),
  );

  const validCount = validGroupSlugs.length;
  const invalidCount = groups.length - validCount;

  const selectedValidCount = useMemo(
    () => validGroupSlugs.filter((slug) => selectedSlugs.has(slug)).length,
    [selectedSlugs, validGroupSlugs],
  );

  const allValidSelected = validCount > 0 && selectedValidCount === validCount;

  const handleToggleGroup = useCallback((slug: string, isValid: boolean) => {
    if (!isValid) return;
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(
    (checked: boolean) => {
      setSelectedSlugs(checked ? new Set(validGroupSlugs) : new Set());
    },
    [validGroupSlugs],
  );

  const handleImport = useCallback(async () => {
    const selectedGroups = groups.filter(
      (g) =>
        selectedSlugs.has(g.slug) &&
        g.errors.length === 0 &&
        g.rows.every((r) => r.errors.length === 0),
    );

    if (selectedGroups.length === 0) return;

    const results: ValueSetImportResults = {
      processed: 0,
      created: 0,
      updated: 0,
      failed: 0,
      failures: [],
    };

    onViewChange({ kind: "importing", rows, fileName, results });

    for (const group of selectedGroups) {
      await importGroup(group, results);
      onViewChange({
        kind: "importing",
        rows,
        fileName,
        results: { ...results },
      });
    }

    onViewChange({ kind: "done", results });
  }, [groups, selectedSlugs, rows, fileName, onViewChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Value Sets</CardTitle>
        <CardDescription>
          File: {fileName} · Select value sets to import. Groups with errors
          cannot be selected.
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
            {groups.length} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
          <div>
            Selected {selectedValidCount} of {validCount} valid value sets
          </div>
          <div className="flex items-center gap-2">
            <input
              id="valueset-select-all"
              type="checkbox"
              className="rounded border-gray-300"
              checked={allValidSelected}
              onChange={(e) => handleToggleAll(e.target.checked)}
              disabled={validCount === 0}
            />
            <label htmlFor="valueset-select-all" className="cursor-pointer">
              Select all valid value sets
            </label>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="max-h-96 overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left w-12">Select</th>
                  <th className="px-4 py-2 text-left w-8"></th>
                  <th className="px-4 py-2 text-left w-48">Name</th>
                  <th className="px-4 py-2 text-left">Slug</th>
                  <th className="px-4 py-2 text-left">Concepts</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => {
                  const isValid =
                    group.errors.length === 0 &&
                    group.rows.every((r) => r.errors.length === 0);
                  const isSelected = selectedSlugs.has(group.slug);
                  const isExpanded = expandedSlugs.has(group.slug);
                  const ExpandIcon = isExpanded ? ChevronDown : ChevronRight;

                  return (
                    <>
                      <tr
                        key={group.slug}
                        className={`border-t border-gray-100 ${
                          !isValid
                            ? "bg-red-50/50"
                            : isSelected
                              ? "bg-blue-50/30"
                              : ""
                        }`}
                      >
                        <td className="px-4 py-2 align-middle">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={isSelected}
                            onChange={() =>
                              handleToggleGroup(group.slug, isValid)
                            }
                            disabled={!isValid}
                          />
                        </td>
                        <td className="pl-0 pr-2 py-2 align-middle">
                          <button
                            type="button"
                            onClick={() => toggleExpand(group.slug)}
                            className="flex items-center text-gray-400 hover:text-gray-600"
                          >
                            <ExpandIcon className="h-4 w-4" />
                          </button>
                        </td>
                        <td className="px-4 py-2">{group.name || "—"}</td>
                        <td className="px-4 py-2 font-mono text-xs">
                          {group.slug}
                        </td>
                        <td className="px-4 py-2">{group.rows.length}</td>
                        <td className="px-4 py-2">
                          {isValid ? (
                            <span className="text-green-600 text-sm">
                              Valid
                            </span>
                          ) : (
                            <span className="text-red-600 text-sm">
                              {group.errors.length > 0
                                ? group.errors.join(", ")
                                : `${group.rows.filter((r) => r.errors.length > 0).length} row(s) with errors`}
                            </span>
                          )}
                        </td>
                      </tr>
                      {isExpanded &&
                        group.rows.map((row) => (
                          <tr
                            key={`${group.slug}-${row.rowIndex}`}
                            className={`border-t border-gray-50 ${
                              row.errors.length > 0 ? "bg-red-50/30" : ""
                            }`}
                          >
                            <td />
                            <td />
                            <td className="px-4 py-1.5 text-xs text-gray-500">
                              {row.data.system}
                            </td>
                            <td className="px-4 py-1.5 font-mono text-xs text-gray-500">
                              {row.data.code || "—"}
                            </td>
                            <td className="px-4 py-1.5 text-xs text-gray-500">
                              {row.resolvedDisplay || row.data.display || "—"}
                            </td>
                            <td className="px-4 py-1.5">
                              {row.errors.length > 0 ? (
                                <span className="text-red-600 text-xs">
                                  {row.errors.join(", ")}
                                </span>
                              ) : (
                                <span className="text-green-600 text-xs">
                                  Valid
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </>
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
          <Button onClick={handleImport} disabled={selectedValidCount === 0}>
            Import {selectedValidCount} Value Set
            {selectedValidCount !== 1 ? "s" : ""}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Import Helpers ──────────────────────────────────────────────────

async function importGroup(
  group: GroupedValueSet,
  results: ValueSetImportResults,
): Promise<void> {
  try {
    const payload = buildValueSetPayload(group);
    let existingValueSet = undefined;

    try {
      existingValueSet = await request(valueSetApi.get, {
        pathParams: { slug: group.slug },
      });
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
      } else {
        throw error;
      }
    }

    if (existingValueSet) {
      await mutate(valueSetApi.update, {
        pathParams: { slug: group.slug },
      })({ ...payload, id: existingValueSet.id });
      results.updated++;
    } else {
      await mutate(valueSetApi.create)(payload);
      results.created++;
    }
    results.processed++;
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    results.processed++;
    results.failed++;
    results.failures.push({ slug: group.slug, name: group.name, reason });
  }
}
