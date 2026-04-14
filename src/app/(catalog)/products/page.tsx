import { ProductGrid } from "@/features/product-discovery/presentation/components/product-grid";
import { storefrontMock } from "@/mocks/storefront";

export default function ProductsPage() {
  return (
    <main className="flex-1 py-16">
      <ProductGrid
        eyebrow="Catalog Preview"
        title="The first rail of the product system."
        description="A simple catalog route is already wired to fixture data so discovery can scale from this contract shape."
        products={storefrontMock.featuredProducts}
      />
    </main>
  );
}
