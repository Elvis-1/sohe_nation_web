/**
 * Storefront product repository — API-backed.
 * Replaces the static fixture mock used in the fixture phase.
 *
 * Reads from GET /api/v1/catalog/products/ and /api/v1/catalog/products/:slug/
 */

import type { Product } from "@/core/types/commerce";
import { HttpError, httpClient } from "@/core/api/http-client";
import { fetchAllPages, pageQuery } from "@/core/api/paginate";
import { resolveApiBaseUrl } from "@/core/api/resolve-api-base-url";
import {
  mapApiProductToStorefront,
  mapApiNarrativeToDetail,
  type ApiProduct,
  type ApiPaginatedProducts,
} from "@/features/product-discovery/data/mappers/product-api-mapper";

const API_BASE = resolveApiBaseUrl();

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

type GetProductsParams = {
  category?: string;
  gender?: string;
  region?: string;
  search?: string;
};

/** Every matching product across all API pages, so client-side sort and facets see the full set. */
export async function getProducts(params: GetProductsParams = {}): Promise<Product[]> {
  const filters = new URLSearchParams();
  if (params.category) filters.set("category", params.category);
  if (params.gender) filters.set("gender", params.gender);
  if (params.region) filters.set("region", params.region);
  if (params.search) filters.set("search", params.search);

  const products = await fetchAllPages((page, pageSize) =>
    httpClient<ApiPaginatedProducts>(
      `${API_BASE}/catalog/products/${pageQuery(page, pageSize, filters)}`,
    ),
  );
  return products.map(mapApiProductToStorefront);
}

// ---------------------------------------------------------------------------
// Detail
// ---------------------------------------------------------------------------

export async function getProductBySlug(slug: string): Promise<{
  product: Product;
  narrative: ReturnType<typeof mapApiNarrativeToDetail>;
} | null> {
  try {
    const data = await httpClient<ApiProduct>(`${API_BASE}/catalog/products/${slug}/`);
    return {
      product: mapApiProductToStorefront(data),
      narrative: mapApiNarrativeToDetail(data.narrative),
    };
  } catch (err: unknown) {
    if (err instanceof HttpError && err.status === 404) {
      return null;
    }
    throw err;
  }
}
