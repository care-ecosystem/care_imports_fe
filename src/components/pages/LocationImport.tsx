import { AlertCircle, ChevronDown, ChevronRight, Upload } from "lucide-react";
import { useCallback, useState } from "react";

import { request } from "@/apis/request";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import {
  LocationDetail,
  LocationForm,
  LocationImport as LocationImportT,
  LocationTypeIcons,
  LocationWrite,
} from "@/types/location/location";
import { locationApi } from "@/types/location/locationApi";
import { parseCsvText } from "@/utils/csv";

interface LocationImportProps {
  facilityId?: string;
}

interface LocationImportFailure {
  locationName: string;
  reason: string;
}

interface LocationImportResults {
  processed: number;
  created: number;
  failed: number;
  failures: LocationImportFailure[];
}

interface LocationImportProgressUpdate {
  processed: number;
  created: number;
  failed: number;
  failures?: LocationImportFailure[];
}

interface SaveLocationsOptions {
  onProgress?: (update: LocationImportProgressUpdate) => void;
}

const LocationFormLabels = {
  bed: "bd",
  building: "bu",
  cabinet: "ca",
  corridor: "co",
  house: "ho",
  jurisdiction: "jdn",
  level: "lvl",
  road: "rd",
  room: "ro",
  site: "si",
  vehicle: "ve",
  virtual: "vi",
  ward: "wa",
  wing: "wi",
};

const mapLabelToForm = (label: string): LocationForm | undefined => {
  const formKey = LocationFormLabels[label as keyof typeof LocationFormLabels];
  return formKey as LocationForm | undefined;
};

const shouldApplyOrganizationsForForm = (form: LocationForm) =>
  !["bu", "wi", "lvl"].includes(form);

type LocationImportWithDepartment = LocationImportT & {
  departmentNames?: string[];
  children: LocationImportWithDepartment[];
};

const processRowLocations = (
  data: { values: string[]; departmentNames?: string[] }[],
) => {
  let locations: LocationImportWithDepartment[] = [];
  const processAtLocation = (
    locationData: string[],
    locations: LocationImportWithDepartment[],
    departmentNames?: string[],
  ): LocationImportWithDepartment[] => {
    const [location, location_type, description] = locationData.slice(0, 3);
    const tail = locationData.slice(3);

    const existingLocation = locations.find((l) => l.name === location);

    if (existingLocation && tail.length > 0 && tail[0] !== "") {
      return [
        ...locations.filter((l) => l.name !== location),
        {
          ...existingLocation,
          children: processAtLocation(
            tail,
            existingLocation.children,
            departmentNames,
          ),
        },
      ];
    } else {
      const locationForm = mapLabelToForm(location_type?.toLowerCase()) || "ro";
      const shouldApplyOrganizations =
        shouldApplyOrganizationsForForm(locationForm);
      const newLocation: LocationImportWithDepartment = {
        name: location,
        form: locationForm,
        mode: locationForm === "bd" ? "instance" : "kind",
        status: "active",
        operational_status: "U",
        description,
        departmentNames: shouldApplyOrganizations ? departmentNames : undefined,
        children: [],
      };
      let children: LocationImportWithDepartment[] = [];
      if (tail.length > 0 && tail[0] != "") {
        children = processAtLocation(
          tail,
          newLocation.children,
          departmentNames,
        );
      }
      return [
        ...locations,
        {
          ...newLocation,
          children,
        },
      ];
    }
  };

  for (const locationRow of data) {
    locations = processAtLocation(
      locationRow.values,
      locations,
      locationRow.departmentNames,
    );
  }

  return locations;
};

const parseDepartmentNames = (value?: string): string[] | undefined => {
  if (!value) return undefined;
  const names = value
    .split(/[;,]/)
    .map((name) => name.trim())
    .filter(Boolean);
  return names.length > 0 ? names : undefined;
};

export default function LocationImport({ facilityId }: LocationImportProps) {
  const [processedLocations, setProcessedLocations] = useState<
    LocationImportWithDepartment[]
  >([]);
  const [currentStep, setCurrentStep] = useState<
    "upload" | "review" | "importing" | "done"
  >("upload");
  const [uploadError, setUploadError] = useState<string>("");
  const [importProgress, setImportProgress] = useState(0);
  const [importTotal, setImportTotal] = useState(0);
  const [importProcessed, setImportProcessed] = useState(0);
  const [results, setResults] = useState<LocationImportResults | null>(null);
  const { saveLocations } = useSaveLocations(facilityId ?? "");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setUploadError("Please upload a valid CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const { headers, rows } = parseCsvText(csvText);
        console.log("Parsed headers:", headers);

        const hasDepartmentHeader =
          headers[headers.length - 1]?.trim().toLowerCase() === "department";
        const effectiveHeaders = hasDepartmentHeader
          ? headers.slice(0, -1)
          : headers;

        if (effectiveHeaders.length < 3 || effectiveHeaders.length % 3 !== 0) {
          setUploadError(
            "CSV format is invalid. Expected groups of 3 columns: location, type, description",
          );
          return;
        }

        const data: { values: string[]; departmentNames?: string[] }[] = [];

        for (const row of rows) {
          if (row.length === 0) continue;
          const departmentNames = hasDepartmentHeader
            ? parseDepartmentNames(row[row.length - 1])
            : undefined;
          const effectiveValues = hasDepartmentHeader ? row.slice(0, -1) : row;

          if (effectiveValues.length >= effectiveHeaders.length) {
            data.push({ values: effectiveValues, departmentNames });
          }
        }

        setUploadError("");
        setProcessedLocations(processRowLocations(data));
        setCurrentStep("review");
      } catch (error) {
        setUploadError("Error processing CSV file");
      }
    };
    reader.readAsText(file);
  };

  const handleSaveLocations = async () => {
    if (!facilityId) return;
    if (processedLocations.length === 0) return;

    const total = countTotalLocations(processedLocations);
    setCurrentStep("importing");
    setImportTotal(total);
    setImportProcessed(0);
    setImportProgress(0);
    setResults({ processed: 0, created: 0, failed: 0, failures: [] });

    await saveLocations(processedLocations, {
      onProgress: (update: LocationImportProgressUpdate) => {
        setImportProcessed((prev) => {
          const nextProcessed = prev + update.processed;
          setImportProgress(
            total > 0 ? Math.round((nextProcessed / total) * 100) : 0,
          );
          return nextProcessed;
        });
        setResults((prev) =>
          prev
            ? {
                processed: prev.processed + update.processed,
                created: prev.created + update.created,
                failed: prev.failed + update.failed,
                failures: update.failures
                  ? [...prev.failures, ...update.failures]
                  : prev.failures,
              }
            : prev,
        );
      },
    });

    setCurrentStep("done");
  };

  if (currentStep === "upload") {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Locations from CSV
            </CardTitle>
            <CardDescription>
              Upload a CSV file to import floor, room, and sub-room locations
              with their hierarchy preserved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium">
                      Click to upload CSV file
                    </p>
                    <p className="text-sm text-gray-500">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Expected columns: location, type, description (repeated for
                    each hierarchy level)
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Location types can use labels like "bed", "room", "ward",
                    etc. The last description column is optional.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const sampleCSV = `Building,type,description,Room,type,description,Bed,type,description,department
Main Building,building,Main hospital building,ICU,ward,Intensive Care Unit,Bed 1,bed,ICU Bed 1,Cardiology
Main Building,building,Main hospital building,ICU,ward,Intensive Care Unit,Bed 2,bed,ICU Bed 2,Cardiology
Main Building,building,Main hospital building,Reception,room,Main reception area,Waiting Area,area,Patient waiting space,Administration`;
                      const blob = new Blob([sampleCSV], { type: "text/csv" });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "sample_locations.csv";
                      a.click();
                      window.URL.revokeObjectURL(url);
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

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">
                Valid Location Types:
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(LocationFormLabels).map(([key, label]) => (
                  <Badge key={key} variant="outline" className="text-xs">
                    {label} ({key})
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "importing") {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Importing Locations</CardTitle>
            <CardDescription>
              {importProcessed}/{importTotal} processed
            </CardDescription>
            <div className="mt-4">
              <Progress value={importProgress} className="h-2" />
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (currentStep === "done") {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Location Import Complete</CardTitle>
            <CardDescription>
              Created: {results?.created ?? 0} · Failed: {results?.failed ?? 0}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results && results.failures.length > 0 && (
              <Alert className="mb-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {results.failures.map((failure) => (
                    <div key={`${failure.locationName}-${failure.reason}`}>
                      {failure.locationName}: {failure.reason}
                    </div>
                  ))}
                </AlertDescription>
              </Alert>
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("upload")}
              >
                Import Another File
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Location Import Wizard</CardTitle>
          <CardDescription>
            Review and validate locations before importing
          </CardDescription>
          <div className="mt-4">
            <Progress value={100} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <h3 className="text-lg font-semibold mb-4">Review All Locations</h3>
            <HierarchicalLocationPreview locations={processedLocations} />
          </div>
          <div className="flex justify-end">
            <Button className="mt-4" onClick={handleSaveLocations}>
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const HierarchicalLocationPreview = ({
  locations,
}: {
  locations: LocationImportWithDepartment[];
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const toggleExpanded = (locationId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(locationId)) {
      newExpanded.delete(locationId);
    } else {
      newExpanded.add(locationId);
    }
    setExpandedItems(newExpanded);
  };

  const renderLocationItem = (
    location: LocationImportWithDepartment,
    depth: number = 0,
  ) => {
    const IconComponent = LocationTypeIcons[location.form];
    const hasChildren = location.children && location.children.length > 0;
    const isExpanded = expandedItems.has(location.name);
    const locationId = `${location.name}-${depth}`;

    return (
      <div key={locationId} className="w-full">
        <Collapsible
          open={isExpanded}
          onOpenChange={() => toggleExpanded(location.name)}
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div
                  className="flex items-center"
                  style={{ marginLeft: `${depth * 24}px` }}
                >
                  {hasChildren && (
                    <div className="flex items-center justify-center w-4 h-4 mr-2">
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-gray-500" />
                      )}
                    </div>
                  )}
                  {!hasChildren && <div className="w-4 mr-2" />}
                </div>

                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600">
                  <IconComponent className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 truncate">
                      {location.name}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {location.form}
                    </Badge>
                    <Badge
                      variant={
                        location.mode === "instance" ? "primary" : "secondary"
                      }
                      className="text-xs"
                    >
                      {location.mode}
                    </Badge>
                  </div>
                  {location.description && (
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {location.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Badge
                    variant={
                      location.status === "active" ? "primary" : "secondary"
                    }
                    className="text-xs"
                  >
                    {location.status}
                  </Badge>
                  {hasChildren && (
                    <Badge variant="outline" className="text-xs">
                      {location.children.length} child
                      {location.children.length !== 1 ? "ren" : ""}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleTrigger>

          {hasChildren && (
            <CollapsibleContent className="data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
              <div className="ml-6 border-l-2 border-gray-200">
                {location.children.map((child) =>
                  renderLocationItem(child, depth + 1),
                )}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    );
  };

  if (locations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No locations to preview</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium">Location Hierarchy Preview</h4>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedItems(new Set())}
          >
            Collapse All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const allNames = new Set<string>();
              const collectNames = (locs: LocationImportT[]) => {
                locs.forEach((loc) => {
                  allNames.add(loc.name);
                  if (loc.children.length > 0) {
                    collectNames(loc.children);
                  }
                });
              };
              collectNames(locations);
              setExpandedItems(allNames);
            }}
          >
            Expand All
          </Button>
        </div>
      </div>

      <div className="border rounded-lg bg-white">
        {locations.map((location) => renderLocationItem(location))}
      </div>

      <div className="text-sm text-gray-500">
        <p>Total locations: {countTotalLocations(locations)}</p>
      </div>
    </div>
  );
};

const countTotalLocations = (
  locations: LocationImportWithDepartment[],
): number => {
  let count = 0;
  const countRecursive = (locs: LocationImportWithDepartment[]) => {
    locs.forEach((loc) => {
      count++;
      if (loc.children.length > 0) {
        countRecursive(loc.children);
      }
    });
  };
  countRecursive(locations);
  return count;
};

export function useSaveLocations(facilityId: string) {
  const saveLocations = useCallback(
    async (
      roots: LocationImportWithDepartment[],
      options?: SaveLocationsOptions,
    ) => {
      const departmentMap = await resolveDepartmentMap(facilityId);
      await saveLocationTree(
        facilityId,
        undefined,
        roots,
        departmentMap,
        options,
      );
    },
    [facilityId],
  );

  return { saveLocations };
}

const collectLocationFailures = (
  node: LocationImportWithDepartment,
  reason: string,
): LocationImportFailure[] => {
  const failures: LocationImportFailure[] = [
    { locationName: node.name, reason },
  ];
  node.children.forEach((child) => {
    failures.push(...collectLocationFailures(child, reason));
  });
  return failures;
};

async function saveLocationTree(
  facilityId: string,
  parentId: string | undefined,
  nodes: LocationImportWithDepartment[],
  departmentMap: Map<string, string>,
  options?: SaveLocationsOptions,
): Promise<void> {
  for (const node of nodes) {
    try {
      const { path } = locationApi.create;
      const url = path.replace("{facility_id}", facilityId);

      const shouldApplyOrganizations = shouldApplyOrganizationsForForm(
        node.form,
      );
      const organizationIds =
        shouldApplyOrganizations && node.departmentNames?.length
          ? Array.from(
              new Set(
                node.departmentNames
                  .map((name) => departmentMap.get(name.trim().toLowerCase()))
                  .filter((id): id is string => Boolean(id)),
              ),
            )
          : [];

      const payload: LocationWrite = {
        parent: parentId ?? undefined,
        organizations: [],
        status: node.status,
        operational_status: node.operational_status,
        name: node.name,
        description: node.description,
        location_type: node.location_type,
        form: node.form,
        mode: node.mode,
      };

      const created = await request<LocationDetail>(url, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (shouldApplyOrganizations && organizationIds.length > 0) {
        await Promise.all(
          organizationIds.map((organization) =>
            request(
              `/api/v1/facility/${facilityId}/location/${created.id}/organizations_add/`,
              {
                method: "POST",
                body: JSON.stringify({ organization }),
              },
            ),
          ),
        );
      }

      options?.onProgress?.({ processed: 1, created: 1, failed: 0 });

      if (node.children.length > 0) {
        await saveLocationTree(
          facilityId,
          created.id,
          node.children,
          departmentMap,
          options,
        );
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unknown error";
      const failures = collectLocationFailures(node, reason);
      options?.onProgress?.({
        processed: failures.length,
        created: 0,
        failed: failures.length,
        failures,
      });
    }
  }
}

const resolveDepartmentMap = async (facilityId: string) => {
  const response = await request<{ results: { id: string; name: string }[] }>(
    `/api/v1/facility/${facilityId}/organizations/?limit=500`,
    { method: "GET" },
  );
  const map = new Map<string, string>();
  response.results.forEach((org) => {
    const key = org.name.trim().toLowerCase();
    if (!map.has(key)) {
      map.set(key, org.id);
    }
  });
  return map;
};
