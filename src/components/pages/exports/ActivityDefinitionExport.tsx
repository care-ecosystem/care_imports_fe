import { useInfiniteQuery } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  downloadCsv,
  stripFacilitySlugPrefix,
  toCsvString,
} from "@/utils/export";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ActivityDefinitionExportProps {
  facilityId?: string;
}

interface CodePayload {
  system?: string;
  code?: string;
  display?: string;
}

interface SlugRef {
  slug?: string;
  slug_config?: { slug_value: string };
}

interface LocationRef {
  id?: string;
  name?: string;
}

interface HealthcareServiceRef {
  id?: string;
  name?: string;
}

interface ResourceCategoryRef {
  title?: string;
  slug?: string;
}

/** Shape returned by both the list and detail endpoints. */
interface ActivityDefinitionRead {
  id: string;
  title: string;
  slug: string;
  slug_config?: { slug_value: string };
  description?: string;
  usage?: string;
  status?: string;
  classification?: string;
  kind?: string;
  code?: CodePayload;
  body_site?: CodePayload | null;
  diagnostic_report_codes?: CodePayload[];
  derived_from_uri?: string;
  category?: ResourceCategoryRef;
  specimen_requirements?: (SlugRef & Record<string, unknown>)[];
  observation_result_requirements?: (SlugRef & Record<string, unknown>)[];
  charge_item_definitions?: (SlugRef & Record<string, unknown>)[];
  locations?: LocationRef[];
  healthcare_service?: HealthcareServiceRef | null;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 100;
/** Max concurrent detail requests to avoid hammering the server. */
const DETAIL_CONCURRENCY = 5;

const CSV_HEADERS = [
  "title",
  "slug_value",
  "description",
  "usage",
  "status",
  "classification",
  "kind",
  "category_name",
  "code_system",
  "code_value",
  "code_display",
  "diagnostic_report_system",
  "diagnostic_report_code",
  "diagnostic_report_display",
  "specimen_slugs",
  "observation_slugs",
  "charge_item_slugs",
  "location_names",
  "healthcare_service_name",
  "derived_from_uri",
  "body_site_system",
  "body_site_code",
  "body_site_display",
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function extractSlug(ref: SlugRef): string {
  return ref.slug_config?.slug_value ?? stripFacilitySlugPrefix(ref.slug ?? "");
}

/**
 * Fetch detail endpoints in batches with a concurrency cap.
 * Returns an array of enriched items in the same order as `slugs`.
 */
async function fetchDetails(
  facilityId: string,
  slugs: string[],
  onProgress: (done: number) => void,
): Promise<ActivityDefinitionRead[]> {
  const results: ActivityDefinitionRead[] = new Array(slugs.length);
  let completed = 0;

  // Process in chunks of DETAIL_CONCURRENCY
  for (let i = 0; i < slugs.length; i += DETAIL_CONCURRENCY) {
    const batch = slugs.slice(i, i + DETAIL_CONCURRENCY);
    const promises = batch.map((slug, batchIdx) => {
      const url = `/api/v1/facility/${facilityId}/activity_definition/${slug}/`;
      return request<ActivityDefinitionRead>(url, { method: "GET" }).then(
        (detail) => {
          results[i + batchIdx] = detail;
          completed += 1;
          onProgress(completed);
        },
      );
    });
    await Promise.all(promises);
  }

  return results;
}

function mapRow(item: ActivityDefinitionRead): string[] {
  const slug = stripFacilitySlugPrefix(
    item.slug_config?.slug_value ?? item.slug ?? "",
  );

  const specimenSlugs = (item.specimen_requirements ?? [])
    .map(extractSlug)
    .filter(Boolean)
    .join(",");

  const observationSlugs = (item.observation_result_requirements ?? [])
    .map(extractSlug)
    .filter(Boolean)
    .join(",");

  const chargeItemSlugs = (item.charge_item_definitions ?? [])
    .map(extractSlug)
    .filter(Boolean)
    .join(",");

  const locationNames = (item.locations ?? [])
    .map((l) => l.name ?? "")
    .filter(Boolean)
    .join(",");

  const diagnosticSystems = (item.diagnostic_report_codes ?? [])
    .map((d) => d.system ?? "")
    .join(",");
  const diagnosticCodes = (item.diagnostic_report_codes ?? [])
    .map((d) => d.code ?? "")
    .join(",");
  const diagnosticDisplays = (item.diagnostic_report_codes ?? [])
    .map((d) => d.display ?? "")
    .join(",");

  return [
    item.title ?? "",
    slug,
    item.description ?? "",
    item.usage ?? "",
    item.status ?? "",
    item.classification ?? "",
    item.kind ?? "",
    item.category?.title ?? "",
    item.code?.system ?? "",
    item.code?.code ?? "",
    item.code?.display ?? "",
    diagnosticSystems,
    diagnosticCodes,
    diagnosticDisplays,
    specimenSlugs,
    observationSlugs,
    chargeItemSlugs,
    locationNames,
    item.healthcare_service?.name ?? "",
    item.derived_from_uri ?? "",
    item.body_site?.system ?? "",
    item.body_site?.code ?? "",
    item.body_site?.display ?? "",
  ];
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ActivityDefinitionExport({
  facilityId,
}: ActivityDefinitionExportProps) {
  if (!facilityId) return null;
  return <ActivityDefinitionExportInner facilityId={facilityId} />;
}

function ActivityDefinitionExportInner({ facilityId }: { facilityId: string }) {
  const apiPath = `/api/v1/facility/${facilityId}/activity_definition/`;

  /* ---- Phase 1: paginated list fetch ---- */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching: isListFetching,
    isFetchingNextPage,
    isError: isListError,
    error: listError,
  } = useInfiniteQuery({
    queryKey: ["export", "activity-definition", facilityId],
    queryFn: async ({ pageParam = 0 }) => {
      const url = `${apiPath}?limit=${PAGE_SIZE}&offset=${pageParam}`;
      return await request<PaginatedResponse<ActivityDefinitionRead>>(url, {
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

  // Auto-fetch all list pages
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const listItems = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data],
  );

  const totalCount = data?.pages[0]?.count ?? 0;
  const listFetchedCount = listItems.length;
  const isListFullyLoaded =
    !hasNextPage && !isListFetching && listFetchedCount > 0;
  const listProgress =
    totalCount > 0 ? Math.round((listFetchedCount / totalCount) * 100) : 0;

  /* ---- Phase 2: detail enrichment ---- */
  const [enrichedItems, setEnrichedItems] = useState<
    ActivityDefinitionRead[] | null
  >(null);
  const [detailFetched, setDetailFetched] = useState(0);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichError, setEnrichError] = useState<string | null>(null);
  const enrichStartedRef = useRef(false);

  useEffect(() => {
    if (!isListFullyLoaded || enrichStartedRef.current) return;
    enrichStartedRef.current = true;

    setIsEnriching(true);
    setDetailFetched(0);
    setEnrichError(null);

    const slugs = listItems.map((item) => item.slug);

    fetchDetails(facilityId, slugs, (done) => setDetailFetched(done))
      .then((details) => {
        setEnrichedItems(details);
        setIsEnriching(false);
      })
      .catch((err) => {
        setEnrichError(
          err instanceof Error ? err.message : "Failed to fetch details.",
        );
        setIsEnriching(false);
      });
  }, [isListFullyLoaded, listItems, facilityId]);

  const detailProgress =
    totalCount > 0 ? Math.round((detailFetched / totalCount) * 100) : 0;
  const isFullyReady = enrichedItems !== null && !isEnriching;

  /* ---- Download ---- */
  const handleDownload = useCallback(() => {
    if (!enrichedItems) return;
    const rows = enrichedItems.map(mapRow);
    const csvText = toCsvString(CSV_HEADERS, rows);
    downloadCsv(`activity_definitions_export_${facilityId}.csv`, csvText);
  }, [enrichedItems, facilityId]);

  /* ---- Render ---- */
  const isAnyError = isListError || enrichError !== null;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Activity Definitions
          </CardTitle>
          <CardDescription>
            Export all activity definitions as a CSV file matching the import
            format. Each record is enriched with full detail data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status badges */}
          <div className="flex flex-wrap gap-3 items-center">
            {isListFetching && !isListFullyLoaded && (
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 text-sm"
              >
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Fetching list… {listFetchedCount} / {totalCount || "?"}
              </Badge>
            )}

            {isListFullyLoaded && isEnriching && (
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 text-sm"
              >
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Enriching details… {detailFetched} / {totalCount}
              </Badge>
            )}

            {isFullyReady && (
              <Badge variant="primary" className="text-sm">
                {totalCount} activity definitions ready
              </Badge>
            )}

            {totalCount === 0 && !isListFetching && !isEnriching && (
              <Badge variant="secondary" className="text-sm">
                No activity definitions found
              </Badge>
            )}
          </div>

          {/* Progress bar — list phase */}
          {isListFetching && !isListFullyLoaded && totalCount > 0 && (
            <Progress value={listProgress} className="h-2" />
          )}

          {/* Progress bar — detail enrichment phase */}
          {isEnriching && totalCount > 0 && (
            <Progress value={detailProgress} className="h-2" />
          )}

          {/* Errors */}
          {isAnyError && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {isListError && listError instanceof Error
                ? listError.message
                : enrichError
                  ? enrichError
                  : "Failed to fetch activity definitions."}
            </div>
          )}

          {/* Download button */}
          <Button
            onClick={handleDownload}
            disabled={!isFullyReady || totalCount === 0}
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
