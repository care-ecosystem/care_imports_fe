import ExportCard from "@/components/shared/ExportCard";
import { stripFacilitySlugPrefix } from "@/utils/export";

interface ProductExportProps {
  facilityId?: string;
}

interface BatchSpec {
  lot_number?: string;
}

interface ProductKnowledgeRef {
  name?: string;
  slug?: string;
}

interface ChargeItemDefinitionRef {
  title?: string;
  slug?: string;
}

interface ProductRead {
  id: string;
  status: string;
  product_knowledge?: ProductKnowledgeRef | null;
  charge_item_definition?: ChargeItemDefinitionRef | null;
  batch?: BatchSpec | null;
  expiration_date?: string;
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
      apiPath={`/api/v1/facility/${facilityId}/product/`}
      csvHeaders={CSV_HEADERS}
      mapRow={(item) => {
        const pkSlug = item.product_knowledge?.slug
          ? stripFacilitySlugPrefix(item.product_knowledge.slug)
          : "";
        const cidSlug = item.charge_item_definition?.slug
          ? stripFacilitySlugPrefix(item.charge_item_definition.slug)
          : "";

        return [
          item.product_knowledge?.name ?? "",
          "", // type is on product_knowledge, not directly on product
          "", // basePrice – not stored on product directly
          "", // inventoryQuantity – not stored on product directly
          "", // dosageForm – not stored on product directly
          item.batch?.lot_number ?? "",
          item.expiration_date ?? "",
          item.product_knowledge?.name ?? "",
          item.charge_item_definition?.title ?? "",
          pkSlug,
          cidSlug,
        ];
      }}
      filename={`products_export_${facilityId}.csv`}
      enabled={Boolean(facilityId)}
    />
  );
}
