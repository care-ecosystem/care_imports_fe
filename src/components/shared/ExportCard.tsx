import { useInfiniteQuery } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";

import { request } from "@/apis/request";
import type { QueryParams } from "@/apis/types";
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
import type { PaginatedResponse } from "@/Utils/export";
import { downloadCsv, toCsvString } from "@/Utils/export";

const PAGE_SIZE = 100;

interface ExportCardProps<T> {
  /** Card title */
  title: string;
  /** Card description */
  description: string;
  /** Unique react-query cache key parts */
  queryKey: unknown[];
  /** Typed API route definition for the list endpoint */
  route: { path: string; method: string };
  /** Path parameters for the API route (e.g. { facilityId }) */
  pathParams?: Record<string, string>;
  /** Additional query parameters beyond limit/offset */
  queryParams?: QueryParams;
  /** CSV column headers */
  csvHeaders: string[];
  /** Map a single API result row to CSV column values */
  mapRow: (item: T) => string[];
  /** Filename for the downloaded CSV */
  filename: string;
  /** Optional: transform results from the API before mapping (e.g. unwrap nested objects) */
  transformResults?: (results: T[]) => T[];
  /** Whether the component should fetch (e.g. wait for facilityId) */
  enabled?: boolean;
}

export default function ExportCard<T>({
  title,
  description,
  queryKey,
  route,
  pathParams,
  queryParams: extraQueryParams,
  csvHeaders,
  mapRow,
  filename,
  transformResults,
  enabled = true,
}: ExportCardProps<T>) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["export", ...queryKey],
    queryFn: async ({ pageParam = 0 }) => {
      return (await request(route as never, {
        pathParams,
        queryParams: { ...extraQueryParams, limit: PAGE_SIZE, offset: pageParam },
      } as never)) as PaginatedResponse<T>;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const currentOffset = allPages.length * PAGE_SIZE;
      return currentOffset < lastPage.count ? currentOffset : null;
    },
    enabled,
  });

  // Auto-fetch all pages once the query starts
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allResults = useMemo(() => {
    const flat = data?.pages.flatMap((p) => p.results) ?? [];
    return transformResults ? transformResults(flat) : flat;
  }, [data, transformResults]);

  const totalCount = data?.pages[0]?.count ?? 0;
  const fetchedCount = allResults.length;
  const isFullyLoaded = !hasNextPage && !isFetching && fetchedCount > 0;
  const progressPercent =
    totalCount > 0 ? Math.round((fetchedCount / totalCount) * 100) : 0;

  const handleDownload = () => {
    const rows = allResults.map(mapRow);
    const csvText = toCsvString(csvHeaders, rows);
    downloadCsv(filename, csvText);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status badges */}
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
                {totalCount} records ready
              </Badge>
            ) : totalCount === 0 && !isFetching ? (
              <Badge variant="secondary" className="text-sm">
                No records found
              </Badge>
            ) : null}
          </div>

          {/* Progress bar while fetching */}
          {isFetching && totalCount > 0 && (
            <Progress value={progressPercent} className="h-2" />
          )}

          {/* Error state */}
          {isError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error instanceof Error
                ? error.message
                : "Failed to fetch data. Please try again."}
            </div>
          )}

          {/* Download button */}
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
