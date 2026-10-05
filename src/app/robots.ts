import type { MetadataRoute } from "next";

import { absoluteUrl, SITE_INDEXABLE } from "@/core/config/site";

// Private pages (account, bag, checkout) carry `noindex` instead of a Disallow rule: a
// disallowed page cannot be crawled, so search engines would never see its noindex.
export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/search"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
