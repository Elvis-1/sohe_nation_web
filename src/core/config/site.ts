/**
 * Public site identity used for canonical URLs, sitemap, robots, and share metadata.
 */

export const SITE_NAME = "Sohe Nation";
export const SITE_TAGLINE = "Built Like An Army";
export const SITE_DESCRIPTION =
  "Premium tactical streetwear from Sohe Nation: field-ready outerwear, tracksuits, and separates, released in campaign-led drops.";

// Canonical origin (production: https://sohenation.com). Every canonical URL, sitemap entry,
// and share link is built from this, whatever host served the request.
export const SITE_URL = (process.env.NEXT_PUBLIC_STOREFRONT_BASE_URL ?? "https://sohenation.com")
  .trim()
  .replace(/\/+$/, "");

// Search engines may index the site only when this is exactly "true", which is set in the
// production deployment alone. Previews, staging, and local builds stay out of search.
export const SITE_INDEXABLE = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

/** Branded 1200×630 card used wherever a page has no image of its own. */
export const DEFAULT_SHARE_IMAGE = {
  url: "/share-card.png",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME}: ${SITE_TAGLINE}`,
};

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
