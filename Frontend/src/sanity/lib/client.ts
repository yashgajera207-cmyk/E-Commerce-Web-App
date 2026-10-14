import { createClient } from "@sanity/client";
import { shopzoneHeroBanners, shopzoneCategories, shopzoneDeals } from "./fallbackData";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const client = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

// Dynamic fetch helper with seamless fallback
export async function sanityFetch<T>({
  query,
  fallback,
}: {
  query: string;
  fallback: T;
}): Promise<T> {
  if (!client) {
    return fallback;
  }

  try {
    const data = await client.fetch<T>(query);
    if (Array.isArray(data) && data.length === 0) {
      return fallback;
    }
    return data || fallback;
  } catch (error) {
    console.warn("Sanity fetch failed or credentials pending, using fallback data:", error);
    return fallback;
  }
}

export async function getHeroBanners() {
  return sanityFetch({
    query: `*[_type == "heroBanner"] | order(order asc)`,
    fallback: shopzoneHeroBanners,
  });
}

export async function getSanityCategories() {
  return sanityFetch({
    query: `*[_type == "category"] | order(order asc)`,
    fallback: shopzoneCategories,
  });
}

export async function getSanityDeals() {
  return sanityFetch({
    query: `*[_type == "product" && section == "deal"]`,
    fallback: shopzoneDeals,
  });
}
