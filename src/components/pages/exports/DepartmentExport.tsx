import ExportCard from "@/components/shared/ExportCard";
import type { FacilityOrganizationRead } from "@/types/facilityOrganization/facilityOrganization";
import facilityOrganizationApi from "@/types/facilityOrganization/facilityOrganizationApi";

interface DepartmentExportProps {
  facilityId?: string;
}

const CSV_HEADERS = ["name", "parent"];

export default function DepartmentExport({
  facilityId,
}: DepartmentExportProps) {
  if (!facilityId) return null;

  return (
    <ExportCard<FacilityOrganizationRead>
      title="Export Departments"
      description="Export all departments (organizations) as a CSV file matching the import format."
      queryKey={["departments", facilityId]}
      route={facilityOrganizationApi.list}
      pathParams={{ facilityId }}
      csvHeaders={CSV_HEADERS}
      mapRow={(org) => [org.name ?? "", org.parent?.name ?? ""]}
      filename={`departments_export_${facilityId}.csv`}
      enabled={Boolean(facilityId)}
    />
  );
}
