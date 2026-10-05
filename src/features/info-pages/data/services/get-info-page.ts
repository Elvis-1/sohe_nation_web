import { cache } from "react";

import { cachedContentRequest } from "@/core/api/cache";
import { HttpError, httpClient } from "@/core/api/http-client";
import { resolveApiBaseUrl } from "@/core/api/resolve-api-base-url";

const API_BASE = resolveApiBaseUrl();

/**
 * Information and legal pages served at the site root (`/about`, `/privacy`, ...).
 * The list is fixed route structure; the copy comes from the content API and is edited
 * in the dashboard. Any other root slug 404s without calling the API.
 */
export const INFO_PAGES = {
  about: { group: "About" },
  contact: { group: "Help" },
  shipping: { group: "Help" },
  returns: { group: "Help" },
  "size-guide": { group: "Help" },
  faq: { group: "Help" },
  privacy: { group: "Legal" },
  terms: { group: "Legal" },
} as const;

export type InfoPageSlug = keyof typeof INFO_PAGES;

export type InfoPage = {
  slug: InfoPageSlug;
  group: (typeof INFO_PAGES)[InfoPageSlug]["group"];
  title: string;
  summary: string;
  body: string;
  updatedAt: string;
};

type ApiInfoPage = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  updated_at: string;
};

export function isInfoPageSlug(slug: string): slug is InfoPageSlug {
  return Object.hasOwn(INFO_PAGES, slug);
}

// `cache` shares one fetch between generateMetadata and the page render.
export const getInfoPage = cache(async (slug: string): Promise<InfoPage | null> => {
  if (!isInfoPageSlug(slug)) {
    return null;
  }

  try {
    const page = await httpClient<ApiInfoPage>(`${API_BASE}/content/pages/${slug}/`, cachedContentRequest);
    return {
      slug,
      group: INFO_PAGES[slug].group,
      title: page.title,
      summary: page.summary,
      body: page.body,
      updatedAt: page.updated_at,
    };
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return null;
    }
    throw error;
  }
});
