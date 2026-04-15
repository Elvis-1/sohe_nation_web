import { notFound } from "next/navigation";

import { Container } from "@/core/ui/container";
import { getProductDetail } from "@/features/product-detail/data/services/get-product-detail";
import { ProductGallery } from "@/features/product-detail/presentation/components/product-gallery";
import { ProductPurchasePanel } from "@/features/product-detail/presentation/components/product-purchase-panel";
import { ProductStoryBlocks } from "@/features/product-detail/presentation/components/product-story-blocks";
import { RelatedProducts } from "@/features/product-detail/presentation/components/related-products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getProductDetail(slug);

  if (!detail) {
    notFound();
  }

  return (
    <Container className="py-10 md:py-14">
      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery product={detail.product} />
        <ProductPurchasePanel product={detail.product} />
      </div>

      <div className="mt-8">
        <ProductStoryBlocks detail={detail} />
      </div>

      <div className="mt-6">
        <RelatedProducts products={detail.relatedProducts} />
      </div>
    </Container>
  );
}
