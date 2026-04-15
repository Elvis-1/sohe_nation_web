import { ProductGrid } from "@/features/product-discovery/presentation/components/product-grid";

import type { Product } from "@/core/types/commerce";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) {
    return null;
  }

  return (
    <ProductGrid
      eyebrow="Recommended Looks"
      title="Build the full uniform."
      description="Continue the line with complementary layers and supporting pieces drawn from the current edit."
      products={products}
    />
  );
}
