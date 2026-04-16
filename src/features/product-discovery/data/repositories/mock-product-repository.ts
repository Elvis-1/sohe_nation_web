/**
 * @deprecated Use product-repository.ts (API-backed) instead.
 * Kept for reference only. Not used by any active service.
 */

import type { Product } from "@/core/types/commerce";
import { storefrontMock } from "@/mocks/storefront";

export async function getMockProducts(): Promise<Product[]> {
  return storefrontMock.featuredProducts;
}
