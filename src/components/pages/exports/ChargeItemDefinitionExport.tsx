import ExportCard from "@/components/shared/ExportCard";
import type { ChargeItemDefinitionRead } from "@/types/billing/chargeItemDefinition/chargeItemDefinition";
import chargeItemDefinitionApi from "@/types/billing/chargeItemDefinition/chargeItemDefinitionApi";
import { stripFacilitySlugPrefix } from "@/Utils/export";

interface ChargeItemDefinitionExportProps {
  facilityId?: string;
}

const CSV_HEADERS = [
  "title",
  "slug_value",
  "description",
  "purpose",
  "price",
  "category",
];

export default function ChargeItemDefinitionExport({
  facilityId,
}: ChargeItemDefinitionExportProps) {
  if (!facilityId) return null;

  return (
    <ExportCard<ChargeItemDefinitionRead>
      title="Export Charge Item Definitions"
      description="Export all charge item definitions as a CSV file matching the import format."
      queryKey={["charge-item-definition", facilityId]}
      route={chargeItemDefinitionApi.listChargeItemDefinition}
      pathParams={{ facilityId }}
      csvHeaders={CSV_HEADERS}
      mapRow={(item) => {
        const basePrice =
          item.price_components?.find(
            (pc) => pc.monetary_component_type === "base",
          )?.amount ?? "";
        const slugValue = stripFacilitySlugPrefix(
          item.slug_config?.slug_value ?? item.slug ?? "",
        );
        return [
          item.title ?? "",
          slugValue,
          item.description ?? "",
          item.purpose ?? "",
          String(basePrice),
          item.category?.title ?? "",
        ];
      }}
      filename={`charge_item_definitions_export_${facilityId}.csv`}
      enabled={Boolean(facilityId)}
    />
  );
}
