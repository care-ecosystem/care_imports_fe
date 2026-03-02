export async function createSlug(
  name: string,
  maxLength = 25,
  disablePadding = false,
) {
  if (!name) {
    return "";
  }

  const baseLength = Math.min(maxLength, 18);
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

  return `${slug}-${hashHex.slice(0, 7)}`;
}
