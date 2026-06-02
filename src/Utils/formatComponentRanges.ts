import type { QualifiedRange } from "@/types/base/qualifiedRange/qualifiedRange";
import type { ObservationDefinitionComponentSpec } from "@/types/emr/observationDefinition/observationDefinition";

/**
 * Format a single qualified range into a human-readable string.
 *
 * Output examples:
 *  - "Age: 12-18 years Male | Low ≤12.00 | Normal 12-16 | High ≥16"
 *  - "Age: 0-18 years | Normal 70-100"
 *  - "Female | Low ≤3.5 | Normal 3.5-5.0 | High ≥5.0"
 */
function formatQualifiedRange(qr: QualifiedRange): string {
  const conditionParts: string[] = [];

  // Build condition prefix (age, gender)
  if (qr.conditions && qr.conditions.length > 0) {
    for (const cond of qr.conditions) {
      if (cond.metric === "patient_age") {
        const val = cond.value as {
          min?: number;
          max?: number;
          value_type?: string;
        };
        const unit = val.value_type ?? "years";
        if (val.min != null && val.max != null) {
          conditionParts.push(`Age: ${val.min}-${val.max} ${unit}`);
        } else if (val.min != null) {
          conditionParts.push(`Age: ≥${val.min} ${unit}`);
        } else if (val.max != null) {
          conditionParts.push(`Age: ≤${val.max} ${unit}`);
        }
      } else if (cond.metric === "patient_gender") {
        const gender = String(cond.value);
        conditionParts.push(gender.charAt(0).toUpperCase() + gender.slice(1));
      }
    }
  }

  // Build range bands with interpretation display
  const bandParts: string[] = [];
  if (qr.ranges && qr.ranges.length > 0) {
    for (const band of qr.ranges) {
      const label = band.interpretation?.display ?? "";
      let range = "";
      if (band.min != null && band.max != null) {
        range = `${band.min}-${band.max}`;
      } else if (band.min != null) {
        range = `≥${band.min}`;
      } else if (band.max != null) {
        range = `≤${band.max}`;
      }
      if (range) {
        bandParts.push(label ? `${label} ${range}` : range);
      }
    }
  }

  const allParts = [...conditionParts, ...bandParts];
  return allParts.join(" | ");
}

/**
 * Format all qualified_ranges of a component into an array of display strings,
 * one per qualified range entry. Each string contains the condition context
 * (age, gender) followed by the range values.
 */
export function formatComponentRanges(
  qualifiedRanges: QualifiedRange[] | undefined,
): string[] {
  if (!qualifiedRanges || qualifiedRanges.length === 0) return [];
  return qualifiedRanges.map(formatQualifiedRange).filter((s) => s.length > 0);
}

/**
 * Extract a readable unit display from a component's permitted_unit field.
 */
export function getComponentUnit(
  component: ObservationDefinitionComponentSpec,
): string {
  return (
    component.permitted_unit?.display ?? component.permitted_unit?.code ?? ""
  );
}
