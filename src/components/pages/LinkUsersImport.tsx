import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { queryString, request } from "@/apis/request";
import DepartmentSelect, {
  FacilityOrganizationRead,
} from "@/components/Pickers/DepartmentSelect";
import RoleSelect, { RoleRead } from "@/components/Pickers/RoleSelect";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { parseCsvText } from "@/utils/csv";

interface LinkUsersImportProps {
  facilityId?: string;
}

interface PaginatedResponse<T> {
  results: T[];
  count: number;
}

interface UserReadMinimal {
  id: string;
  username: string;
}

interface LinkUserRow {
  rowIndex: number;
  username?: string;
  resolvedUserId?: string;
  status:
    | "pending"
    | "ready"
    | "linked"
    | "invalid"
    | "user_not_found"
    | "duplicate"
    | "already_exists"
    | "failed";
  message?: string;
}

const normalizeHeader = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const buildHeaderMap = (headers: string[]) => {
  const headerMap: Record<"username", number | undefined> = {
    username: undefined,
  };

  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    if (normalized === "username" || normalized === "user_name") {
      headerMap.username = index;
    }
  });

  return headerMap;
};

export default function LinkUsersImport({ facilityId }: LinkUsersImportProps) {
  const [currentStep, setCurrentStep] = useState<
    "upload" | "review" | "importing" | "done"
  >("upload");
  const [uploadError, setUploadError] = useState<string>("");
  const [rows, setRows] = useState<LinkUserRow[]>([]);
  const [resolveProgress, setResolveProgress] = useState(0);
  const [roles, setRoles] = useState<RoleRead[]>([]);
  const [roleQuery, setRoleQuery] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [organizations, setOrganizations] = useState<
    FacilityOrganizationRead[]
  >([]);
  const [selectedOrg, setSelectedOrg] =
    useState<FacilityOrganizationRead | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importTotal, setImportTotal] = useState(0);
  const [importProcessed, setImportProcessed] = useState(0);

  const readyCount = useMemo(
    () => rows.filter((row) => row.status === "ready").length,
    [rows],
  );
  const resultSummary = useMemo(
    () => ({
      linked: rows.filter((row) => row.status === "linked").length,
      alreadyExists: rows.filter((row) => row.status === "already_exists")
        .length,
      failed: rows.filter((row) => row.status === "failed").length,
    }),
    [rows],
  );

  const organizationsQuery = useQuery({
    queryKey: ["facility-organizations", facilityId],
    queryFn: () =>
      request<PaginatedResponse<FacilityOrganizationRead>>(
        `/api/v1/facility/${facilityId}/organizations/${queryString({ limit: 500 })}`,
        { method: "GET" },
      ),
    enabled: Boolean(facilityId),
  });

  const rolesQuery = useQuery({
    queryKey: ["roles", roleQuery],
    queryFn: () =>
      request<PaginatedResponse<RoleRead>>(
        `/api/v1/role/${queryString({ limit: 10, offset: 0, name: roleQuery })}`,
        { method: "GET" },
      ),
  });

  useEffect(() => {
    setOrganizations(organizationsQuery.data?.results ?? []);
  }, [organizationsQuery.data]);

  useEffect(() => {
    setRoles(rolesQuery.data?.results ?? []);
  }, [rolesQuery.data]);

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

        if (headers.length === 0) {
          setUploadError("CSV is empty or missing headers");
          return;
        }

        const headerMap = buildHeaderMap(headers);
        if (headerMap.username === undefined) {
          setUploadError("CSV must include: username");
          return;
        }

        const parsedRows: LinkUserRow[] = rows.map((row, index) => {
          const username =
            headerMap.username !== undefined
              ? row[headerMap.username]?.trim()
              : "";
          return {
            rowIndex: index + 2,
            username: username || undefined,
            status: "pending",
          };
        });

        setUploadError("");
        setRows(parsedRows);
        setCurrentStep("review");
      } catch (error) {
        setUploadError("Error processing CSV file");
      }
    };
    reader.readAsText(file);
  };

  const resolveUsersMutation = useMutation({
    mutationFn: async (inputRows: LinkUserRow[]) => {
      setResolveProgress(0);
      const resolvedRows: LinkUserRow[] = [];
      const seenUserIds = new Set<string>();

      for (let index = 0; index < inputRows.length; index++) {
        const row = inputRows[index];
        let updatedRow: LinkUserRow = { ...row };

        const hasUsername = Boolean(row.username);

        if (!hasUsername) {
          updatedRow = {
            ...updatedRow,
            status: "invalid",
            message: "Missing username",
          };
        } else if (row.username) {
          try {
            const user = await request<UserReadMinimal>(
              `/api/v1/users/${row.username}/`,
              { method: "GET" },
            );
            updatedRow = {
              ...updatedRow,
              resolvedUserId: user.id,
              status: "ready",
            };
          } catch (error: any) {
            updatedRow = {
              ...updatedRow,
              status: "user_not_found",
              message: "User not found",
            };
          }
        }

        if (updatedRow.resolvedUserId) {
          if (seenUserIds.has(updatedRow.resolvedUserId)) {
            updatedRow = {
              ...updatedRow,
              status: "duplicate",
              message: "Duplicate user in CSV",
            };
          } else {
            seenUserIds.add(updatedRow.resolvedUserId);
          }
        }

        resolvedRows.push(updatedRow);
        setResolveProgress(Math.round(((index + 1) / inputRows.length) * 100));
      }

      return resolvedRows;
    },
    onSuccess: (resolvedRows) => {
      setRows(resolvedRows);
    },
  });

  const resolveUsers = useCallback(() => {
    if (rows.length === 0) return;
    resolveUsersMutation.mutate(rows);
  }, [rows, resolveUsersMutation]);

  useEffect(() => {
    if (currentStep !== "review") return;
    if (resolveUsersMutation.isPending) return;
    if (rows.length === 0) return;
    if (!rows.some((row) => row.status === "pending")) return;

    resolveUsers();
  }, [currentStep, resolveUsers, resolveUsersMutation.isPending, rows]);

  const linkUsersMutation = useMutation({
    mutationFn: async (inputRows: LinkUserRow[]) => {
      if (!facilityId || !selectedOrg || !selectedRoleId) {
        return inputRows;
      }

      setImportProgress(0);
      const updatedRows: LinkUserRow[] = [];
      const rowsToImport = inputRows.filter((row) => row.status === "ready");
      let processedCount = 0;

      setImportTotal(rowsToImport.length);
      setImportProcessed(0);

      for (let index = 0; index < inputRows.length; index++) {
        const row = inputRows[index];
        if (row.status !== "ready" || !row.resolvedUserId) {
          updatedRows.push(row);
          continue;
        }

        try {
          await request(
            `/api/v1/facility/${facilityId}/organizations/${selectedOrg.id}/users/`,
            {
              method: "POST",
              body: JSON.stringify({
                user: row.resolvedUserId,
                role: selectedRoleId,
              }),
            },
          );

          updatedRows.push({
            ...row,
            status: "linked",
            message: "Linked",
          });
        } catch (error: any) {
          const errorMessage =
            typeof error?.message === "string"
              ? error.message
              : "Unknown error";

          if (errorMessage.includes("User association already exists")) {
            updatedRows.push({
              ...row,
              status: "already_exists",
              message: "User association already exists",
            });
          } else {
            updatedRows.push({
              ...row,
              status: "failed",
              message: errorMessage,
            });
          }
        }

        processedCount += 1;
        setImportProcessed(processedCount);
        setImportProgress(
          Math.round((processedCount / rowsToImport.length) * 100),
        );
      }

      return updatedRows;
    },
    onSuccess: (updatedRows) => {
      setRows(updatedRows);
      setCurrentStep("done");
    },
  });

  const runImport = useCallback(() => {
    if (!facilityId || !selectedOrg || !selectedRoleId) return;
    setCurrentStep("importing");
    linkUsersMutation.mutate(rows);
  }, [facilityId, selectedOrg, selectedRoleId, linkUsersMutation, rows]);

  const downloadSample = () => {
    const sampleCSV = `username
johndon_dhm
bob_ssmm`;
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_link_users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const canImport =
    Boolean(facilityId) &&
    Boolean(selectedOrg) &&
    Boolean(selectedRoleId) &&
    readyCount > 0 &&
    !resolveUsersMutation.isPending &&
    !linkUsersMutation.isPending;

  if (currentStep === "upload") {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Link Users to Department
            </CardTitle>
            <CardDescription>
              Select a department and role, then upload a CSV with username.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Department / Sub-Department
                </label>
                <DepartmentSelect
                  organizations={organizations}
                  value={selectedOrg}
                  onChange={setSelectedOrg}
                  isLoading={organizationsQuery.isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <RoleSelect
                  roles={roles}
                  value={selectedRoleId}
                  onChange={setSelectedRoleId}
                  searchQuery={roleQuery}
                  onSearchChange={setRoleQuery}
                  isLoading={rolesQuery.isLoading}
                />
                <div className="text-xs text-gray-500">
                  Roles are global and reused across facilities.
                </div>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="link-users-csv-upload"
              />
              <label htmlFor="link-users-csv-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-12 w-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium">Click to upload CSV</p>
                    <p className="text-sm text-gray-500">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Expected columns: username
                  </p>
                  <Button variant="outline" size="sm" onClick={downloadSample}>
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

  if (currentStep === "review") {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Review Users</CardTitle>
            <CardDescription>
              {selectedOrg?.name || "No department selected"} ·{" "}
              {roles.find((role) => role.id === selectedRoleId)?.name ||
                "No role selected"}
            </CardDescription>
            {resolveUsersMutation.isPending && (
              <div className="mt-4">
                <Progress value={resolveProgress} className="h-2" />
                <p className="mt-2 text-xs text-gray-500">
                  Validating users...
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-80 overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-3 py-2">Row</th>
                      <th className="px-3 py-2">Username</th>
                      <th className="px-3 py-2">Resolved User ID</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.rowIndex} className="border-t">
                        <td className="px-3 py-2">{row.rowIndex}</td>
                        <td className="px-3 py-2">{row.username ?? "-"}</td>
                        <td className="px-3 py-2">
                          {row.resolvedUserId ?? "-"}
                        </td>
                        <td className="px-3 py-2 capitalize">{row.status}</td>
                        <td className="px-3 py-2">{row.message ?? ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("upload")}
              >
                Back
              </Button>
              <Button onClick={runImport} disabled={!canImport}>
                Start Import
              </Button>
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
            <CardTitle>Importing Users</CardTitle>
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

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Link Users Complete</CardTitle>
          <CardDescription>
            Linked: {resultSummary.linked} · Already linked:{" "}
            {resultSummary.alreadyExists} · Failed: {resultSummary.failed}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setCurrentStep("upload")}>
              Import Another File
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
