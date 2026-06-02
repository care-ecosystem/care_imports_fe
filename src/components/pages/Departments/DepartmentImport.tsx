import { useMemo } from "react";

import { mutate } from "@/Utils/request/mutate";
import { ImportFlow } from "@/components/imports";
import {
  DEPARTMENT_HEADER_MAP,
  DEPARTMENT_REQUIRED_HEADERS,
  DEPARTMENT_SAMPLE_CSV,
  DepartmentRow,
  DepartmentRowSchema,
  parseDepartmentRow,
  toDepartmentCreatePayload,
  validateDepartmentRows,
} from "@/components/pages/Departments/utils";
import type { ImportConfig } from "@/internalTypes/importConfig";
import { FacilityOrganizationCreate } from "@/types/facilityOrganization/facilityOrganization";
import facilityOrganizationApi from "@/types/facilityOrganization/facilityOrganizationApi";

interface DepartmentImportProps {
  facilityId?: string;
}

/**
 * Create the import config with facilityId closure.
 */
function createDepartmentImportConfig(
  facilityId: string,
): ImportConfig<DepartmentRow, { id: string }> {
  return {
    resourceName: "Department",
    resourceNamePlural: "Departments",

    // Parsing
    requiredHeaders: DEPARTMENT_REQUIRED_HEADERS,
    headerMap: DEPARTMENT_HEADER_MAP,
    schema: DepartmentRowSchema,
    parseRow: parseDepartmentRow,

    // API operations
    createResource: async (row, params) => {
      const payload: FacilityOrganizationCreate = {
        ...toDepartmentCreatePayload(row, facilityId),
        ...Object.assign({}, ...params),
      };
      const created = await mutate(facilityOrganizationApi.create, {
        pathParams: { facilityId: facilityId },
      })(payload);
      if (!created?.id) {
        throw new Error(`Failed to create department: ${row.name}`);
      }
      return { id: created.id };
    },

    // Hierarchical support
    resolveParent: (row) => row.parent?.trim().toLowerCase(),
    getRowIdentifier: (row) => row.name.trim().toLowerCase(),

    // Cross-row validation
    validateRows: validateDepartmentRows,

    // Execution
    batchSize: 1, // Sequential for hierarchical
    invalidateKeys: [["organizations", facilityId]],

    // UI
    description:
      "Upload a CSV to import departments with parent-child relationships preserved.",
    uploadHints: [
      "Expected columns: name, parent",
      "Leave parent empty for top-level departments",
    ],
    sampleCsv: DEPARTMENT_SAMPLE_CSV,

    reviewColumns: [
      { header: "Name", accessor: "name" },
      { header: "Parent", accessor: (row) => row.parent || "(root)" },
    ],
  };
}

/**
 * Department import page using the generic ImportFlow component.
 */
export default function DepartmentImport({
  facilityId,
}: DepartmentImportProps) {
  const config = useMemo(() => {
    if (!facilityId) return null;
    return createDepartmentImportConfig(facilityId);
  }, [facilityId]);

  if (!facilityId || !config) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center text-gray-500">
        Please select a facility to import departments.
      </div>
    );
  }

  return <ImportFlow config={config} />;
}
