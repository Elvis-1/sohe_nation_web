import { httpClient } from "@/core/api/http-client";
import { resolveApiBaseUrl } from "@/core/api/resolve-api-base-url";
import type { Product } from "@/core/types/commerce";
import {
  mapApiProductToStorefront,
  type ApiProduct,
} from "@/features/product-discovery/data/mappers/product-api-mapper";

const API_BASE = resolveApiBaseUrl();

// Only the fields the storefront consumes — text content is hardcoded in the frontend.
type ApiHomepagePayload = {
  hero: {
    media_references: Array<{
      id: string;
      alt: string;
      kind: "image" | "video";
      url: string;
      poster_url?: string;
    }>;
  };
  featured_drop: null | {
    linked_products: ApiProduct[];
  };
};

// All campaign text is fixed. Only the hero video and featured products come from the API.
export async function getHomepageContent() {
  const dto = await httpClient<ApiHomepagePayload>(`${API_BASE}/content/homepage/`);
  const heroMedia = dto.hero.media_references[0];

  return {
    campaign: {
      eyebrow: "Campaign 01",
      title: "Built Like An Army",
      statement: "Street discipline. Runway presence.",
      description:
        "A sharp opening release from Sohe's Nation, where tactical cuts, layered silhouettes, and runway composure meet in one disciplined line.",
      primaryCta: { label: "Shop The Drop", href: "/products" },
      secondaryCta: { label: "Enter The Story", href: "/stories/built-like-an-army" },
      campaignStats: [
        { label: "Release Edit", value: "12 Looks" },
        { label: "Lead Chapter", value: "Lookbook 01" },
        { label: "Style Focus", value: "Outerwear" },
      ],
      media: {
        id: heroMedia?.id ?? "homepage-hero-media",
        type: (heroMedia?.kind ?? "video") as "image" | "video",
        url: heroMedia?.url ?? "/hero-runway.mp4",
        posterUrl: heroMedia?.poster_url ?? "/jacket_with_pant.jpeg",
        alt: heroMedia?.alt ?? "Sohe's Nation runway campaign video",
      },
    },
    featuredProducts: dto.featured_drop?.linked_products.map(mapApiProductToStorefront) ?? [],
  };
}

export async function getHomepageCampaign() {
  const content = await getHomepageContent();
  return content.campaign;
}
