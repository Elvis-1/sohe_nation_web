import { httpClient } from "@/core/api/http-client";
import { resolveApiBaseUrl } from "@/core/api/resolve-api-base-url";
import type { Money, Product } from "@/core/types/commerce";

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
    priceRange: { min, max },
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
    featuredProducts: dto.featured_drop?.linked_products.map(mapProduct) ?? [],
  };
}

export async function getHomepageCampaign() {
  const content = await getHomepageContent();
  return content.campaign;
}
