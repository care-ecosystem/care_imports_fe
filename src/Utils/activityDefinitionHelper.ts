import { csvEscape } from "@/Utils/importHelpers";

export interface ResolvedRow {
  categorySlug?: string;
  specimenSlugs: string[];
  observationSlugs: string[];
  chargeItemSlugs: string[];
  locationIds: string[];
  healthcareServiceId?: string | null;
}

export interface HealthcareServiceOption {
  id: string;
  name: string;
}

export const stripMappingErrors = (errors: string[]) =>
  errors.filter(
    (error) =>
      !error.startsWith("Specimen slug not found:") &&
      !error.startsWith("Observation slug not found:") &&
      !error.startsWith("Charge item slug not found:") &&
      !error.startsWith("Charge item not found for activity definition:") &&
      !error.startsWith("Location not found:") &&
      !error.startsWith("Healthcare service not found:"),
  );

export const downloadSampleCsv = () => {
  const headers = [
    "title",
    "slug_value",
    "description",
    "usage",
    "status",
    "classification",
    "category_name",
    "code_system",
    "code_value",
    "code_display",
    "diagnostic_report_system",
    "diagnostic_report_code",
    "diagnostic_report_display",
    "specimen_slugs",
    "observation_slugs",
    "charge_item_slugs",
    "location_names",
    "healthcare_service_name",
    "derived_from_uri",
    "body_site_system",
    "body_site_code",
    "body_site_display",
  ];

  const rows = [
    [
      "Complete Blood Count",
      "complete-blood-count",
      "Complete blood count test",
      "Order CBC for baseline evaluation",
      "active",
      "laboratory",
      "Hematology",
      "http://snomed.info/sct",
      "26604007",
      "Complete blood count",
      "http://loinc.org",
      "718-7",
      "Hemoglobin [Mass/volume] in Blood",
      "whole-blood",
      "hemoglobin, platelet-count",
      "cbc-charge-item",
      "Main Lab",
      "General Medicine",
      "",
      "",
      "",
      "",
    ].map(csvEscape),
  ];

  const sampleCSV = `${headers.join(",")}\n${rows
    .map((row) => row.join(","))
    .join("\n")}`;
  const blob = new Blob([sampleCSV], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sample_activity_definition.csv";
  a.click();
  window.URL.revokeObjectURL(url);
};
