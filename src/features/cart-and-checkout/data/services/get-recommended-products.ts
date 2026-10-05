import type { Product } from "@/core/types/commerce";
import { getProducts } from "@/features/product-discovery/data/repositories/product-repository";

const RECOMMENDATION_LIMIT = 3;

/** Live catalog products not already in the bag. */
export async function getRecommendedProducts(excludeProductIds: string[]): Promise<Product[]> {
  const excluded = new Set(excludeProductIds);
  const products = await getProducts();
  return products.filter((product) => !excluded.has(product.id)).slice(0, RECOMMENDATION_LIMIT);
}
