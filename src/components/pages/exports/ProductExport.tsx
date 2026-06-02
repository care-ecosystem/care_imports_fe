import ExportCard from "@/components/shared/ExportCard";
import type { ProductRead } from "@/types/inventory/product/product";
import productApi from "@/types/inventory/product/productApi";
import { stripFacilitySlugPrefix } from "@/Utils/export";

interface ProductExportProps {
  facilityId?: string;
}

const CSV_HEADERS = [
  "name",
  "type",
  "basePrice",
  "inventoryQuantity",
  "dosageForm",
  "lot_number",
  "expiration_date",
  "product_knowledge_name",
  "charge_item_definition_name",
  "product_knowledge_slug",
  "charge_item_definition_slug",
];

export default function ProductExport({ facilityId }: ProductExportProps) {
  if (!facilityId) return null;

  return (
    <ExportCard<ProductRead>
      title="Export Products"
      description="Export all products as a CSV file matching the import format."
      queryKey={["product", facilityId]}
      route={productApi.listProduct}
      pathParams={{ facilityId }}
      csvHeaders={CSV_HEADERS}
      mapRow={(item) => {
        const pkSlugValue =
          item.product_knowledge?.slug_config?.slug_value ??
          (item.product_knowledge?.slug
            ? stripFacilitySlugPrefix(item.product_knowledge.slug)
            : "");
        const cidSlugValue =
          item.charge_item_definition?.slug_config?.slug_value ??
          (item.charge_item_definition?.slug
            ? stripFacilitySlugPrefix(item.charge_item_definition.slug)
            : "");

        const productType = item.product_knowledge?.product_type ?? "";

        const basePrice =
          item.charge_item_definition?.price_components?.find(
            (pc) => pc.monetary_component_type === "base",
          )?.amount ?? "";

        const dosageForm =
          item.product_knowledge?.definitional?.dosage_form?.display ?? "";

        return [
          item.product_knowledge?.name ?? "",
          productType,
          String(basePrice),
          "", // inventoryQuantity – not available on individual product record
          dosageForm,
          item.batch?.lot_number ?? "",
          item.expiration_date ?? "",
          item.product_knowledge?.name ?? "",
          item.charge_item_definition?.title ?? "",
          pkSlugValue,
          cidSlugValue,
        ].map(String);
      }}
      filename={`products_export_${facilityId}.csv`}
      enabled={Boolean(facilityId)}
    />
  );
}
