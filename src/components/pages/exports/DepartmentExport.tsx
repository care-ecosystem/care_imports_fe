import ExportCard from "@/components/shared/ExportCard";

interface DepartmentExportProps {
  facilityId?: string;
}

interface OrganizationRead {
  id: string;
  name: string;
  parent?: {
    id: string;
    name: string;
  };
}

const CSV_HEADERS = ["name", "parent"];

export default function DepartmentExport({
  facilityId,
}: DepartmentExportProps) {
  if (!facilityId) return null;

  return (
    <ExportCard<OrganizationRead>
      title="Export Departments"
      description="Export all departments (organizations) as a CSV file matching the import format."
      queryKey={["departments", facilityId]}
      apiPath={`/api/v1/facility/${facilityId}/organizations/`}
      csvHeaders={CSV_HEADERS}
      mapRow={(org) => [org.name ?? "", org.parent?.name ?? ""]}
      filename={`departments_export_${facilityId}.csv`}
      enabled={Boolean(facilityId)}
    />
  );
}
