import ExportCard from "@/components/shared/ExportCard";
import type { SpecimenDefinitionRead } from "@/types/emr/specimenDefinition/specimenDefinition";
import specimenDefinitionApi from "@/types/emr/specimenDefinition/specimenDefinitionApi";
import { stripFacilitySlugPrefix } from "@/Utils/export";

interface SpecimenDefinitionExportProps {
  facilityId?: string;
}

const CSV_HEADERS = [
  "title",
  "slug_value",
  "description",
  "derived_from_uri",
  "status",
  "type_collected_system",
  "type_collected_code",
  "type_collected_display",
  "collection_system",
  "collection_code",
  "collection_display",
  "is_derived",
  "preference",
  "single_use",
  "requirement",
  "retention_value",
  "retention_unit_system",
  "retention_unit_code",
  "retention_unit_display",
  "container_description",
  "container_capacity_value",
  "container_capacity_unit_system",
  "container_capacity_unit_code",
  "container_capacity_unit_display",
];

export default function SpecimenDefinitionExport({
  facilityId,
}: SpecimenDefinitionExportProps) {
  if (!facilityId) return null;

  return (
    <ExportCard<SpecimenDefinitionRead>
      title="Export Specimen Definitions"
      description="Export all specimen definitions as a CSV file matching the import format."
      queryKey={["specimen-definitions", facilityId]}
      route={specimenDefinitionApi.listSpecimenDefinitions}
      pathParams={{ facilityId }}
      csvHeaders={CSV_HEADERS}
      mapRow={(item) => {
        const tt = item.type_tested;
        return [
          item.title ?? "",
          stripFacilitySlugPrefix(
            item.slug_config?.slug_value ?? item.slug ?? "",
          ),
          item.description ?? "",
          item.derived_from_uri ?? "",
          item.status ?? "",
          item.type_collected?.system ?? "",
          item.type_collected?.code ?? "",
          item.type_collected?.display ?? "",
          item.collection?.system ?? "",
          item.collection?.code ?? "",
          item.collection?.display ?? "",
          tt?.is_derived != null ? String(tt.is_derived) : "",
          tt?.preference ?? "",
          tt?.single_use != null ? String(tt.single_use) : "",
          tt?.requirement ?? "",
          tt?.retention_time?.value ?? "",
          tt?.retention_time?.unit?.system ?? "",
          tt?.retention_time?.unit?.code ?? "",
          tt?.retention_time?.unit?.display ?? "",
          tt?.container?.description ?? "",
          tt?.container?.capacity?.value ?? "",
          tt?.container?.capacity?.unit?.system ?? "",
          tt?.container?.capacity?.unit?.code ?? "",
          tt?.container?.capacity?.unit?.display ?? "",
        ];
      }}
      filename={`specimen_definitions_export_${facilityId}.csv`}
      enabled={Boolean(facilityId)}
    />
  );
}
