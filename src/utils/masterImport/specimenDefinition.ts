import {
  CodeReference,
  ContainerSpec,
  DurationSpec,
  Preference,
  QuantitySpec,
  SpecimenDefinitionStatus,
  SpecimenRow,
} from "@/types/emr/specimenDefinition/specimenDefinition";
import { parseCsvText } from "@/utils/csv";

const REQUIRED_HEADERS = [
  "title",
  "description",
  "type_collected_system",
  "type_collected_code",
  "type_collected_display",
] as const;

const PREFERENCES = [Preference.preferred, Preference.alternate] as const;

const normalizeHeader = (header: string) =>
  header.toLowerCase().replace(/[^a-z0-9]/g, "");

const parseBoolean = (value?: string) => {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes"].includes(normalized)) return true;
  if (["false", "0", "no"].includes(normalized)) return false;
  return undefined;
};

const getCellValue = (
  row: string[],
  headerMap: Record<string, number>,
  key: string,
) => {
  const index = headerMap[normalizeHeader(key)];
  return index === undefined ? "" : (row[index] ?? "");
};

const buildRequiredCode = (
  system: string,
  code: string,
  display: string,
  errors: string[],
  label: string,
) => {
  if (!system || !code || !display) {
    errors.push(`${label} requires system, code, and display`);
    return null;
  }
  return { system, code, display };
};

const buildOptionalCode = (
  system: string,
  code: string,
  display: string,
  errors: string[],
  label: string,
) => {
  if (!system && !code && !display) return null;
  if (!system || !code || !display) {
    errors.push(`${label} requires system, code, and display if provided`);
    return null;
  }
  return { system, code, display };
};

const buildOptionalQuantity = (
  value: string,
  unitSystem: string,
  unitCode: string,
  unitDisplay: string,
  errors: string[],
  label: string,
) => {
  if (!value && !unitSystem && !unitCode && !unitDisplay) return null;
  if (!value || !unitSystem || !unitCode || !unitDisplay) {
    errors.push(`${label} requires value and unit (system, code, display)`);
    return null;
  }
  return {
    value,
    unit: { system: unitSystem, code: unitCode, display: unitDisplay },
  };
};

export type SpecimenProcessedRow = {
  rowIndex: number;
  data: SpecimenRow;
  errors: string[];
  codeReferences: CodeReference[];
};

export const parseSpecimenDefinitionCsv = (
  csvText: string,
): SpecimenProcessedRow[] => {
  const { headers, rows } = parseCsvText(csvText);

  if (headers.length === 0) {
    throw new Error("CSV is empty or missing headers");
  }

  const headerMap = headers.reduce<Record<string, number>>(
    (acc, header, index) => {
      acc[normalizeHeader(header)] = index;
      return acc;
    },
    {},
  );

  const missingHeaders = REQUIRED_HEADERS.filter(
    (header) => headerMap[normalizeHeader(header)] === undefined,
  );

  if (missingHeaders.length > 0) {
    throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
  }

  return rows.map((row, index) => {
    const errors: string[] = [];
    const codeReferences: CodeReference[] = [];

    const title = getCellValue(row, headerMap, "title").trim();
    const description = getCellValue(row, headerMap, "description").trim();
    const slugValue = getCellValue(row, headerMap, "slug_value").trim();
    const derivedFromUri = getCellValue(
      row,
      headerMap,
      "derived_from_uri",
    ).trim();

    const typeCollected = buildRequiredCode(
      getCellValue(row, headerMap, "type_collected_system").trim(),
      getCellValue(row, headerMap, "type_collected_code").trim(),
      getCellValue(row, headerMap, "type_collected_display").trim(),
      errors,
      "Type collected",
    );

    if (!title) errors.push("Missing title");
    if (!description) errors.push("Missing description");

    if (derivedFromUri) {
      try {
        new URL(derivedFromUri);
      } catch {
        errors.push("derived_from_uri must be a valid URL");
      }
    }

    const collectionCode = buildOptionalCode(
      getCellValue(row, headerMap, "collection_system").trim(),
      getCellValue(row, headerMap, "collection_code").trim(),
      getCellValue(row, headerMap, "collection_display").trim(),
      errors,
      "Collection",
    );

    const isDerivedRaw = getCellValue(row, headerMap, "is_derived").trim();
    const isDerived = parseBoolean(isDerivedRaw);
    if (isDerivedRaw && isDerived === undefined) {
      errors.push("is_derived must be a boolean value");
    }

    const preferenceRaw = getCellValue(row, headerMap, "preference").trim();
    const preference = preferenceRaw as Preference;
    if (preferenceRaw && !PREFERENCES.includes(preference as never)) {
      errors.push("Invalid preference value");
    }

    const singleUseRaw = getCellValue(row, headerMap, "single_use").trim();
    const singleUse = parseBoolean(singleUseRaw);
    if (singleUseRaw && singleUse === undefined) {
      errors.push("single_use must be a boolean value");
    }

    const requirement = getCellValue(row, headerMap, "requirement").trim();

    const retentionTime = buildOptionalQuantity(
      getCellValue(row, headerMap, "retention_value").trim(),
      getCellValue(row, headerMap, "retention_unit_system").trim(),
      getCellValue(row, headerMap, "retention_unit_code").trim(),
      getCellValue(row, headerMap, "retention_unit_display").trim(),
      errors,
      "Retention time",
    ) as DurationSpec | null;

    const containerDescription = getCellValue(
      row,
      headerMap,
      "container_description",
    ).trim();

    const containerCapacity = buildOptionalQuantity(
      getCellValue(row, headerMap, "container_capacity_value").trim(),
      getCellValue(row, headerMap, "container_capacity_unit_system").trim(),
      getCellValue(row, headerMap, "container_capacity_unit_code").trim(),
      getCellValue(row, headerMap, "container_capacity_unit_display").trim(),
      errors,
      "Container capacity",
    ) as QuantitySpec | null;

    const minimumVolumeQuantity = buildOptionalQuantity(
      getCellValue(
        row,
        headerMap,
        "container_minimum_volume_quantity_value",
      ).trim(),
      getCellValue(
        row,
        headerMap,
        "container_minimum_volume_quantity_unit_system",
      ).trim(),
      getCellValue(
        row,
        headerMap,
        "container_minimum_volume_quantity_unit_code",
      ).trim(),
      getCellValue(
        row,
        headerMap,
        "container_minimum_volume_quantity_unit_display",
      ).trim(),
      errors,
      "Minimum volume quantity",
    ) as QuantitySpec | null;

    const minimumVolumeString = getCellValue(
      row,
      headerMap,
      "container_minimum_volume_string",
    ).trim();

    if (minimumVolumeQuantity && minimumVolumeString) {
      errors.push("Minimum volume cannot include both quantity and string");
    }

    const containerCap = buildOptionalCode(
      getCellValue(row, headerMap, "container_cap_system").trim(),
      getCellValue(row, headerMap, "container_cap_code").trim(),
      getCellValue(row, headerMap, "container_cap_display").trim(),
      errors,
      "Container cap",
    );

    const containerPreparation = getCellValue(
      row,
      headerMap,
      "container_preparation",
    ).trim();

    const containerPayload: ContainerSpec | null =
      containerDescription ||
      containerCapacity ||
      minimumVolumeQuantity ||
      minimumVolumeString ||
      containerCap ||
      containerPreparation
        ? {
            description: containerDescription || undefined,
            capacity: containerCapacity || undefined,
            minimum_volume:
              minimumVolumeQuantity || minimumVolumeString
                ? {
                    quantity: minimumVolumeQuantity || undefined,
                    string: minimumVolumeString || undefined,
                  }
                : undefined,
            cap: containerCap || undefined,
            preparation: containerPreparation || undefined,
          }
        : null;

    if (typeCollected) {
      codeReferences.push({
        signature: buildCodeSignature(typeCollected),
        label: "Type collected",
        code: typeCollected,
      });
    }

    if (collectionCode) {
      codeReferences.push({
        signature: buildCodeSignature(collectionCode),
        label: "Collection",
        code: collectionCode,
      });
    }

    if (retentionTime?.unit) {
      codeReferences.push({
        signature: buildCodeSignature(retentionTime.unit),
        label: "Retention unit",
        code: retentionTime.unit,
      });
    }

    if (containerCapacity?.unit) {
      codeReferences.push({
        signature: buildCodeSignature(containerCapacity.unit),
        label: "Container capacity unit",
        code: containerCapacity.unit,
      });
    }

    if (minimumVolumeQuantity?.unit) {
      codeReferences.push({
        signature: buildCodeSignature(minimumVolumeQuantity.unit),
        label: "Minimum volume unit",
        code: minimumVolumeQuantity.unit,
      });
    }

    if (containerCap) {
      codeReferences.push({
        signature: buildCodeSignature(containerCap),
        label: "Container cap",
        code: containerCap,
      });
    }

    const data: SpecimenRow = {
      title,
      slug_value: slugValue || undefined,
      status: SpecimenDefinitionStatus.active,
      description,
      derived_from_uri: derivedFromUri || undefined,
      type_collected: typeCollected || {
        system: "",
        code: "",
        display: "",
      },
      patient_preparation: [],
      collection: collectionCode,
      is_derived: isDerived,
      preference: preferenceRaw ? preference : undefined,
      single_use: singleUse,
      requirement: requirement || undefined,
      retention_time: retentionTime || undefined,
      container: containerPayload || undefined,
    };

    return {
      rowIndex: index + 2,
      data,
      errors,
      codeReferences,
    };
  });
};

const buildCodeSignature = (code: CodeReference["code"]) =>
  `${code.system}||${code.code}`;
