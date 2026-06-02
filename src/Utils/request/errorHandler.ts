type PydanticError = {
  type: string;
  loc?: string[];
  msg: string | Record<string, string>;
};

/**
 * Extract a human-readable error message from an HTTP error response body.
 *
 * Handles:
 * - Pydantic validation errors: `{ errors: [{ loc, msg, type }] }`
 * - Array of pydantic error objects at top level
 * - Structured field errors: `{ field: ["msg", ...] }`
 * - Detail string: `{ detail: "..." }`
 */
export function formatHttpError(
  cause: Record<string, unknown> | unknown,
): string {
  if (!cause || typeof cause !== "object") {
    return "Request Failed";
  }

  const obj = cause as Record<string, unknown>;

  // Pydantic errors: { errors: [{ loc, msg, type }] }
  if (Array.isArray(obj.errors) && isPydanticError(obj.errors)) {
    return formatPydanticErrors(obj.errors);
  }

  // Array of pydantic error objects at top level
  if (Array.isArray(cause)) {
    for (const item of cause) {
      if (
        item &&
        typeof item === "object" &&
        Array.isArray((item as Record<string, unknown>).errors) &&
        isPydanticError((item as Record<string, unknown>).errors as unknown[])
      ) {
        return formatPydanticErrors(
          (item as Record<string, unknown>).errors as PydanticError[],
        );
      }
    }
  }

  // Detail string
  if (typeof obj.detail === "string") {
    return obj.detail;
  }

  // Structured field errors: { field_name: ["error", ...] } or { field_name: "error" }
  const messages: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      for (const v of value) {
        if (typeof v === "string") {
          messages.push(`${key}: ${v}`);
        } else if (v && typeof v === "object") {
          const msg =
            (v as Record<string, unknown>).detail ??
            (v as Record<string, unknown>).msg ??
            (v as Record<string, unknown>).message;
          if (typeof msg === "string") {
            messages.push(`${key}: ${msg}`);
          }
        }
      }
    } else if (typeof value === "string") {
      messages.push(`${key}: ${value}`);
    }
  }

  return messages.join("; ") || "Request Failed";
}

function isPydanticError(errors: unknown[]): errors is PydanticError[] {
  return errors.every(
    (e) => typeof e === "object" && e !== null && "type" in e,
  );
}

function formatPydanticErrors(errors: PydanticError[]): string {
  return (
    errors
      .map(({ loc, msg }) => {
        const message = typeof msg === "string" ? msg : Object.values(msg)[0];
        const field = loc?.join(".") ?? "";
        return field ? `${field}: ${message}` : message;
      })
      .filter(Boolean)
      .join("; ") || "Request Failed"
  );
}
