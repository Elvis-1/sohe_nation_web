/**
 * Indexable catalog landing pages: audiences (`/men`, `/women`) and category collections
 * (`/collections/<slug>`). Each has its own heading, copy, and metadata; filter, sort, and
 * search parameters on top of them canonicalise back to the landing path.
 *
 * Plain data with no imports so `src/proxy.ts` can use it to redirect old query URLs.
 */

export type CatalogLanding = {
  path: string;
  eyebrow: string;
  heading: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  /** Filters the landing always applies; the shopper cannot change them on this page. */
  fixed: { gender?: "men" | "women"; category?: string };
};

export const AUDIENCE_LANDINGS: Record<"men" | "women", CatalogLanding> = {
  men: {
    path: "/men",
    eyebrow: "Men",
    heading: "Men's tactical streetwear.",
    intro:
      "Field-ready outerwear, tracksuits, tops, and separates cut for men, together with the unisex pieces from the current drop.",
    metaTitle: "Men's Tactical Streetwear",
    metaDescription:
      "Shop men's tactical streetwear from Sohe Nation: utility outerwear, tracksuits, tops, bottoms, and headwear from the current drop.",
    fixed: { gender: "men" },
  },
  women: {
    path: "/women",
    eyebrow: "Women",
    heading: "Women's tactical streetwear.",
    intro:
      "Field-ready outerwear, tracksuits, tops, and separates cut for women, together with the unisex pieces from the current drop.",
    metaTitle: "Women's Tactical Streetwear",
    metaDescription:
      "Shop women's tactical streetwear from Sohe Nation: utility outerwear, tracksuits, tops, bottoms, and headwear from the current drop.",
    fixed: { gender: "women" },
  },
};

// URL slug → catalog category value (API `Category` choices).
export const COLLECTION_CATEGORIES: Record<string, string> = {
  tracksuits: "tracksuit",
  outerwear: "outerwear",
  tops: "tops",
  bottoms: "bottoms",
  headwear: "headwear",
};

export const CATEGORY_COLLECTIONS: Record<string, string> = Object.fromEntries(
  Object.entries(COLLECTION_CATEGORIES).map(([slug, category]) => [category, slug]),
);

const collectionCopy: Record<string, Omit<CatalogLanding, "path" | "fixed">> = {
  tracksuits: {
    eyebrow: "Collection",
    heading: "Tracksuits.",
    intro: "Matching tracksuits and sets with a disciplined cut, built to move from training to the street.",
    metaTitle: "Tracksuits",
    metaDescription:
      "Shop Sohe Nation tracksuits: matching sets with a disciplined cut for men and women, from training to the street.",
  },
  outerwear: {
    eyebrow: "Collection",
    heading: "Outerwear.",
    intro: "Utility jackets and shells with tactical detailing, made to be worn hard.",
    metaTitle: "Outerwear",
    metaDescription:
      "Shop Sohe Nation outerwear: utility jackets and shells with tactical detailing for men and women.",
  },
  tops: {
    eyebrow: "Collection",
    heading: "Tops.",
    intro: "Tees, knits, and layering tops that anchor the uniform.",
    metaTitle: "Tops",
    metaDescription: "Shop Sohe Nation tops: tees, knits, and layering pieces that anchor the uniform.",
  },
  bottoms: {
    eyebrow: "Collection",
    heading: "Bottoms.",
    intro: "Utility and tailored trousers cut for movement.",
    metaTitle: "Bottoms",
    metaDescription: "Shop Sohe Nation bottoms: utility and tailored trousers cut for movement.",
  },
  headwear: {
    eyebrow: "Collection",
    heading: "Headwear.",
    intro: "Caps and headwear that finish the uniform.",
    metaTitle: "Headwear",
    metaDescription: "Shop Sohe Nation headwear: caps that finish the uniform.",
  },
};

export const COLLECTION_LANDINGS: Record<string, CatalogLanding> = Object.fromEntries(
  Object.entries(COLLECTION_CATEGORIES).map(([slug, category]) => [
    slug,
    { ...collectionCopy[slug], path: `/collections/${slug}`, fixed: { category } },
  ]),
);

export const ALL_PRODUCTS_LANDING: CatalogLanding = {
  path: "/products",
  eyebrow: "The Line",
  heading: "Uniforms for the street.",
  intro:
    "Move through the current selection with a sharper lens. Start with the silhouettes that fit the moment, then narrow by category, size, and price.",
  metaTitle: "Shop All",
  metaDescription:
    "Shop the full Sohe Nation line: tactical outerwear, tracksuits, tops, bottoms, and headwear for men and women.",
  fixed: {},
};

export function getCollectionLanding(slug: string): CatalogLanding | null {
  return Object.hasOwn(COLLECTION_LANDINGS, slug) ? COLLECTION_LANDINGS[slug] : null;
}

export type LandingCrumb = { name: string; path: string };

const HOME_CRUMB: LandingCrumb = { name: "Home", path: "/" };
const SHOP_CRUMB: LandingCrumb = { name: "Shop All", path: ALL_PRODUCTS_LANDING.path };

/** Breadcrumb trail for a landing page (structured data). */
export function landingCrumbs(landing: CatalogLanding): LandingCrumb[] {
  if (landing.path === ALL_PRODUCTS_LANDING.path) return [HOME_CRUMB, SHOP_CRUMB];
  if (landing.fixed.category) return [HOME_CRUMB, SHOP_CRUMB, { name: landing.metaTitle, path: landing.path }];
  return [HOME_CRUMB, { name: landing.eyebrow, path: landing.path }];
}

/** Home → Shop All → the product's collection → the product. */
export function productCrumbs(product: { title: string; slug: string; category: string }): LandingCrumb[] {
  const collectionSlug = CATEGORY_COLLECTIONS[product.category];
  const collection = collectionSlug ? COLLECTION_LANDINGS[collectionSlug] : null;
  return [
    HOME_CRUMB,
    SHOP_CRUMB,
    ...(collection ? [{ name: collection.metaTitle, path: collection.path }] : []),
    { name: product.title, path: `/products/${product.slug}` },
  ];
}
