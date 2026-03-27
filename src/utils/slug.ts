/**
 * Returns `true` when the slug contains only URL-safe characters:
 * lowercase letters, digits, hyphens, and underscores.
 *
 * Characters like `?`, `%`, `,`, `.`, spaces, etc. are rejected.
 */
export const URL_SAFE_SLUG_REGEX = /^[a-z0-9_-]+$/;

export function isUrlSafeSlug(slug: string): boolean {
  return URL_SAFE_SLUG_REGEX.test(slug);
}

export async function createSlug(
  name: string,
  maxLength = 25,
  disablePadding = false,
) {
  if (!name) {
    return "";
  }

  const baseLength = Math.min(maxLength, 17);
  let slug = name.toLowerCase();
  slug = slug.replace(/[^a-z0-9\s_-]/g, "");
  slug = slug.replace(/\s+/g, "-");
  slug = slug.replace(/-+/g, "-");
  slug = slug.trim();
  slug = slug.slice(0, baseLength);

  if (disablePadding) {
    return slug;
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(name);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Always produce exactly maxLength characters:
  // slug (variable) + "-" (1) + hash (fills the rest)
  const hashLength = maxLength - slug.length - 1;
  return `${slug}-${hashHex.slice(0, hashLength)}`;
}
