import { buildHeaderMapping } from "@/internalTypes/common";
import { normalize } from "@/Utils/importHelpers";
import { z } from "zod";

// ─── Required Headers ──────────────────────────────────────────────
export const DEPARTMENT_REQUIRED_HEADERS = ["name"] as const;
export const DEPARTMENT_OPTIONAL_HEADERS = ["parent"] as const;

// ─── Header Mapping ────────────────────────────────────────────────
export const DEPARTMENT_HEADER_MAP: Record<string, string> = buildHeaderMapping(
  [...DEPARTMENT_REQUIRED_HEADERS, ...DEPARTMENT_OPTIONAL_HEADERS],
);

// ─── Zod Schema ────────────────────────────────────────────────────
export const DepartmentRowSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  parent: z.string().optional(),
});

export type DepartmentRow = z.infer<typeof DepartmentRowSchema>;

// ─── Tree Node for visualization ───────────────────────────────────
export interface DepartmentNode {
  name: string;
  children: DepartmentNode[];
}

// ─── API Payload ───────────────────────────────────────────────────
export function toDepartmentCreatePayload(
  row: DepartmentRow,
  facilityId: string,
) {
  return {
    name: row.name.trim(),
    description: "",
    org_type: "team",
    facility: facilityId,
  };
}

// ─── Sample CSV ────────────────────────────────────────────────────
export const DEPARTMENT_SAMPLE_CSV = {
  headers: ["Name", "Parent"],
  rows: [
    ["Cardiology", ""],
    ["Cardiac ICU", "Cardiology"],
    ["Cardiac Surgery", "Cardiology"],
    ["Pediatrics", ""],
    ["Pediatric ICU", "Pediatrics"],
  ],
};

// ─── Build Tree from Flat Rows ─────────────────────────────────────
export function buildDepartmentTree(rows: DepartmentRow[]): DepartmentNode[] {
  const nodesByName = new Map<string, DepartmentNode>();
  const roots: DepartmentNode[] = [];

  const getOrCreateNode = (name: string): DepartmentNode => {
    const normalized = name.trim();
    const existing = nodesByName.get(normalized.toLowerCase());
    if (existing) return existing;
    const node: DepartmentNode = { name: normalized, children: [] };
    nodesByName.set(normalized.toLowerCase(), node);
    return node;
  };

  for (const row of rows) {
    const name = row.name.trim();
    if (!name) continue;

    const node = getOrCreateNode(name);
    const parentName = row.parent?.trim();

    if (parentName) {
      const parentNode = getOrCreateNode(parentName);
      if (
        !parentNode.children.find(
          (c) => c.name.toLowerCase() === node.name.toLowerCase(),
        )
      ) {
        parentNode.children.push(node);
      }
    } else if (
      !roots.find((r) => r.name.toLowerCase() === node.name.toLowerCase())
    ) {
      roots.push(node);
    }
  }

  return roots;
}

// ─── Validation Errors ─────────────────────────────────────────────
export interface DepartmentValidationError {
  identifier: string;
  reason: string;
}

// ─── Detect Duplicates ─────────────────────────────────────────────
export function findDuplicates(
  rows: DepartmentRow[],
): DepartmentValidationError[] {
  const seen = new Set<string>();
  const duplicates: DepartmentValidationError[] = [];

  for (const row of rows) {
    const identifier = normalize(row.name);
    const key = `${normalize(row.parent ?? "")}::${identifier}`;
    if (seen.has(key)) {
      duplicates.push({
        identifier,
        reason: `Duplicate department under parent: ${row.parent?.trim() || "(root)"}`,
      });
    } else {
      seen.add(key);
    }
  }

  return duplicates;
}

// ─── Detect Missing Parents ────────────────────────────────────────
export function findMissingParents(
  rows: DepartmentRow[],
): DepartmentValidationError[] {
  const errors: DepartmentValidationError[] = [];

  // Build set of all defined department names
  const definedNames = new Set(rows.map((row) => normalize(row.name)));

  for (const row of rows) {
    if (row.parent) {
      const parentName = normalize(row.parent);
      if (!definedNames.has(parentName)) {
        errors.push({
          identifier: normalize(row.name),
          reason: `Parent "${row.parent}" not found in CSV`,
        });
      }
    }
  }

  return errors;
}

// ─── Detect Circular References ────────────────────────────────────
export function findCircularReferences(
  rows: DepartmentRow[],
): DepartmentValidationError[] {
  const errors: DepartmentValidationError[] = [];

  // Build parent lookup: name → parent name
  const parentMap = new Map<string, string>();
  for (const row of rows) {
    const name = normalize(row.name);
    const parent = row.parent ? normalize(row.parent) : undefined;
    if (parent) {
      parentMap.set(name, parent);
    }
  }

  // Check each node for cycles
  const checked = new Set<string>();

  for (const row of rows) {
    const startName = normalize(row.name);
    if (checked.has(startName)) continue;

    const visited = new Set<string>();
    let current: string | undefined = startName;

    while (current && !checked.has(current)) {
      if (visited.has(current)) {
        // Found a cycle
        errors.push({
          identifier: startName,
          reason: `Circular reference: ${Array.from(visited).join(" → ")} → ${current}`,
        });
        break;
      }
      visited.add(current);
      current = parentMap.get(current);
    }

    // Mark all visited as checked
    for (const name of visited) {
      checked.add(name);
    }
  }

  return errors;
}

// ─── Combined Validator ────────────────────────────────────────────
export function validateDepartmentRows(
  rows: DepartmentRow[],
): DepartmentValidationError[] {
  return [
    ...findDuplicates(rows),
    ...findMissingParents(rows),
    ...findCircularReferences(rows),
  ];
}

// ─── Parse Row ─────────────────────────────────────────────────────
export function parseDepartmentRow(
  row: string[],
  headerIndices: Record<string, number>,
): Record<string, unknown> {
  return {
    name: row[headerIndices.name]?.trim() ?? "",
    parent: row[headerIndices.parent]?.trim() || undefined,
  };
}
