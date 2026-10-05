import type { MetadataRoute } from "next";

import { httpClient } from "@/core/api/http-client";
import { resolveApiBaseUrl } from "@/core/api/resolve-api-base-url";
import { absoluteUrl } from "@/core/config/site";
import {
  ALL_PRODUCTS_LANDING,
  AUDIENCE_LANDINGS,
  COLLECTION_LANDINGS,
} from "@/features/product-discovery/data/catalog-landings";

const API_BASE = resolveApiBaseUrl();

type FeedEntry = { slug: string; updated_at: string };
type SitemapFeed = { products: FeedEntry[]; stories: FeedEntry[]; pages: FeedEntry[] };

function entry(
  path: string,
  priority: number,
  changeFrequency: "daily" | "weekly" | "monthly",
  lastModified?: string,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    priority,
    changeFrequency,
    ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
  };
}

/**
 * Every indexable storefront URL. Fixed routes are always listed; products, stories, and
 * information pages come from the API's lightweight sitemap feed (published only).
 * If the API is unreachable the fixed routes are still returned, so the sitemap never 500s.
 */
export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const fixed = [
    entry("/", 1, "daily"),
    entry(ALL_PRODUCTS_LANDING.path, 0.9, "daily"),
    ...Object.values(AUDIENCE_LANDINGS).map((landing) => entry(landing.path, 0.9, "daily")),
    ...Object.values(COLLECTION_LANDINGS).map((landing) => entry(landing.path, 0.8, "daily")),
    entry("/stories", 0.7, "weekly"),
  ];

  let feed: SitemapFeed;
  try {
    feed = await httpClient<SitemapFeed>(`${API_BASE}/marketing/sitemap/`, { cache: "no-store" });
  } catch {
    return fixed;
  }

  return [
    ...fixed,
    ...feed.products.map((row) => entry(`/products/${row.slug}`, 0.8, "weekly", row.updated_at)),
    ...feed.stories.map((row) => entry(`/stories/${row.slug}`, 0.6, "monthly", row.updated_at)),
    ...feed.pages.map((row) => entry(`/${row.slug}`, 0.3, "monthly", row.updated_at)),
  ];
}
