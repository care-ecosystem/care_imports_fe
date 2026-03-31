import ExportCard from "@/components/shared/ExportCard";
import type { MonetaryComponent } from "@/types/base/monetaryComponent/monetaryComponent";
import { stripFacilitySlugPrefix } from "@/utils/export";

interface ChargeItemDefinitionExportProps {
  facilityId?: string;
}

interface ChargeItemDefinitionRead {
  id: string;
  title: string;
  slug: string;
  description?: string;
  purpose?: string;
  status: string;
  price_components: MonetaryComponent[];
  slug_config?: { slug_value: string };
}

const CSV_HEADERS = ["title", "slug_value", "description", "purpose", "price"];

export default function ChargeItemDefinitionExport({
  facilityId,
}: ChargeItemDefinitionExportProps) {
  if (!facilityId) return null;

  return (
    <ExportCard<ChargeItemDefinitionRead>
      title="Export Charge Item Definitions"
      description="Export all charge item definitions as a CSV file matching the import format."
      queryKey={["charge-item-definition", facilityId]}
      apiPath={`/api/v1/facility/${facilityId}/charge_item_definition/`}
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
        ];
      }}
      filename={`charge_item_definitions_export_${facilityId}.csv`}
      enabled={Boolean(facilityId)}
    />
  );
}
