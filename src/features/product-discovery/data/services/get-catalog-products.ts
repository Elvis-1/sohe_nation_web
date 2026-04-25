import type { Product } from "@/core/types/commerce";

import { getProducts } from "../repositories/product-repository";

export type CatalogSort = "featured" | "price-asc" | "price-desc" | "title";

export type CatalogFilters = {
  query: string;
  category: string;
  gender: string;
  size: string;
  price: string;
  sort: CatalogSort;
};

export type CatalogFacet = {
  value: string;
  label: string;
  count: number;
};

export type CatalogResult = {
  products: Product[];
  total: number;
  availableFacets: {
    categories: CatalogFacet[];
    genders: CatalogFacet[];
    sizes: CatalogFacet[];
    priceBands: CatalogFacet[];
  };
  appliedFilters: CatalogFilters;
};

const sortOptions: CatalogSort[] = ["featured", "price-asc", "price-desc", "title"];

const priceBands = [
  { value: "under-60000", label: "Under NGN 60k", min: 0, max: 60000 },
  { value: "60000-120000", label: "NGN 60k - 120k", min: 60000, max: 120000 },
  { value: "over-120000", label: "Over NGN 120k", min: 120000, max: Number.POSITIVE_INFINITY },
];

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function sanitize(value: string) {
  return value.trim().toLowerCase();
}

function getPriceBandValue(product: Product) {
  const amount = product.priceRange.min.amount;
  const match = priceBands.find((band) => amount >= band.min && amount < band.max);
  return match?.value ?? "over-120000";
}

export function parseCatalogFilters(searchParams: {
  [key: string]: string | string[] | undefined;
}): CatalogFilters {
  const sort = firstValue(searchParams.sort);

  return {
    query: firstValue(searchParams.query).trim(),
    category: firstValue(searchParams.category).trim().toLowerCase(),
    gender: firstValue(searchParams.gender).trim().toLowerCase(),
    size: firstValue(searchParams.size).trim().toUpperCase(),
    price: firstValue(searchParams.price).trim().toLowerCase(),
    sort: sortOptions.includes(sort as CatalogSort) ? (sort as CatalogSort) : "featured",
  };
}

function matchesQuery(product: Product, query: string) {
  if (!query) {
    return true;
  }

  const normalizedQuery = sanitize(query);
  const haystack = [
    product.title,
    product.subtitle,
    product.description,
    product.category,
    product.gender,
    ...product.variants.map((variant) => `${variant.color} ${variant.size}`),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

function matchesPrice(product: Product, price: string) {
  if (!price) {
    return true;
  }

  return getPriceBandValue(product) === price;
}

function resolveCatalogGenderQuery(gender: string) {
  if (gender === "men" || gender === "women") {
    return undefined;
  }
  return gender || undefined;
}

function matchesGender(product: Product, gender: string) {
  if (!gender) {
    return true;
  }

  if (gender === "men" || gender === "women") {
    return product.gender === gender || product.gender === "unisex";
  }

  return product.gender === gender;
}

function sortProducts(products: Product[], sort: CatalogSort) {
  const sorted = [...products];

  if (sort === "price-asc") {
    sorted.sort((left, right) => left.priceRange.min.amount - right.priceRange.min.amount);
  }

  if (sort === "price-desc") {
    sorted.sort((left, right) => right.priceRange.min.amount - left.priceRange.min.amount);
  }

  if (sort === "title") {
    sorted.sort((left, right) => left.title.localeCompare(right.title));
  }

  return sorted;
}

function buildFacet(values: string[], labels?: Record<string, string>) {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([value, count]) => ({
      value,
      label: labels?.[value] ?? value,
      count,
    }));
}

export async function getCatalogProducts(filters: CatalogFilters): Promise<CatalogResult> {
  const products = await getProducts({
    category: filters.category || undefined,
    gender: resolveCatalogGenderQuery(filters.gender),
    search: filters.query || undefined,
  });

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesSize =
      !filters.size || product.variants.some((variant) => variant.size === filters.size);

    return (
      matchesCategory &&
      matchesGender(product, filters.gender) &&
      matchesSize &&
      matchesPrice(product, filters.price) &&
      matchesQuery(product, filters.query)
    );
  });

  return {
    products: sortProducts(filteredProducts, filters.sort),
    total: filteredProducts.length,
    availableFacets: {
      categories: buildFacet(products.map((product) => product.category), {
        bottoms: "Bottoms",
        headwear: "Headwear",
        outerwear: "Outerwear",
        tops: "Tops",
        tracksuit: "Tracksuit",
      }),
      genders: buildFacet(products.map((product) => product.gender), {
        men: "Men",
        women: "Women",
        unisex: "Unisex",
      }),
      sizes: buildFacet(
        products.flatMap((product) => product.variants.map((variant) => variant.size)),
      ),
      priceBands: buildFacet(products.map(getPriceBandValue), {
        "60000-120000": "NGN 60k - 120k",
        "over-120000": "Over NGN 120k",
        "under-60000": "Under NGN 60k",
      }),
    },
    appliedFilters: filters,
  };
}
