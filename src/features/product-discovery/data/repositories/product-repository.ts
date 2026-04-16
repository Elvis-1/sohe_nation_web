/**
 * Storefront product repository — API-backed.
 * Replaces the static fixture mock used in the fixture phase.
 *
 * Reads from GET /api/v1/catalog/products/ and /api/v1/catalog/products/:slug/
 */

import type { Product } from "@/core/types/commerce";
import { HttpError, httpClient } from "@/core/api/http-client";
import {
  mapApiProductToStorefront,
  mapApiNarrativeToDetail,
  type ApiProduct,
  type ApiPaginatedProducts,
} from "@/features/product-discovery/data/mappers/product-api-mapper";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

type GetProductsParams = {
  category?: string;
  gender?: string;
  region?: string;
  search?: string;
  page?: number;
};

export async function getProducts(params: GetProductsParams = {}): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.gender) query.set("gender", params.gender);
  if (params.region) query.set("region", params.region);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));

  const url = `${API_BASE}/catalog/products/${query.toString() ? `?${query}` : ""}`;
  const data = await httpClient<ApiPaginatedProducts>(url);
  return data.results.map(mapApiProductToStorefront);
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
