import { HttpError, httpClient } from "@/core/api/http-client";
import type { Money, Product } from "@/core/types/commerce";

import { mapHomepageCampaign } from "../mappers/map-homepage-campaign";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

type ApiMoney = {
  amount: number;
  currency: string;
  formatted: string;
};

type ApiProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  badge?: string;
  description: string;
  category: Product["category"];
  gender: Product["gender"];
  default_region: Product["defaultRegion"];
  region_availability: Product["regionAvailability"];
  media: Array<{
    id: string;
    alt: string;
    kind: "image" | "video";
    url: string;
    poster_url?: string;
  }>;
  price_range: {
    min: ApiMoney;
    max: ApiMoney;
  };
  variants: Array<{
    id: string;
    sku: string;
    slug: string;
    title: string;
    size: string;
    color: string;
    inventory_quantity: number;
    is_available: boolean;
    price: ApiMoney;
    compare_at_price?: ApiMoney | null;
  }>;
};

type ApiHomepagePayload = {
  hero: {
    eyebrow: string;
    headline: string;
    body: string;
    summary: string;
    call_to_action_label: string;
    call_to_action_href: string;
    secondary_call_to_action_label: string;
    secondary_call_to_action_href: string;
    campaign_stats: Array<{ label: string; value: string }>;
    media_references: Array<{
      id: string;
      alt: string;
      kind: "image" | "video";
      url: string;
      poster_url?: string;
    }>;
  };
  featured_drop: null | {
    eyebrow: string;
    headline: string;
    body: string;
    summary: string;
    linked_products: ApiProduct[];
  };
  navigation_promo: null | {
    eyebrow: string;
    headline: string;
    body: string;
    call_to_action_label: string;
    call_to_action_href: string;
    modules: Array<{ title: string; body: string }>;
  };
};

function mapProduct(api: ApiProduct): Product {
  const min: Money = {
    amount: api.price_range.min.amount,
    currency: api.price_range.min.currency as Money["currency"],
    formatted: api.price_range.min.formatted,
  };
  const max: Money = {
    amount: api.price_range.max.amount,
    currency: api.price_range.max.currency as Money["currency"],
    formatted: api.price_range.max.formatted,
  };

  return {
    id: api.id,
    slug: api.slug,
    title: api.title,
    subtitle: api.subtitle,
    badge: api.badge,
    description: api.description,
    category: api.category,
    gender: api.gender,
    defaultRegion: api.default_region,
    regionAvailability: api.region_availability,
    media: api.media.map((item) => ({
      id: item.id,
      alt: item.alt,
      type: item.kind,
      url: item.url,
      posterUrl: item.poster_url,
    })),
    priceRange: {
      min,
      max,
    },
    variants: api.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      slug: variant.slug,
      title: variant.title,
      size: variant.size,
      color: variant.color,
      inventoryQuantity: variant.inventory_quantity,
      isAvailable: variant.is_available,
      price: {
        amount: variant.price.amount,
        currency: variant.price.currency as Money["currency"],
        formatted: variant.price.formatted,
      },
      compareAtPrice: variant.compare_at_price
        ? {
            amount: variant.compare_at_price.amount,
            currency: variant.compare_at_price.currency as Money["currency"],
            formatted: variant.compare_at_price.formatted,
          }
        : undefined,
      attributes: [],
    })),
  };
}

export async function getHomepageContent() {
  const dto = await httpClient<ApiHomepagePayload>(`${API_BASE}/content/homepage/`);
  const heroMedia = dto.hero.media_references[0];

  return {
    campaign: mapHomepageCampaign({
      hero: {
        eyebrow: dto.hero.eyebrow,
        title: dto.hero.headline,
        statement: dto.hero.summary,
        description: dto.hero.body,
        primaryCta: {
          label: dto.hero.call_to_action_label,
          href: dto.hero.call_to_action_href,
        },
        secondaryCta: {
          label: dto.hero.secondary_call_to_action_label,
          href: dto.hero.secondary_call_to_action_href,
        },
        campaignStats: dto.hero.campaign_stats,
        media: {
          id: heroMedia?.id ?? "homepage-hero-media",
          type: heroMedia?.kind ?? "image",
          url: heroMedia?.url ?? "",
          posterUrl: heroMedia?.poster_url,
          alt: heroMedia?.alt ?? dto.hero.headline,
        },
      },
    }),
    featuredDrop: dto.featured_drop
      ? {
          eyebrow: dto.featured_drop.eyebrow,
          title: dto.featured_drop.headline,
          description: dto.featured_drop.body,
          products: dto.featured_drop.linked_products.map(mapProduct),
        }
      : null,
    navigationPromo: dto.navigation_promo,
  };
}

export async function getHomepageCampaign() {
  const content = await getHomepageContent();
  return content.campaign;
}
