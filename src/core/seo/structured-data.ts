/**
 * schema.org JSON-LD for search engines (Slice 13D). Pure builders: every value comes from
 * the same server-priced catalog data the page renders, never from client state.
 *
 * Deliberately absent: `aggregateRating` and `review` (there are no reviews, and invented
 * ratings get a site penalised), and delivery times / return fees (not known yet; they are
 * `[Owner to confirm]` items on the shipping and returns pages).
 */

import type { Product } from "@/core/types/commerce";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/core/config/site";

type JsonLd = Record<string, unknown>;

export type Crumb = { name: string; path: string };

// Return window enforced by the API for delivered orders (Slice 3).
const RETURN_WINDOW_DAYS = 14;

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationJsonLd({
  supportEmail,
  socialUrls,
}: {
  supportEmail: string;
  socialUrls: string[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: "SOHE'S NATION",
    url: `${SITE_URL}/`,
    logo: absoluteUrl("/icon.png"),
    description: SITE_DESCRIPTION,
    slogan: "Built Like An Army",
    ...(socialUrls.length ? { sameAs: socialUrls } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: supportEmail,
      availableLanguage: "English",
    },
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en",
  };
}

export function breadcrumbJsonLd(crumbs: Crumb[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

// schema.org wants ISO 3166-1 countries; drop grouped regions such as "EU".
function shippingCountries(product: Product): string[] {
  const regions = product.regionAvailability.length
    ? product.regionAvailability
    : [product.defaultRegion];
  return [...new Set(regions)].filter((code) => /^[A-Z]{2}$/.test(code) && code !== "EU");
}

function productImages(product: Product): string[] {
  return product.media
    .map((item) => (item.type === "video" ? item.posterUrl ?? "" : item.url))
    .filter(Boolean)
    .map((url) => (url.startsWith("http") ? url : absoluteUrl(url)));
}

function price(amount: number): string {
  return amount.toFixed(2);
}

/**
 * One `ProductGroup` with a `Product` + `Offer` per variant (size × colour), so every price
 * and stock state the page can show is described exactly.
 */
export function productGroupJsonLd(product: Product): JsonLd {
  const url = absoluteUrl(`/products/${product.slug}`);
  const images = productImages(product);
  const countries = shippingCountries(product);
  const variesBy = [
    ...(new Set(product.variants.map((v) => v.size)).size > 1 ? ["https://schema.org/size"] : []),
    ...(new Set(product.variants.map((v) => v.color)).size > 1 ? ["https://schema.org/color"] : []),
  ];

  const shippingDetails =
    product.shippingCost && countries.length
      ? countries.map((country) => ({
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: price(product.shippingCost!.amount),
            currency: product.shippingCost!.currency,
          },
          shippingDestination: { "@type": "DefinedRegion", addressCountry: country },
        }))
      : undefined;

  const returnPolicy = countries.length
    ? {
        "@type": "MerchantReturnPolicy",
        applicableCountry: countries,
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: RETURN_WINDOW_DAYS,
        merchantReturnLink: absoluteUrl("/returns"),
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    "@id": `${url}#product`,
    productGroupID: product.id,
    name: product.title,
    description: product.description || product.subtitle,
    url,
    ...(images.length ? { image: images } : {}),
    brand: { "@type": "Brand", name: SITE_NAME },
    category: product.category,
    ...(variesBy.length ? { variesBy } : {}),
    hasVariant: product.variants.map((variant) => ({
      "@type": "Product",
      sku: variant.sku,
      name: `${product.title} (${variant.title || `${variant.size} / ${variant.color}`})`,
      ...(images.length ? { image: images[0] } : {}),
      size: variant.size,
      color: variant.color,
      offers: {
        "@type": "Offer",
        url,
        price: price(variant.price.amount),
        priceCurrency: variant.price.currency,
        availability: variant.isAvailable
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@id": ORGANIZATION_ID },
        ...(shippingDetails ? { shippingDetails } : {}),
        ...(returnPolicy ? { hasMerchantReturnPolicy: returnPolicy } : {}),
      },
    })),
  };
}
