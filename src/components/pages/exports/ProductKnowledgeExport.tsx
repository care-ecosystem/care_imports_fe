import ExportCard from "@/components/shared/ExportCard";
import { stripFacilitySlugPrefix } from "@/utils/export";

interface ProductKnowledgeExportProps {
  facilityId?: string;
}

interface CodePayload {
  system?: string;
  code?: string;
  display?: string;
}

interface ProductName {
  name_type?: string;
  name?: string;
}

interface Definitional {
  dosage_form?: CodePayload | null;
  intended_routes?: CodePayload[];
  ingredients?: unknown[];
  nutrients?: unknown[];
  drug_characteristic?: unknown[];
}

interface ResourceCategory {
  title?: string;
}

interface ProductKnowledgeRead {
  id: string;
  slug: string;
  slug_config?: { slug_value: string };
  name: string;
  product_type: string;
  status: string;
  base_unit?: CodePayload;
  code?: CodePayload | null;
  definitional?: Definitional | null;
  names?: ProductName[];
  alternate_identifier?: string;
  category?: ResourceCategory | null;
}

const CSV_HEADERS = [
  "resourceCategory",
  "slug",
  "name",
  "productType",
  "codeDisplay",
  "codeValue",
  "baseUnitDisplay",
  "dosageFormDisplay",
  "dosageFormCode",
  "routeCode",
  "routeDisplay",
  "alternateIdentifier",
  "alternateNameType",
  "alternateNameValue",
];

export default function ProductKnowledgeExport({
  facilityId,
}: ProductKnowledgeExportProps) {
  if (!facilityId) return null;

  return (
    <ExportCard<ProductKnowledgeRead>
      title="Export Product Knowledge"
      description="Export all product knowledge as a CSV file matching the import format."
      queryKey={["product-knowledge", facilityId]}
      apiPath={`/api/v1/product_knowledge/?facility=${facilityId}`}
      csvHeaders={CSV_HEADERS}
      mapRow={(item) => {
        const slug = stripFacilitySlugPrefix(
          item.slug_config?.slug_value ?? item.slug ?? "",
        );
        const routes = item.definitional?.intended_routes ?? [];
        const routeCodes = routes.map((r) => r.code ?? "").join(",");
        const routeDisplays = routes.map((r) => r.display ?? "").join(",");

        const altName = item.names?.[0];

        return [
          item.category?.title ?? "",
          slug,
          item.name ?? "",
          item.product_type ?? "",
          item.code?.display ?? "",
          item.code?.code ?? "",
          item.base_unit?.display ?? "",
          item.definitional?.dosage_form?.display ?? "",
          item.definitional?.dosage_form?.code ?? "",
          routeCodes,
          routeDisplays,
          item.alternate_identifier ?? "",
          altName?.name_type ?? "",
          altName?.name ?? "",
        ];
      }}
      filename={`product_knowledge_export_${facilityId}.csv`}
      enabled={Boolean(facilityId)}
    />
  );
}
