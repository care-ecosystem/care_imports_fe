import { useInfiniteQuery } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

import { request } from "@/apis/request";
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
import type { PaginatedResponse } from "@/utils/export";
import {
  csvEscape,
  downloadCsv,
  stripFacilitySlugPrefix,
  toCsvString,
} from "@/utils/export";
import {
  COMPONENT_CSV_HEADERS,
  OBSERVATION_DEFINITION_CSV_HEADERS,
} from "@/utils/observationDefinitionConstants";

interface ObservationDefinitionExportProps {
  facilityId?: string;
}

interface CodePayload {
  system?: string;
  code?: string;
  display?: string;
}

interface Condition {
  metric: string;
  operation?: string;
  value: unknown;
}

interface RangeBand {
  interpretation?: { display?: string };
  min?: string | number;
  max?: string | number;
}

interface QualifiedRange {
  conditions?: Condition[];
  ranges?: RangeBand[];
}

interface ComponentPayload {
  code?: CodePayload;
  permitted_data_type?: string;
  permitted_unit?: CodePayload | null;
  qualified_ranges?: QualifiedRange[];
}

interface ObservationDefinitionRead {
  id: string;
  title: string;
  slug: string;
  slug_config?: { slug_value: string };
  description?: string;
  category?: string;
  status?: string;
  code?: CodePayload;
  permitted_data_type?: string;
  body_site?: CodePayload | null;
  method?: CodePayload | null;
  permitted_unit?: CodePayload | null;
  derived_from_uri?: string;
  component?: ComponentPayload[];
  qualified_ranges?: QualifiedRange[];
}

const PAGE_SIZE = 100;

/**
 * Build the definitions CSV rows — one row per observation definition,
 * matching OBSERVATION_DEFINITION_CSV_HEADERS.
 */
function buildDefinitionRows(items: ObservationDefinitionRead[]): string[][] {
  return items.map((item) => {
    const slug = stripFacilitySlugPrefix(
      item.slug_config?.slug_value ?? item.slug ?? "",
    );
    return [
      item.title ?? "",
      slug,
      item.description ?? "",
      item.category ?? "",
      item.status ?? "",
      item.code?.system ?? "",
      item.code?.code ?? "",
      item.code?.display ?? "",
      item.permitted_data_type ?? "",
      item.body_site?.system ?? "",
      item.body_site?.code ?? "",
      item.body_site?.display ?? "",
      item.method?.system ?? "",
      item.method?.code ?? "",
      item.method?.display ?? "",
      item.permitted_unit?.system ?? "",
      item.permitted_unit?.code ?? "",
      item.permitted_unit?.display ?? "",
      item.derived_from_uri ?? "",
    ];
  });
}

/**
 * Build the components CSV rows — one row per component × qualified_range × range band,
 * matching COMPONENT_CSV_HEADERS.
 */
function buildComponentRows(items: ObservationDefinitionRead[]): string[][] {
  const rows: string[][] = [];

  for (const item of items) {
    const obsSlug = stripFacilitySlugPrefix(
      item.slug_config?.slug_value ?? item.slug ?? "",
    );

    const components = item.component ?? [];
    for (const comp of components) {
      const compCode = comp.code ?? {};
      const compUnit = comp.permitted_unit ?? {};
      const qualifiedRanges = comp.qualified_ranges ?? [];

      if (qualifiedRanges.length === 0) {
        // Emit a single row with no range data
        rows.push([
          obsSlug,
          compCode.system ?? "",
          compCode.code ?? "",
          compCode.display ?? "",
          comp.permitted_data_type ?? "",
          compUnit?.system ?? "",
          compUnit?.code ?? "",
          compUnit?.display ?? "",
          "", // age_min
          "", // age_max
          "", // age_op
          "", // gender
          "", // range_display
          "", // range_min
          "", // range_max
        ]);
        continue;
      }

      for (const qr of qualifiedRanges) {
        let ageMin = "";
        let ageMax = "";
        let ageOp = "";
        let gender = "";

        for (const cond of qr.conditions ?? []) {
          if (cond.metric === "patient_age") {
            const val = cond.value as {
              min?: number;
              max?: number;
              value_type?: string;
            };
            ageMin = val.min != null ? String(val.min) : "";
            ageMax = val.max != null ? String(val.max) : "";
            ageOp = val.value_type ?? "";
          } else if (cond.metric === "patient_gender") {
            gender = String(cond.value ?? "");
          }
        }

        const rangeBands = qr.ranges ?? [];
        if (rangeBands.length === 0) {
          rows.push([
            obsSlug,
            compCode.system ?? "",
            compCode.code ?? "",
            compCode.display ?? "",
            comp.permitted_data_type ?? "",
            compUnit?.system ?? "",
            compUnit?.code ?? "",
            compUnit?.display ?? "",
            ageMin,
            ageMax,
            ageOp,
            gender,
            "",
            "",
            "",
          ]);
        } else {
          for (const band of rangeBands) {
            rows.push([
              obsSlug,
              compCode.system ?? "",
              compCode.code ?? "",
              compCode.display ?? "",
              comp.permitted_data_type ?? "",
              compUnit?.system ?? "",
              compUnit?.code ?? "",
              compUnit?.display ?? "",
              ageMin,
              ageMax,
              ageOp,
              gender,
              band.interpretation?.display ?? "",
              band.min != null ? String(band.min) : "",
              band.max != null ? String(band.max) : "",
            ]);
          }
        }
      }
    }
  }

  return rows;
}

export default function ObservationDefinitionExport({
  facilityId,
}: ObservationDefinitionExportProps) {
  if (!facilityId) return null;

  return <ObservationDefinitionExportInner facilityId={facilityId} />;
}

function ObservationDefinitionExportInner({
  facilityId,
}: {
  facilityId: string;
}) {
  const apiPath = `/api/v1/observation_definition/?facility=${facilityId}`;
  const separator = "&";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["export", "observation-definition", facilityId],
    queryFn: async ({ pageParam = 0 }) => {
      const url = `${apiPath}${separator}limit=${PAGE_SIZE}&offset=${pageParam}`;
      return await request<PaginatedResponse<ObservationDefinitionRead>>(url, {
        method: "GET",
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const currentOffset = allPages.length * PAGE_SIZE;
      return currentOffset < lastPage.count ? currentOffset : null;
    },
    enabled: Boolean(facilityId),
  });

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allItems = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data],
  );

  const totalCount = data?.pages[0]?.count ?? 0;
  const fetchedCount = allItems.length;
  const isFullyLoaded = !hasNextPage && !isFetching && fetchedCount > 0;
  const progressPercent =
    totalCount > 0 ? Math.round((fetchedCount / totalCount) * 100) : 0;

  const handleDownload = useCallback(() => {
    // Download definitions CSV
    const defRows = buildDefinitionRows(allItems);
    const defCsvText = toCsvString(
      [...OBSERVATION_DEFINITION_CSV_HEADERS],
      defRows,
    );
    downloadCsv(
      `observation_definitions_export_${facilityId}.csv`,
      defCsvText,
    );

    // Download components CSV (only if there are component rows)
    const compRows = buildComponentRows(allItems);
    if (compRows.length > 0) {
      const headerLine = [...COMPONENT_CSV_HEADERS].join(",");
      const dataLines = compRows.map((row) => row.map(csvEscape).join(","));
      const compCsvText = [headerLine, ...dataLines].join("\n");
      downloadCsv(
        `observation_components_export_${facilityId}.csv`,
        compCsvText,
      );
    }
  }, [allItems, facilityId]);

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Observation Definitions
          </CardTitle>
          <CardDescription>
            Export observation definitions and their components as CSV files
            matching the import format.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            {isFetching && !isFullyLoaded ? (
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 text-sm"
              >
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Fetching records… {fetchedCount} / {totalCount || "?"}
              </Badge>
            ) : isFullyLoaded ? (
              <Badge variant="primary" className="text-sm">
                {totalCount} observation definitions ready
              </Badge>
            ) : totalCount === 0 && !isFetching ? (
              <Badge variant="secondary" className="text-sm">
                No observation definitions found
              </Badge>
            ) : null}
          </div>

          {isFetching && totalCount > 0 && (
            <Progress value={progressPercent} className="h-2" />
          )}

          {isError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error instanceof Error
                ? error.message
                : "Failed to fetch observation definitions."}
            </div>
          )}

          <Button
            onClick={handleDownload}
            disabled={!isFullyLoaded || totalCount === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
