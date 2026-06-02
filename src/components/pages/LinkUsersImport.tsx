import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { request } from "@/apis/request";
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
import { normalizeHeader } from "@/internalTypes/common";
import roleApi from "@/types/emr/role/roleApi";
import facilityOrganizationApi from "@/types/facilityOrganization/facilityOrganizationApi";
import userApi from "@/types/user/userApi";
import { parseCsvText, splitCsvList } from "@/Utils/csv";
import { normalize } from "@/Utils/importHelpers";
import { mutate } from "@/Utils/request/mutate";

interface LinkUsersImportProps {
  facilityId?: string;
}

interface LinkUserRow {
  rowIndex: number;
  username?: string;
  resolvedUserId?: string;
  pairs: LinkUserPair[];
  validationErrors: string[];
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

interface LinkUserPair {
  roleName: string;
  departmentName: string;
  roleId?: string;
  departmentId?: string;
}

const buildHeaderMap = (headers: string[]) => {
  const headerMap: Record<
    "username" | "role" | "department",
    number | undefined
  > = {
    username: undefined,
    role: undefined,
    department: undefined,
  };

  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    if (normalized === "username" || normalized === "user_name") {
      headerMap.username = index;
    }
    if (normalized === "role" || normalized === "roles") {
      headerMap.role = index;
    }
    if (
      normalized === "department" ||
      normalized === "departments" ||
      normalized === "dept"
    ) {
      headerMap.department = index;
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
  const [roleMap, setRoleMap] = useState<Record<string, string>>({});
  const [departmentMap, setDepartmentMap] = useState<Record<string, string>>(
    {},
  );
  const [mappingStatus, setMappingStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [mappingIssues, setMappingIssues] = useState<string[]>([]);
  const [lastMappingSignature, setLastMappingSignature] = useState<string>("");
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

  const uniqueRoleNames = useMemo(() => {
    const unique = new Set<string>();
    rows.forEach((row) => {
      row.pairs.forEach((pair) => {
        if (pair.roleName) unique.add(pair.roleName.trim());
      });
    });
    return Array.from(unique).sort();
  }, [rows]);

  const uniqueDepartmentNames = useMemo(() => {
    const unique = new Set<string>();
    rows.forEach((row) => {
      row.pairs.forEach((pair) => {
        if (pair.departmentName) unique.add(pair.departmentName.trim());
      });
    });
    return Array.from(unique).sort();
  }, [rows]);

  const mappingSignature = useMemo(
    () => `${uniqueRoleNames.join("|")}::${uniqueDepartmentNames.join("|")}`,
    [uniqueRoleNames, uniqueDepartmentNames],
  );

  const resolveMappings = useCallback(async () => {
    if (!facilityId) return;
    if (!uniqueRoleNames.length && !uniqueDepartmentNames.length) {
      setMappingIssues(["No roles or departments found in CSV."]);
      setMappingStatus("error");
      return;
    }

    setMappingStatus("loading");
    setMappingIssues([]);

    const issues: string[] = [];
    const nextRoleMap: Record<string, string> = {};
    const nextDepartmentMap: Record<string, string> = {};

    try {
      await Promise.all(
        uniqueRoleNames.map(async (roleName) => {
          const response = await request(roleApi.listRoles, {
            queryParams: { limit: 10, offset: 0, name: roleName },
          });
          const key = normalize(roleName);
          const match = response.results.find(
            (role) => normalize(role.name) === key,
          );

          if (match) {
            nextRoleMap[key] = match.id;
          } else {
            issues.push(`Role not found: ${roleName}`);
          }
        }),
      );

      const organizationsResponse = await request(
        facilityOrganizationApi.list,
        { pathParams: { facilityId }, queryParams: { limit: 500 } },
      );

      const organizationLookup = new Map<string, string>();
      organizationsResponse.results.forEach((organization) => {
        const key = normalize(organization.name);
        if (!organizationLookup.has(key)) {
          organizationLookup.set(key, organization.id);
        }
      });

      uniqueDepartmentNames.forEach((departmentName) => {
        const key = normalize(departmentName);
        const match = organizationLookup.get(key);
        if (match) {
          nextDepartmentMap[key] = match;
        } else {
          issues.push(`Department not found: ${departmentName}`);
        }
      });
    } catch (error) {
      issues.push("Failed to load roles or departments.");
    }

    setRoleMap(nextRoleMap);
    setDepartmentMap(nextDepartmentMap);
    setMappingIssues(issues);
    setMappingStatus(issues.length ? "error" : "ready");
    setLastMappingSignature(mappingSignature);

    setRows((prevRows) =>
      prevRows.map((row) => {
        const baseErrors = row.validationErrors.filter(
          (error) =>
            !error.startsWith("Unknown role:") &&
            !error.startsWith("Unknown department:"),
        );
        const errorSet = new Set(baseErrors);
        const pairs = row.pairs.map((pair) => {
          const roleId = nextRoleMap[normalize(pair.roleName)];
          const departmentId =
            nextDepartmentMap[normalize(pair.departmentName)];

          if (!roleId) {
            errorSet.add(`Unknown role: ${pair.roleName}`);
          }
          if (!departmentId) {
            errorSet.add(`Unknown department: ${pair.departmentName}`);
          }

          return {
            ...pair,
            roleId,
            departmentId,
          };
        });

        return {
          ...row,
          pairs,
          validationErrors: Array.from(errorSet),
        };
      }),
    );
  }, [facilityId, uniqueDepartmentNames, uniqueRoleNames]);

  useEffect(() => {
    if (currentStep !== "review") return;
    if (!facilityId) return;
    if (!mappingSignature) return;
    if (mappingStatus === "loading") return;
    if (mappingSignature === lastMappingSignature) return;

    resolveMappings();
  }, [
    currentStep,
    facilityId,
    mappingSignature,
    mappingStatus,
    lastMappingSignature,
    resolveMappings,
  ]);

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
        if (
          headerMap.username === undefined ||
          headerMap.role === undefined ||
          headerMap.department === undefined
        ) {
          setUploadError("CSV must include: username, role, department");
          return;
        }

        const parsedRows: LinkUserRow[] = rows.map((row, index) => {
          const username =
            headerMap.username !== undefined
              ? row[headerMap.username]?.trim()
              : "";
          const roleCell =
            headerMap.role !== undefined ? row[headerMap.role]?.trim() : "";
          const departmentCell =
            headerMap.department !== undefined
              ? row[headerMap.department]?.trim()
              : "";

          const roleNames = splitCsvList(roleCell);
          const departmentNames = splitCsvList(departmentCell);
          const validationErrors: string[] = [];

          if (!roleNames.length) {
            validationErrors.push("Missing role");
          }

          if (!departmentNames.length) {
            validationErrors.push("Missing department");
          }

          if (roleNames.length && departmentNames.length) {
            if (roleNames.length !== departmentNames.length) {
              validationErrors.push("Role and department counts do not match");
            }

            const seenDepartments = new Set<string>();
            departmentNames.forEach((departmentName) => {
              const key = normalize(departmentName);
              if (seenDepartments.has(key)) {
                validationErrors.push(
                  `Duplicate department in row: ${departmentName}`,
                );
              }
              seenDepartments.add(key);
            });
          }

          const pairs: LinkUserPair[] =
            roleNames.length === departmentNames.length
              ? roleNames.map((roleName, pairIndex) => ({
                  roleName,
                  departmentName: departmentNames[pairIndex] ?? "",
                }))
              : [];

          return {
            rowIndex: index + 2,
            username: username || undefined,
            pairs,
            validationErrors,
            status: "pending",
          };
        });

        setUploadError("");
        setRoleMap({});
        setDepartmentMap({});
        setMappingIssues([]);
        setMappingStatus("idle");
        setLastMappingSignature("");
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
        const hasRowErrors = row.validationErrors.length > 0;

        if (!hasUsername) {
          updatedRow = {
            ...updatedRow,
            status: "invalid",
            message: "Missing username",
          };
        } else if (hasRowErrors) {
          updatedRow = {
            ...updatedRow,
            status: "invalid",
            message: row.validationErrors.join("; "),
          };
        } else if (row.username) {
          try {
            const user = await request(userApi.get, {
              pathParams: { username: row.username },
            });
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
      if (!facilityId) {
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

        if (row.validationErrors.length > 0) {
          updatedRows.push({
            ...row,
            status: "invalid",
            message: row.validationErrors.join("; "),
          });
          continue;
        }

        try {
          const rowIssues: string[] = [];

          for (const pair of row.pairs) {
            const resolvedRoleId =
              pair.roleId ?? roleMap[normalize(pair.roleName)];
            const resolvedDepartmentId =
              pair.departmentId ??
              departmentMap[normalize(pair.departmentName)];

            if (!resolvedDepartmentId || !resolvedRoleId) {
              rowIssues.push(
                `Missing mapping for ${pair.roleName} / ${pair.departmentName}`,
              );
              continue;
            }
            await mutate(facilityOrganizationApi.assignUser, {
              pathParams: {
                facilityId: facilityId!,
                organizationId: resolvedDepartmentId,
              },
            })({
              user: row.resolvedUserId!,
              role: resolvedRoleId,
            });
          }

          if (rowIssues.length > 0) {
            updatedRows.push({
              ...row,
              status: "failed",
              message: rowIssues.join("; "),
            });
            continue;
          }

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
    if (!facilityId) return;
    setCurrentStep("importing");
    linkUsersMutation.mutate(rows);
  }, [facilityId, linkUsersMutation, rows]);

  const downloadSample = () => {
    const sampleCSV = `username,role,department
abhilash-thtn,"Doctor-KA, Technician-KA","Surgery, Dental"
john_doe,Doctor-KA,Surgery`;
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
    readyCount > 0 &&
    mappingStatus === "ready" &&
    mappingIssues.length === 0 &&
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
              Upload a CSV with username, role, and department columns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                    Expected columns: username, role, department
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
              {uniqueDepartmentNames.length} departments (
              {Object.keys(departmentMap).length} mapped) ·{" "}
              {uniqueRoleNames.length} roles ({Object.keys(roleMap).length}{" "}
              mapped)
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
            {(mappingStatus === "loading" || mappingIssues.length > 0) && (
              <Alert
                className="mb-4"
                variant={mappingIssues.length > 0 ? "destructive" : "default"}
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {mappingStatus === "loading" &&
                    "Resolving roles and departments..."}
                  {mappingIssues.length > 0 && (
                    <div className="space-y-1">
                      {mappingIssues.map((issue) => (
                        <div key={issue}>{issue}</div>
                      ))}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-80 overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-3 py-2">Row</th>
                      <th className="px-3 py-2">Username</th>
                      <th className="px-3 py-2">Role → Department</th>
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
                          {row.pairs.length > 0
                            ? row.pairs
                                .map(
                                  (pair) =>
                                    `${pair.roleName} → ${pair.departmentName}`,
                                )
                                .join("; ")
                            : "-"}
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
