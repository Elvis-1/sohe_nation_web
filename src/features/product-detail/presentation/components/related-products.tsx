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
      description="Related fixtures now, ready to become rule-driven recommendations once catalog services are wired to the backend."
      products={products}
    />
  );
}
