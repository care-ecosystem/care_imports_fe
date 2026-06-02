import { request } from "@/apis/request";
import { ImportFlow } from "@/components/imports";
import { CsvUploader } from "@/components/imports/CsvUploader";
import {
  flattenLocationCsv,
  getParentPath,
  LOCATION_SAMPLE_CSV,
  LocationRow,
  toLocationCreatePayload,
  validateLocationRows,
} from "@/components/pages/Location/utils";
import type { ImportConfig, ProcessedRow } from "@/internalTypes/importConfig";
import locationApi from "@/types/location/locationApi";
import organizationApi from "@/types/organization/organizationApi";
import { parseCsvText } from "@/Utils/csv";
import { mutate } from "@/Utils/request/mutate";
import { useCallback, useEffect, useMemo, useState } from "react";

interface LocationImportProps {
  facilityId?: string;
}

/**
 * Create the import config with facilityId and departmentMap closures.
 */
function createLocationImportConfig(
  facilityId: string,
  departmentMap: Map<string, string>,
): ImportConfig<LocationRow, { id: string }> {
  return {
    resourceName: "Location",
    resourceNamePlural: "Locations",

    // Review columns
    reviewColumns: [
      { header: "Path", accessor: "path" },
      { header: "Name", accessor: "name" },
      { header: "Type", accessor: "type" },
      {
        header: "Departments",
        accessor: (row) => row.departments?.join(", ") || "-",
      },
    ],

    // API operations
    createResource: async (row, params) => {
      const payload = {
        ...toLocationCreatePayload(row),
        ...Object.assign({}, ...params),
      };
      const created = await mutate(locationApi.create, {
        pathParams: { facility_id: facilityId },
      })(payload);
      if (!created?.id) {
        throw new Error(`Failed to create location: ${row.name}`);
      }
      return { id: created.id };
    },

    // After creation, attach departments
    postCreate: async (row, created) => {
      if (!row.departments?.length) {
        return;
      }

      const orgIds = row.departments
        .map((name) => departmentMap.get(name.trim().toLowerCase()))
        .filter((id): id is string => Boolean(id));

      if (orgIds.length > 0) {
        await Promise.all(
          orgIds.map((organization) =>
            mutate(locationApi.addOrganization, {
              pathParams: { facility_id: facilityId, location_id: created.id },
            })({ organization }),
          ),
        );
      }
    },

    // Hierarchical support using path
    resolveParent: (row) => {
      const parentPath = getParentPath(row.path);
      return parentPath?.toLowerCase();
    },
    getRowIdentifier: (row) => row.path.toLowerCase(),

    // Cross-row validation
    validateRows: validateLocationRows,

    // Execution
    batchSize: 1, // Sequential for hierarchical
    invalidateKeys: [["locations", facilityId]],

    // UI
    description:
      "Upload a CSV to import locations with parent-child relationships preserved.",
    uploadHints: [
      "Expected columns: location, type, description (repeated for each hierarchy level)",
      "Optionally add a 'department' column at the end",
      "Location types: building, wing, level, ward, room, bed, etc.",
    ],
    sampleCsv: LOCATION_SAMPLE_CSV,
  };
}

/**
 * Sort rows by path depth - shorter paths (parents) come first.
 */
function sortByPath(rows: LocationRow[]): LocationRow[] {
  return [...rows].sort((a, b) => {
    const depthA = a.path.split("/").length;
    const depthB = b.path.split("/").length;
    return depthA - depthB;
  });
}

/**
 * Location import page using the generic ImportFlow component.
 * Uses custom CSV parsing to handle hierarchical format.
 */
export default function LocationImport({ facilityId }: LocationImportProps) {
  const [departmentMap, setDepartmentMap] = useState<Map<string, string>>(
    new Map(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [processedRows, setProcessedRows] = useState<
    ProcessedRow<LocationRow>[] | null
  >(null);
  const [parseError, setParseError] = useState<string>("");

  // Load department map on mount
  useEffect(() => {
    if (!facilityId) return;

    const loadDepartments = async () => {
      try {
        const response = await request(organizationApi.list, {
          pathParams: { facility_id: facilityId },
          queryParams: { limit: 500 },
        });
        const map = new Map<string, string>();
        for (const org of response.results) {
          const key = org.name.trim().toLowerCase();
          if (!map.has(key)) {
            map.set(key, org.id);
          }
        }
        setDepartmentMap(map);
      } catch (error) {
        console.error("Failed to load departments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDepartments();
  }, [facilityId]);

  const config = useMemo(() => {
    if (!facilityId) return null;
    return createLocationImportConfig(facilityId, departmentMap);
  }, [facilityId, departmentMap]);

  // Custom file handler for hierarchical CSV
  const handleFileSelect = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const { headers, rows } = parseCsvText(csvText);

        if (headers.length === 0) {
          setParseError("CSV is empty or missing headers");
          return;
        }

        const locationRows = flattenLocationCsv(headers, rows);

        if (locationRows.length === 0) {
          setParseError("No valid locations found in CSV");
          return;
        }

        // Sort parents first, then convert to ProcessedRow format
        const sorted = sortByPath(locationRows);
        const processed: ProcessedRow<LocationRow>[] = sorted.map(
          (row, index) => ({
            rowIndex: index + 2,
            raw: [row.path, row.name, row.type, row.description || ""],
            errors: [],
            data: row,
          }),
        );

        setParseError("");
        setProcessedRows(processed);
      } catch (error) {
        setParseError(
          error instanceof Error ? error.message : "Error processing CSV",
        );
      }
    };
    reader.readAsText(file);
  }, []);

  if (!facilityId || !config) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center text-gray-500">
        Please select a facility to import locations.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  // If we have processed rows, show ImportFlow with them
  if (processedRows) {
    return (
      <ImportFlow
        config={config}
        processedRows={processedRows}
        onBack={() => {
          setProcessedRows(null);
          setParseError("");
        }}
      />
    );
  }

  // Show upload screen
  return (
    <div className="max-w-4xl mx-auto">
      <CsvUploader
        title="Import Locations from CSV"
        description={config.description}
        onFileSelect={handleFileSelect}
        error={parseError}
        sampleCsv={config.sampleCsv}
        sampleFilename="sample_location_import.csv"
        hints={config.uploadHints}
      />
    </div>
  );
}
