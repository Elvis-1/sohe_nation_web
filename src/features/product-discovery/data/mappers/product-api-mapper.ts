/**
 * Maps API snake_case product responses to the storefront Product / ProductDetail shapes.
 *
 * Key reconciliations:
 *   API `kind`               → commerce `type`         (MediaAsset)
 *   API `poster_url`         → commerce `posterUrl`
 *   API `region_availability` → commerce `regionAvailability`
 *   API `default_region`     → commerce `defaultRegion`
 *   API `price_range`        → commerce `priceRange`
 *   API `inventory_quantity` → commerce `inventoryQuantity`
 *   API `is_available`       → commerce `isAvailable`
 *   API `compare_at_price`   → commerce `compareAtPrice`
 */

import type { Product, MediaAsset, ProductVariant, Money } from "@/core/types/commerce";

// ---------------------------------------------------------------------------
// Raw API shapes (snake_case from Django/DRF)
// ---------------------------------------------------------------------------

type ApiMoney = {
  amount: number;
  currency: string;
  formatted: string;
};

type ApiMedia = {
  id: string;
  alt: string;
  kind: "image" | "video";
  url: string;
  poster_url?: string;
  is_primary?: boolean;
};

type ApiVariant = {
  id: string;
  sku: string;
  slug: string;
  title: string;
  size: string;
  color: string;
  inventory_quantity: number;
  is_available: boolean;
  price: ApiMoney;
  compare_at_price: ApiMoney | null;
};

export type ApiNarrative = {
  campaign_note?: string;
  fit_guidance?: string;
  material_story?: string;
  sustainability_note?: string;
  delivery_note?: string;
};

export type ApiProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  badge?: string;
  description: string;
  category: Product["category"];
  gender: Product["gender"];
  default_region: string;
  region_availability: string[];
  media: ApiMedia[];
  price_range: {
    min: ApiMoney;
    max: ApiMoney;
  } | null;
  shipping?: ApiMoney | null;
  variants: ApiVariant[];
  narrative?: ApiNarrative | null;
};

export type ApiPaginatedProducts = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiProduct[];
};

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function mapMoney(api: ApiMoney): Money {
  return {
    amount: api.amount,
    currency: api.currency as Money["currency"],
    formatted: api.formatted,
  };
}

function mapMedia(api: ApiMedia): MediaAsset {
  return {
    id: api.id,
    alt: api.alt,
    type: api.kind,        // API uses "kind", commerce.ts uses "type"
    url: api.url,
    posterUrl: api.poster_url,
  };
}

function mapVariant(api: ApiVariant): ProductVariant {
  return {
    id: api.id,
    sku: api.sku,
    slug: api.slug,
    title: api.title,
    size: api.size,
    color: api.color,
    inventoryQuantity: api.inventory_quantity,
    isAvailable: api.is_available,
    price: mapMoney(api.price),
    compareAtPrice: api.compare_at_price ? mapMoney(api.compare_at_price) : undefined,
    attributes: [],   // narrative attributes are not surfaced in catalog API v1
  };
}

const fallbackMoney: Money = {
  amount: 0,
  currency: "NGN",
  formatted: "NGN 0",
};

export function mapApiProductToStorefront(api: ApiProduct): Product {
  const priceRange = api.price_range
    ? {
        min: mapMoney(api.price_range.min),
        max: mapMoney(api.price_range.max),
      }
    : { min: fallbackMoney, max: fallbackMoney };

  return {
    id: api.id,
    slug: api.slug,
    title: api.title,
    subtitle: api.subtitle,
    badge: api.badge,
    description: api.description,
    category: api.category,
    gender: api.gender,
    defaultRegion: api.default_region as Product["defaultRegion"],
    regionAvailability: api.region_availability as Product["regionAvailability"],
    media: api.media.map(mapMedia),
    priceRange,
    shippingCost: api.shipping ? mapMoney(api.shipping) : fallbackMoney,
    variants: api.variants.map(mapVariant),
  };
}

export function mapApiNarrativeToDetail(narrative: ApiNarrative | null | undefined) {
  return {
    campaignNote: narrative?.campaign_note ?? "",
    fitGuidance: narrative?.fit_guidance ?? "",
    materialStory: narrative?.material_story ?? "",
    sustainabilityNote: narrative?.sustainability_note ?? "",
    deliveryNote: narrative?.delivery_note ?? "",
    lookbookMoments: [] as Array<{ title: string; body: string }>,
  };
}
