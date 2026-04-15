import type { Product } from "@/core/types/commerce";
import { storefrontMock } from "@/mocks/storefront";

export async function getMockProducts(): Promise<Product[]> {
  return storefrontMock.featuredProducts;
}
