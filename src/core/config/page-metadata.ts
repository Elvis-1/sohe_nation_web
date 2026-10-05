import type { Metadata } from "next";

import type { MediaAsset } from "@/core/types/commerce";

import { DEFAULT_SHARE_IMAGE, SITE_INDEXABLE, SITE_NAME } from "./site";

type ShareImage = { url: string; alt: string; width?: number; height?: number };

type PageMetadataInput = {
  /** Page title without the brand suffix; the root layout template appends it. */
  title: string;
  /** Use `title` as-is, without the brand suffix (the home page leads with the brand). */
  absoluteTitle?: boolean;
  description: string;
  /** Canonical path, e.g. `/products/lunar-utility-jacket`. Never include filter params. */
  path: string;
  images?: ShareImage[];
  type?: "website" | "article";
  /** Keep this page out of search even in production (private, transactional, filtered). */
  noIndex?: boolean;
  /** For noIndex pages whose links should still be followed (e.g. search results). */
  follow?: boolean;
};

const MAX_DESCRIPTION = 160;

export function clampDescription(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= MAX_DESCRIPTION) return flat;
  const cut = flat.slice(0, MAX_DESCRIPTION - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 100 ? cut.lastIndexOf(" ") : cut.length)}…`;
}

/**
 * Metadata for a public page. Nested fields (openGraph, twitter, robots) replace the
 * parent's wholesale in Next.js, so every page gets the complete set from here.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  images,
  type = "website",
  noIndex = false,
  follow = false,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const shareImages = images?.length ? images : [DEFAULT_SHARE_IMAGE];
  const summary = clampDescription(description);
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: summary,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: "en",
      url: path,
      title: fullTitle,
      description: summary,
      images: shareImages,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: summary,
      images: shareImages.map((image) => image.url),
    },
    ...(noIndex || !SITE_INDEXABLE
      ? { robots: { index: false, follow: noIndex ? follow : false } }
      : {}),
  };
}

/** Private or transactional pages: never indexed, links not followed. */
export const PRIVATE_PAGE_ROBOTS: Metadata["robots"] = { index: false, follow: false };

/** Share images from product or story media: photos, or a video's poster frame. */
export function shareImagesFromMedia(
  media: Array<Pick<MediaAsset, "type" | "url" | "posterUrl" | "alt">>,
  limit = 4,
): ShareImage[] {
  return media
    .map((item) => ({ url: item.type === "video" ? item.posterUrl ?? "" : item.url, alt: item.alt }))
    .filter((image) => image.url)
    .slice(0, limit);
}

/** A staff-set share image replaces the media-derived ones. */
export function shareImagesWithOverride(
  seo: { imageUrl: string } | undefined,
  alt: string,
  fallback: ShareImage[],
): ShareImage[] {
  return seo?.imageUrl ? [{ url: seo.imageUrl, alt }] : fallback;
}
