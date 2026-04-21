import type { Money, Product } from "@/core/types/commerce";
import { HttpError, httpClient } from "@/core/api/http-client";
import { resolveApiBaseUrl } from "@/core/api/resolve-api-base-url";

import type { LookbookStory } from "@/features/editorial/domain/entities/lookbook-story";

const API_BASE = resolveApiBaseUrl();

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

type ApiStory = {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  hero_media: {
    kind: "image" | "video";
    url: string;
    poster_url?: string;
    alt: string;
  } | null;
  chapter_label: string;
  campaign_statement: string;
  modules: Array<{ title: string; body: string }>;
  hotspots: Array<{
    id: string;
    label: string;
    product_slug: string;
    top: string;
    left: string;
    note: string;
  }>;
  linked_products: ApiProduct[];
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

function mapStory(api: ApiStory): LookbookStory & { linkedProducts: Product[] } {
  return {
    slug: api.slug,
    eyebrow: api.eyebrow,
    title: api.title,
    summary: api.summary,
    heroMedia: {
      type: api.hero_media?.kind ?? "image",
      url: api.hero_media?.url ?? "",
      posterUrl: api.hero_media?.poster_url,
      alt: api.hero_media?.alt ?? api.title,
    },
    chapterLabel: api.chapter_label,
    campaignStatement: api.campaign_statement,
    modules: api.modules,
    hotspots: api.hotspots.map((hotspot) => ({
      id: hotspot.id,
      label: hotspot.label,
      productSlug: hotspot.product_slug,
      top: hotspot.top,
      left: hotspot.left,
      note: hotspot.note,
    })),
    linkedProducts: api.linked_products.map(mapProduct),
  };
}

export async function getLookbookStories() {
  const stories = await httpClient<ApiStory[]>(`${API_BASE}/content/stories/`);
  return stories.map(mapStory);
}

export async function getLookbookStory(slug: string) {
  try {
    const story = await httpClient<ApiStory>(`${API_BASE}/content/stories/${slug}/`);
    return mapStory(story);
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
