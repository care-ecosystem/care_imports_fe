import { useInfiniteQuery } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";

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
import valueSetApi from "@/types/valueSet/valueSetApi";
import { downloadCsv, toCsvString } from "@/Utils/export";
import {
  flattenValueSetToRows,
  VALUESET_CSV_HEADERS,
} from "@/Utils/valuesetHelpers";

const PAGE_SIZE = 100;

interface ValueSetExportProps {
  facilityId?: string;
}

export default function ValueSetExport({ facilityId }: ValueSetExportProps) {
  void facilityId;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["export", "valueset"],
    queryFn: async ({ pageParam = 0 }) => {
      return await request(valueSetApi.list, {
        queryParams: { limit: PAGE_SIZE, offset: pageParam },
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const currentOffset = allPages.length * PAGE_SIZE;
      return currentOffset < lastPage.count ? currentOffset : null;
    },
    enabled: true,
  });

  // Auto-fetch all pages
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allResults = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data],
  );

  const totalCount = data?.pages[0]?.count ?? 0;
  const fetchedCount = allResults.length;
  const isFullyLoaded = !hasNextPage && !isFetching && fetchedCount > 0;
  const progressPercent =
    totalCount > 0 ? Math.round((fetchedCount / totalCount) * 100) : 0;

  const handleDownload = () => {
    const rows: string[][] = [];
    for (const vs of allResults) {
      rows.push(...flattenValueSetToRows(vs));
    }
    const csvText = toCsvString(VALUESET_CSV_HEADERS, rows);
    // Debug: log row count and csvText length
    console.log("Downloading ValueSets CSV:", {
      rowCount: rows.length,
      csvLength: csvText.length,
    });
    downloadCsv("valuesets_export.csv", csvText);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Value Sets
          </CardTitle>
          <CardDescription>
            Export all value sets as a CSV file matching the import format.
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
                {totalCount} value sets ready
              </Badge>
            ) : totalCount === 0 && !isFetching ? (
              <Badge variant="secondary" className="text-sm">
                No value sets found
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
                : "Failed to fetch data. Please try again."}
            </div>
          )}

          <Button
            onClick={handleDownload}
            disabled={fetchedCount === 0}
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
