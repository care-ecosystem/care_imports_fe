import { request } from "@/apis/request";
import {
  ResourceCategoryResourceType,
  ResourceCategorySubType,
} from "@/types/base/resourceCategory/resourceCategory";
import resourceCategoryApi from "@/types/base/resourceCategory/resourceCategoryApi";
import { createSlug } from "@/Utils/slug";
import { mutate } from "./request/mutate";

const normalizeName = (value: string) => value.trim().toLowerCase();

interface UpsertResourceCategoryOptions {
  facilityId: string;
  categories: string[];
  resourceType: ResourceCategoryResourceType;
  slugPrefix: string;
}

export async function upsertResourceCategories({
  facilityId,
  categories,
  resourceType,
  slugPrefix,
}: UpsertResourceCategoryOptions) {
  const normalizedCategoryMap = new Map<string, string>();
  categories
    .map((category) => category.trim())
    .filter(Boolean)
    .forEach((category) => {
      const normalized = normalizeName(category);
      if (!normalizedCategoryMap.has(normalized)) {
        normalizedCategoryMap.set(normalized, category);
      }
    });

  const uniqueCategories = Array.from(normalizedCategoryMap.values());

  if (uniqueCategories.length === 0) {
    return new Map<string, string>();
  }

  const existingCategories = await request(resourceCategoryApi.list, {
    pathParams: { facilityId },
    queryParams: { limit: 200, resource_type: resourceType },
  });

  const existingLookup = new Map<string, string>();
  existingCategories.results.forEach((category) => {
    existingLookup.set(normalizeName(category.title), category.slug);
  });

  const categoryEntries = await Promise.all(
    uniqueCategories.map(async (category) => {
      const slug = await createSlug(category);
      return { category, slug, normalized: normalizeName(category) };
    }),
  );

  console.log("Existing categories:", existingLookup);

  const newDatapoints = categoryEntries
    .filter(({ normalized }) => !existingLookup.has(normalized))
    .map(({ category, slug }) => ({ category, slug }));

  console.log("New categories to create:", newDatapoints);

  if (newDatapoints.length > 0) {
    await Promise.all(
      newDatapoints.map(async ({ category, slug }) => {
        await mutate(resourceCategoryApi.create, {
          pathParams: { facilityId },
        })({
          title: category,
          slug_value: `${slugPrefix}-${slug}`,
          resource_type: resourceType,
          resource_sub_type: ResourceCategorySubType.other,
        });
      }),
    );
  }

  const categorySlugMap = new Map<string, string>();
  categoryEntries.forEach(({ slug, normalized }) => {
    const existing = existingLookup.get(normalized);
    if (existing) {
      categorySlugMap.set(normalized, existing);
      return;
    }
    const slugValue = `${slugPrefix}-${slug}`;
    categorySlugMap.set(normalized, `f-${facilityId}-${slugValue}`);
  });

  return categorySlugMap;
}
