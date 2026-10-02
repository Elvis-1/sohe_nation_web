import type { MetadataRoute } from "next";

import { getSitemapEntries } from "@/features/seo/data/services/get-sitemap-entries";

// Built per request so newly published products appear without a redeploy.
export const dynamic = "force-dynamic";

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries();
}
