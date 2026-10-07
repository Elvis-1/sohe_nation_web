import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  buildPageMetadata,
  shareImagesFromMedia,
  shareImagesWithOverride,
} from "@/core/config/page-metadata";
import { breadcrumbJsonLd, productGroupJsonLd } from "@/core/seo/structured-data";
import { JsonLd } from "@/core/ui/json-ld";
import { productCrumbs } from "@/features/product-discovery/data/catalog-landings";
import { Container } from "@/core/ui/container";
import { getProductDetail } from "@/features/product-detail/data/services/get-product-detail";
import { getStorefrontSettings } from "@/features/settings/data/services/get-storefront-settings";
import { ProductGallery } from "@/features/product-detail/presentation/components/product-gallery";
import { ProductPurchasePanel } from "@/features/product-detail/presentation/components/product-purchase-panel";
import { ProductStoryBlocks } from "@/features/product-detail/presentation/components/product-story-blocks";
import { ViewItemTracker } from "@/features/product-detail/presentation/components/view-item-tracker";
import { RelatedProducts } from "@/features/product-detail/presentation/components/related-products";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getProductDetail(slug).catch(() => null);
  if (!detail) {
    return {};
  }
  const { product } = detail;
  const title = product.subtitle ? `${product.title}: ${product.subtitle}` : product.title;
  return buildPageMetadata({
    title: product.seo?.title || title,
    description: product.seo?.description || product.description || product.subtitle || product.title,
    path: `/products/${product.slug}`,
    images: shareImagesWithOverride(product.seo, product.title, shareImagesFromMedia(product.media)),
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [detail, settings] = await Promise.all([getProductDetail(slug), getStorefrontSettings()]);

  if (!detail) {
    notFound();
  }

  return (
    <Container className="py-10 md:py-14">
      <JsonLd
        data={[productGroupJsonLd(detail.product), breadcrumbJsonLd(productCrumbs(detail.product))]}
      />
      <ViewItemTracker product={detail.product} />
      <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery product={detail.product} />
        <ProductPurchasePanel product={detail.product} returnRules={settings.returns} />
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
