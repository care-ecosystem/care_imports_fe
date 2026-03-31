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
import { downloadCsv, toCsvString } from "@/utils/export";

interface LocationExportProps {
  facilityId?: string;
}

interface LocationRead {
  id: string;
  name: string;
  form: string;
  description: string;
  status: string;
  parent?: string | null;
  has_children: boolean;
}

const PAGE_SIZE = 100;

const FORM_LABEL_MAP: Record<string, string> = {
  bd: "bed",
  bu: "building",
  ca: "cabinet",
  co: "corridor",
  ho: "house",
  jdn: "jurisdiction",
  lvl: "level",
  rd: "road",
  ro: "room",
  si: "site",
  ve: "vehicle",
  vi: "virtual",
  wa: "ward",
  wi: "wing",
};

/**
 * Given the flat list of locations (with parent IDs),
 * produce a hierarchical CSV where each row represents
 * a leaf-to-root path as: location, type, description (repeated per level).
 */
function buildHierarchicalCsvRows(locations: LocationRead[]): string[][] {
  const byId = new Map<string, LocationRead>();
  const childrenMap = new Map<string, LocationRead[]>();
  const roots: LocationRead[] = [];

  for (const loc of locations) {
    byId.set(loc.id, loc);
    if (!loc.parent) {
      roots.push(loc);
    } else {
      const children = childrenMap.get(loc.parent) ?? [];
      children.push(loc);
      childrenMap.set(loc.parent, children);
    }
  }

  const rows: string[][] = [];
  let maxDepth = 0;

  const walkPath = (loc: LocationRead, pathSoFar: string[]) => {
    const label = FORM_LABEL_MAP[loc.form] ?? loc.form;
    const segment = [loc.name, label, loc.description ?? ""];
    const currentPath = [...pathSoFar, ...segment];

    const children = childrenMap.get(loc.id) ?? [];
    if (children.length === 0) {
      // Leaf node — emit a row
      const depth = currentPath.length / 3;
      if (depth > maxDepth) maxDepth = depth;
      rows.push(currentPath);
    } else {
      for (const child of children) {
        walkPath(child, currentPath);
      }
    }
  };

  for (const root of roots) {
    walkPath(root, []);
  }

  // Pad all rows to the same number of columns
  const totalCols = maxDepth * 3;
  for (const row of rows) {
    while (row.length < totalCols) {
      row.push("");
    }
  }

  return rows;
}

function buildHeaders(maxDepth: number): string[] {
  const headers: string[] = [];
  for (let i = 0; i < maxDepth; i++) {
    const level = i + 1;
    headers.push(`location_${level}`, `type_${level}`, `description_${level}`);
  }
  return headers;
}

export default function LocationExport({ facilityId }: LocationExportProps) {
  if (!facilityId) return null;

  return <LocationExportInner facilityId={facilityId} />;
}

function LocationExportInner({ facilityId }: { facilityId: string }) {
  const separator = "?";
  const apiPath = `/api/v1/facility/${facilityId}/location/`;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["export", "locations", facilityId],
    queryFn: async ({ pageParam = 0 }) => {
      const url = `${apiPath}${separator}limit=${PAGE_SIZE}&offset=${pageParam}`;
      return await request<PaginatedResponse<LocationRead>>(url, {
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

  const allLocations = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data],
  );

  const totalCount = data?.pages[0]?.count ?? 0;
  const fetchedCount = allLocations.length;
  const isFullyLoaded = !hasNextPage && !isFetching && fetchedCount > 0;
  const progressPercent =
    totalCount > 0 ? Math.round((fetchedCount / totalCount) * 100) : 0;

  const handleDownload = useCallback(() => {
    const csvRows = buildHierarchicalCsvRows(allLocations);
    const maxDepth =
      csvRows.length > 0 ? Math.max(...csvRows.map((r) => r.length)) / 3 : 0;
    const headers = buildHeaders(maxDepth);
    const csvText = toCsvString(headers, csvRows);
    downloadCsv(`locations_export_${facilityId}.csv`, csvText);
  }, [allLocations, facilityId]);

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Locations
          </CardTitle>
          <CardDescription>
            Export all locations as a hierarchical CSV file matching the import
            format.
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
                {totalCount} locations ready
              </Badge>
            ) : totalCount === 0 && !isFetching ? (
              <Badge variant="secondary" className="text-sm">
                No locations found
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
                : "Failed to fetch locations."}
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
