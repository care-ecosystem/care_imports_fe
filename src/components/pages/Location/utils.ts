import { LocationForm } from "@/types/location/location";
import { normalize } from "@/Utils/importHelpers";
import { z } from "zod";

// ─── Shared Helpers ────────────────────────────────────────────────

const LOCATION_TYPES = [
  "bed",
  "building",
  "cabinet",
  "corridor",
  "house",
  "jurisdiction",
  "level",
  "road",
  "room",
  "site",
  "vehicle",
  "virtual",
  "ward",
  "wing",
  "area",
] as const;

export type LocationType = (typeof LOCATION_TYPES)[number];

// ─── Location Form Labels → Codes ──────────────────────────────────
const FORM_LABEL_TO_CODE: Record<LocationType, LocationForm> = {
  bed: "bd",
  building: "bu",
  cabinet: "ca",
  corridor: "co",
  house: "ho",
  jurisdiction: "jdn",
  level: "lvl",
  road: "rd",
  room: "ro",
  site: "si",
  vehicle: "ve",
  virtual: "vi",
  ward: "wa",
  wing: "wi",
  area: "area",
};

function isLocationType(value: string): value is LocationType {
  return LOCATION_TYPES.includes(value as LocationType);
}

export function mapLabelToForm(label: LocationType): LocationForm {
  return FORM_LABEL_TO_CODE[label];
}

// ─── Check if form can have departments ────────────────────────────
export function canHaveDepartments(form: LocationForm): boolean {
  return form !== "bd"; // Only beds cannot have departments
}

// ─── Zod Schema ────────────────────────────────────────────────────
export const LocationRowSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  type: z.string().min(1, "Location type is required"),
  description: z.string().optional(),
  path: z.string().min(1, "Path is required"),
  departments: z.array(z.string()).optional(),
});

export type LocationRow = z.infer<typeof LocationRowSchema>;

// ─── Validation Error ──────────────────────────────────────────────
export interface LocationValidationError {
  identifier: string;
  reason: string;
}

// ─── Detect Duplicates ─────────────────────────────────────────────
export function findDuplicates(rows: LocationRow[]): LocationValidationError[] {
  const seen = new Set<string>();
  const duplicates: LocationValidationError[] = [];

  for (const row of rows) {
    const key = normalize(row.path);
    if (seen.has(key)) {
      duplicates.push({
        identifier: key,
        reason: `Duplicate location path: ${row.path}`,
      });
    } else {
      seen.add(key);
    }
  }

  return duplicates;
}

// ─── Detect Missing Parents ────────────────────────────────────────
export function findMissingParents(
  rows: LocationRow[],
): LocationValidationError[] {
  const errors: LocationValidationError[] = [];
  const definedPaths = new Set(rows.map((row) => normalize(row.path)));

  for (const row of rows) {
    const parentPath = getParentPath(row.path);
    if (parentPath && !definedPaths.has(normalize(parentPath))) {
      errors.push({
        identifier: normalize(row.path),
        reason: `Parent path "${parentPath}" not found in CSV`,
      });
    }
  }

  return errors;
}

// ─── Detect Invalid Department Assignments ─────────────────────────
export function findInvalidDepartmentAssignments(
  rows: LocationRow[],
): LocationValidationError[] {
  const errors: LocationValidationError[] = [];

  for (const row of rows) {
    const normalized = normalize(row.type);
    const isValidLocationType = isLocationType(normalized);
    // Skip if type error
    if (!isValidLocationType) {
      continue;
    }
    const form = mapLabelToForm(normalized as LocationType);
    if (!canHaveDepartments(form) && row.departments?.length) {
      errors.push({
        identifier: normalize(row.path),
        reason: `Beds cannot have managing organizations assigned`,
      });
    }
  }

  return errors;
}

// ─── Detect Invalid Location Types ─────────────────────────────────
export function findInvalidTypes(
  rows: LocationRow[],
): LocationValidationError[] {
  const errors: LocationValidationError[] = [];

  for (const row of rows) {
    const normalizedType = normalize(row.type);
    if (!isLocationType(normalizedType)) {
      errors.push({
        identifier: normalize(row.path),
        reason: `Invalid location type "${row.type}". Valid types: ${LOCATION_TYPES.join(", ")}`,
      });
    }
  }

  return errors;
}

// ─── Detect Circular References ────────────────────────────────────
// With path-based hierarchy, circular references are impossible:
// parent is always a strict prefix of the child path

// ─── Combined Validator ────────────────────────────────────────────
export function validateLocationRows(
  rows: LocationRow[],
): LocationValidationError[] {
  return [
    ...findInvalidTypes(rows),
    ...findDuplicates(rows),
    ...findMissingParents(rows),
    ...findInvalidDepartmentAssignments(rows),
  ];
}

// ─── Path Helpers ──────────────────────────────────────────────────
export function getParentPath(path: string): string | undefined {
  const parts = path.split("/");
  return parts.length > 1 ? parts.slice(0, -1).join("/") : undefined;
}

// ─── Parse Departments ─────────────────────────────────────────────
export function parseDepartmentNames(value?: string): string[] | undefined {
  if (!value) return undefined;
  const names = value
    .split(/[;,]/)
    .map((name) => name.trim())
    .filter(Boolean);
  return names.length > 0 ? names : undefined;
}

// ─── API Payload ───────────────────────────────────────────────────
export function toLocationCreatePayload(row: LocationRow): {
  name: string;
  form: LocationForm;
  mode: "instance" | "kind";
  status: "active";
  operational_status: "U";
  description: string;
  organizations: string[];
} {
  const normalized = normalize(row.type);
  const form = mapLabelToForm(normalized as LocationType);
  return {
    name: row.name.trim(),
    form,
    mode: form === "bd" ? "instance" : "kind",
    status: "active",
    operational_status: "U",
    description: row.description?.trim() || "",
    organizations: [],
  };
}

// ─── Sample CSV ────────────────────────────────────────────────────
export const LOCATION_SAMPLE_CSV = {
  headers: [
    "Building",
    "type",
    "description",
    "Ward",
    "type",
    "description",
    "Bed",
    "type",
    "description",
    "department",
  ],
  rows: [
    [
      "Main Building",
      "building",
      "Main hospital building",
      "ICU",
      "ward",
      "Intensive Care Unit",
      "Bed 1",
      "bed",
      "ICU Bed 1",
      "Cardiology", // Applied to building and ward, not bed
    ],
    [
      "Main Building",
      "building",
      "",
      "ICU",
      "ward",
      "",
      "Bed 2",
      "bed",
      "ICU Bed 2",
      "Cardiology",
    ],
    [
      "Main Building",
      "building",
      "",
      "General Ward",
      "ward",
      "General patient ward",
      "Bed 1",
      "bed",
      "",
      "General Medicine",
    ],
    [
      "Annex",
      "building",
      "Annex building",
      "Reception",
      "room",
      "Reception area",
      "",
      "",
      "",
      "Administration",
    ],
  ],
};

// ─── Flatten Hierarchical CSV to Flat Rows ─────────────────────────
/**
 * Converts hierarchical CSV (location/type/desc × N levels + optional department)
 * to flat LocationRow[] with path-based identification.
 */
export function flattenLocationCsv(
  headers: string[],
  rows: string[][],
): LocationRow[] {
  // Check if last header is "department"
  const hasDeptHeader =
    headers[headers.length - 1]?.trim().toLowerCase() === "department";
  const locationHeaders = hasDeptHeader ? headers.slice(0, -1) : headers;

  // Each level has 3 columns: name, type, description
  const levels = Math.floor(locationHeaders.length / 3);

  if (levels === 0) {
    throw new Error(
      "CSV format invalid. Expected groups of 3 columns: location, type, description",
    );
  }

  const seen = new Map<string, LocationRow>(); // Dedupe by normalized path

  for (const row of rows) {
    if (row.length === 0 || !row[0]?.trim()) continue;

    const deptValue = hasDeptHeader ? row[row.length - 1] : undefined;
    const deptNames = parseDepartmentNames(deptValue);
    const pathParts: string[] = [];

    for (let level = 0; level < levels; level++) {
      const offset = level * 3;
      const name = row[offset]?.trim();
      if (!name) break;

      const type = row[offset + 1]?.trim().toLowerCase() || "room";
      const desc = row[offset + 2]?.trim() || "";

      pathParts.push(name);
      const path = pathParts.join("/");
      const key = normalize(path);

      if (!seen.has(key)) {
        seen.set(key, {
          name,
          type,
          description: desc,
          path,
          departments: deptNames, // Keep departments for validation; invalid ones will error
        });
      }
    }
  }

  return Array.from(seen.values());
}
