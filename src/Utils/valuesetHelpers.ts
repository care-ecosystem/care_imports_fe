import { HttpError, request } from "@/apis/request";
import { normalizeHeader } from "@/internalTypes/common";
import type {
  ValueSetConcept,
  ValueSetCreate,
  ValueSetFilter,
  ValueSetInclude,
} from "@/types/valueSet/valueset";
import { TERMINOLOGY_SYSTEMS, ValueSetStatus } from "@/types/valueSet/valueset";
import valueSetApi from "@/types/valueSet/valueSetApi";
import { parseCsvText } from "@/Utils/csv";
import { isUrlSafeSlug } from "@/Utils/slug";
import careConfig from "@careConfig";

export const VALID_OPERATORS = [
  "=",
  "is-a",
  "descendent-of",
  "is-not-a",
  "regex",
  "in",
  "not-in",
  "generalizes",
  "child-of",
  "descendent-leaf",
  "exists",
];

type ValueSetFilterOp = (typeof VALID_OPERATORS)[number];

const VALUESET_CODE_SYSTEMS = Object.values(TERMINOLOGY_SYSTEMS);

// ---------------------------------------------------------------------------
// CSV headers
// ---------------------------------------------------------------------------

export const VALUESET_CSV_HEADERS = [
  "name",
  "slug",
  "description",
  "compose_type",
  "system",
  "entry_type",
  "code",
  "display",
  "filter_property",
  "filter_op",
  "filter_value",
];

// ---------------------------------------------------------------------------
// Parsed CSV row
// ---------------------------------------------------------------------------

export interface ValueSetCsvRow {
  name: string;
  slug: string;
  description: string;
  compose_type: string;
  system: string;
  entry_type: string;
  code: string;
  display: string;
  filter_property: string;
  filter_op: string;
  filter_value: string;
}

export interface ProcessedValueSetRow {
  rowIndex: number;
  data: ValueSetCsvRow;
  errors: string[];
  /** Populated after code verification */
  resolvedDisplay?: string;
}

// ---------------------------------------------------------------------------
// Grouped valueset (intermediate representation)
// ---------------------------------------------------------------------------

export interface GroupedValueSet {
  name: string;
  slug: string;
  description: string;
  rows: ProcessedValueSetRow[];
  errors: string[];
}

// ---------------------------------------------------------------------------
// Import results
// ---------------------------------------------------------------------------

export interface ValueSetImportResults {
  processed: number;
  created: number;
  updated: number;
  failed: number;
  failures: { slug: string; name?: string; reason: string }[];
}

// ---------------------------------------------------------------------------
// Parse + validate CSV
// ---------------------------------------------------------------------------

export function parseValueSetCsv(csvText: string): {
  rows: ProcessedValueSetRow[];
  error?: string;
} {
  const { headers, rows } = parseCsvText(csvText);

  if (headers.length === 0) {
    return { rows: [], error: "CSV is empty or missing headers" };
  }

  const headerMap = headers.reduce<Record<string, number>>(
    (acc, header, index) => {
      acc[normalizeHeader(header)] = index;
      return acc;
    },
    {},
  );

  const requiredHeaders = [
    "name",
    "slug",
    "compose_type",
    "system",
    "entry_type",
  ];
  const missingHeaders = requiredHeaders.filter(
    (h) => headerMap[normalizeHeader(h)] === undefined,
  );
  if (missingHeaders.length > 0) {
    return {
      rows: [],
      error: `Missing required headers: ${missingHeaders.join(", ")}`,
    };
  }

  const get = (row: string[], key: string) => {
    const idx = headerMap[normalizeHeader(key)];
    return idx === undefined ? "" : (row[idx] ?? "").trim();
  };

  const processed: ProcessedValueSetRow[] = rows.map((row, index) => {
    const data: ValueSetCsvRow = {
      name: get(row, "name"),
      slug: get(row, "slug"),
      description: get(row, "description"),
      compose_type: get(row, "compose_type"),
      system: get(row, "system"),
      entry_type: get(row, "entry_type"),
      code: get(row, "code"),
      display: get(row, "display"),
      filter_property: get(row, "filter_property"),
      filter_op: get(row, "filter_op"),
      filter_value: get(row, "filter_value"),
    };

    const errors: string[] = [];

    // slug is required on every row (grouping key)
    if (!data.slug) {
      errors.push("Missing slug");
    } else if (!isUrlSafeSlug(data.slug)) {
      errors.push(
        `slug "${data.slug}" contains invalid characters (only lowercase letters, digits, hyphens, and underscores are allowed)`,
      );
    }

    // compose_type
    if (!data.compose_type) {
      errors.push("Missing compose_type");
    } else if (
      data.compose_type !== "include" &&
      data.compose_type !== "exclude"
    ) {
      errors.push(
        `Invalid compose_type "${data.compose_type}". Allowed: include, exclude`,
      );
    }

    // system
    if (!data.system) {
      errors.push("Missing system");
    } else if (
      !(VALUESET_CODE_SYSTEMS as readonly string[]).includes(data.system)
    ) {
      errors.push(
        `Invalid system "${data.system}". Allowed: ${VALUESET_CODE_SYSTEMS.join(", ")}`,
      );
    }

    // entry_type
    if (!data.entry_type) {
      errors.push("Missing entry_type");
    } else if (data.entry_type !== "concept" && data.entry_type !== "filter") {
      errors.push(
        `Invalid entry_type "${data.entry_type}". Allowed: concept, filter`,
      );
    }

    // Concept-specific
    if (data.entry_type === "concept") {
      if (!data.code) {
        errors.push("Missing code for concept entry");
      }
    }

    // Filter-specific
    if (data.entry_type === "filter") {
      if (!data.filter_property) {
        errors.push("Missing filter_property for filter entry");
      }
      if (!data.filter_op) {
        errors.push("Missing filter_op for filter entry");
      } else if (
        !(VALID_OPERATORS as readonly string[]).includes(data.filter_op)
      ) {
        errors.push(
          `Invalid op value "${data.filter_op}". Allowed values are ${JSON.stringify([...VALID_OPERATORS])}`,
        );
      }
      if (!data.filter_value) {
        errors.push("Missing filter_value for filter entry");
      }
    }

    return { rowIndex: index + 2, data, errors };
  });

  return { rows: processed };
}

// ---------------------------------------------------------------------------
// Group rows by slug
// ---------------------------------------------------------------------------

export function groupRowsBySlug(
  rows: ProcessedValueSetRow[],
): GroupedValueSet[] {
  const map = new Map<string, GroupedValueSet>();

  for (const row of rows) {
    const slug = row.data.slug;
    if (!slug) continue;

    let group = map.get(slug);
    if (!group) {
      group = {
        name: row.data.name,
        slug,
        description: row.data.description,
        rows: [],
        errors: [],
      };
      map.set(slug, group);
    }

    // Fill in name/description from first row that has it
    if (!group.name && row.data.name) group.name = row.data.name;
    if (!group.description && row.data.description)
      group.description = row.data.description;

    group.rows.push(row);
  }

  // Group-level validations
  for (const group of map.values()) {
    if (!group.name) {
      group.errors.push(
        `No name provided for valueset with slug "${group.slug}"`,
      );
    }

    // Check mutual exclusivity: for each (compose_type, system) pair,
    // all rows must have the same entry_type.
    // First pass: collect entry_types per (compose_type, system) key.
    const composeSystemMap = new Map<string, Set<string>>();
    for (const row of group.rows) {
      if (row.errors.length > 0) continue;
      const key = `${row.data.compose_type}::${row.data.system}`;
      let types = composeSystemMap.get(key);
      if (!types) {
        types = new Set<string>();
        composeSystemMap.set(key, types);
      }
      types.add(row.data.entry_type);
    }

    // Collect the conflicting keys
    const conflictingKeys = new Set<string>();
    for (const [key, types] of composeSystemMap) {
      if (types.size > 1) {
        conflictingKeys.add(key);
      }
    }

    // Second pass: add the error to each individual row that belongs to a conflicting key
    if (conflictingKeys.size > 0) {
      for (const row of group.rows) {
        if (row.errors.length > 0) continue;
        const key = `${row.data.compose_type}::${row.data.system}`;
        if (conflictingKeys.has(key)) {
          const [composeType, system] = key.split("::");
          row.errors.push(
            `Cannot mix concept and filter entries for system "${system}" in ${composeType} group`,
          );
        }
      }
    }
  }

  return Array.from(map.values());
}

// ---------------------------------------------------------------------------
// Code verification via lookup_code
// ---------------------------------------------------------------------------

export interface LookupCodeResult {
  system: string;
  code: string;
  display?: string;
  valid: boolean;
  error?: string;
}

/**
 * Verify a single code against the lookup API.
 */
export async function lookupCode(
  system: string,
  code: string,
): Promise<LookupCodeResult> {
  try {
    const result = await request(valueSetApi.lookup, {
      body: { system, code },
    });
    return {
      system,
      code,
      display: result?.metadata?.display ?? result.metadata?.name,
      valid: true,
    };
  } catch (error) {
    const message =
      error instanceof HttpError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Unknown error";
    return { system, code, valid: false, error: message };
  }
}

/**
 * Verify all concept codes in the rows, deduplicating (system+code) pairs.
 * Returns a map of "system::code" → LookupCodeResult.
 * Calls onProgress after each verification.
 */
export async function verifyAllCodes(
  rows: ProcessedValueSetRow[],
  onProgress?: (completed: number, total: number) => void,
): Promise<Map<string, LookupCodeResult>> {
  const results = new Map<string, LookupCodeResult>();

  // Collect unique (system, code) pairs from concept rows
  const uniqueCodes = new Map<string, { system: string; code: string }>();
  for (const row of rows) {
    if (row.data.entry_type === "concept" && row.data.code && row.data.system) {
      const key = `${row.data.system}::${row.data.code}`;
      if (!uniqueCodes.has(key)) {
        uniqueCodes.set(key, { system: row.data.system, code: row.data.code });
      }
    }
  }

  const entries = Array.from(uniqueCodes.entries());
  let completed = 0;

  for (const [key, { system, code }] of entries) {
    const result = await lookupCode(system, code);
    results.set(key, result);
    completed++;
    onProgress?.(completed, entries.length);
  }

  return results;
}

/**
 * Apply verification results to rows, adding errors for invalid codes
 * and filling in resolved display names.
 */
export function applyVerificationResults(
  rows: ProcessedValueSetRow[],
  verificationMap: Map<string, LookupCodeResult>,
): ProcessedValueSetRow[] {
  return rows.map((row) => {
    if (
      row.data.entry_type !== "concept" ||
      !row.data.code ||
      !row.data.system
    ) {
      return row;
    }

    const key = `${row.data.system}::${row.data.code}`;
    const result = verificationMap.get(key);

    if (!result) return row;

    if (!result.valid) {
      return {
        ...row,
        errors: [
          ...row.errors,
          `Code "${row.data.code}" not found in system "${row.data.system}"${result.error ? `: ${result.error}` : ""}`,
        ],
      };
    }

    return {
      ...row,
      resolvedDisplay: result.display ?? row.data.display,
    };
  });
}

// ---------------------------------------------------------------------------
// Build API payload from grouped rows
// ---------------------------------------------------------------------------

export function buildValueSetPayload(group: GroupedValueSet): ValueSetCreate {
  const composeItems = new Map<string, ValueSetInclude>();

  for (const row of group.rows) {
    if (row.errors.length > 0) continue;

    const composeType = row.data.compose_type as "include" | "exclude";
    const key = `${composeType}::${row.data.system}`;

    let item = composeItems.get(key);
    if (!item) {
      const system = row.data
        .system as (typeof TERMINOLOGY_SYSTEMS)[keyof typeof TERMINOLOGY_SYSTEMS];
      const version =
        system === TERMINOLOGY_SYSTEMS.SNOMED && careConfig.snomedUrl
          ? careConfig.snomedUrl
          : undefined;
      item = {
        system: row.data
          .system as (typeof TERMINOLOGY_SYSTEMS)[keyof typeof TERMINOLOGY_SYSTEMS],
        concept: [],
        filter: [],
        version: version,
      };
      composeItems.set(key, item);
    }

    if (row.data.entry_type === "concept") {
      const concept: ValueSetConcept = {
        code: row.data.code,
        display: row.resolvedDisplay ?? row.data.display ?? "",
      };
      item.concept?.push(concept);
    } else if (row.data.entry_type === "filter") {
      const filter: ValueSetFilter = {
        property: row.data.filter_property,
        op: row.data.filter_op as ValueSetFilterOp,
        value: row.data.filter_value,
      };
      item.filter?.push(filter);
    }
  }

  const include: ValueSetInclude[] = [];
  const exclude: ValueSetInclude[] = [];

  for (const [key, item] of composeItems) {
    if (key.startsWith("include::")) {
      include.push(item);
    } else {
      exclude.push(item);
    }
  }

  return {
    name: group.name,
    slug: group.slug,
    description: group.description,
    status: ValueSetStatus.ACTIVE,
    is_system_defined: false,
    compose: { include, exclude },
  };
}

// ---------------------------------------------------------------------------
// Sample CSV generation
// ---------------------------------------------------------------------------

export function generateSampleValueSetCsv(): string {
  const header = VALUESET_CSV_HEADERS.join(",");
  const rows = [
    // ValueSet 1: Glucose related tests (concepts from multiple systems)
    "Glucose Tests,glucose-tests,Blood glucose test codes,include,http://loinc.org,concept,2345-7,,,,",
    "Glucose Tests,glucose-tests,,include,http://loinc.org,concept,2339-0,,,,",
    "Glucose Tests,glucose-tests,,include,http://loinc.org,concept,41653-7,,,,",
    "Glucose Tests,glucose-tests,,include,http://unitsofmeasure.org,concept,mg/dL,,,,",
    "Glucose Tests,glucose-tests,,include,http://unitsofmeasure.org,concept,mmol/L,,,,",
    // ValueSet 2: Diabetes diagnosis codes (SNOMED)
    "Diabetes Diagnosis,diabetes-diagnosis,Diabetes mellitus related SNOMED codes,include,http://snomed.info/sct,concept,73211009,,,,",
    "Diabetes Diagnosis,diabetes-diagnosis,,include,http://snomed.info/sct,concept,44054006,,,,",
    "Diabetes Diagnosis,diabetes-diagnosis,,include,http://snomed.info/sct,concept,46635009,,,,",
    // ValueSet 3: Filter-based valueset (LOINC with filters)
    "Lab Panel Filters,lab-panel-filters,Lab tests filtered by class,include,http://loinc.org,filter,,,CLASS,is-a,CHEM",
    "Lab Panel Filters,lab-panel-filters,,include,http://loinc.org,filter,,,CLASS,is-a,HEM/BC",
    "Lab Panel Filters,lab-panel-filters,,exclude,http://loinc.org,filter,,,STATUS,=,DEPRECATED",
    // ValueSet 4: Mixed include/exclude with concepts
    "Common Vitals,common-vitals,Vital sign observation codes,include,http://loinc.org,concept,8867-4,,,,",
    "Common Vitals,common-vitals,,include,http://loinc.org,concept,8310-5,,,,",
    "Common Vitals,common-vitals,,include,http://loinc.org,concept,8480-6,,,,",
  ];

  return [header, ...rows].join("\n");
}

// ---------------------------------------------------------------------------
// Flatten a ValueSetRead back into CSV rows (for export)
// ---------------------------------------------------------------------------

export function flattenValueSetToRows(vs: {
  name: string;
  slug: string;
  description: string;
  compose: { include: ValueSetInclude[]; exclude: ValueSetInclude[] };
}): string[][] {
  const rows: string[][] = [];
  let isFirst = true;

  const processItems = (
    items: ValueSetInclude[] | null | undefined,
    composeType: string,
  ) => {
    if (!items) return;
    for (const item of items) {
      // Concepts
      for (const concept of item.concept ?? []) {
        rows.push([
          isFirst ? vs.name : "",
          vs.slug,
          isFirst ? vs.description : "",
          composeType,
          item.system,
          "concept",
          concept.code,
          concept.display ?? "",
          "",
          "",
          "",
        ]);
        isFirst = false;
      }
      // Filters
      for (const filter of item.filter ?? []) {
        rows.push([
          isFirst ? vs.name : "",
          vs.slug,
          isFirst ? vs.description : "",
          composeType,
          item.system,
          "filter",
          "",
          "",
          filter.property,
          filter.op,
          filter.value,
        ]);
        isFirst = false;
      }
    }
  };

  processItems(vs.compose?.include, "include");
  processItems(vs.compose?.exclude, "exclude");

  return rows;
}
