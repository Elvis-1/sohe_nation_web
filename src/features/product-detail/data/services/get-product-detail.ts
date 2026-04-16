import type { ProductDetail } from "@/features/product-detail/domain/entities/product-detail";
import { getProductBySlug, getProducts } from "@/features/product-discovery/data/repositories/product-repository";

export async function getProductDetail(slug: string): Promise<ProductDetail | null> {
  const result = await getProductBySlug(slug);

  if (!result) {
    return null;
  }

  const { product, narrative } = result;

  // Fetch related products: same category or gender, excluding current slug
  const candidates = await getProducts({
    category: product.category,
  });
  const relatedProducts = candidates
    .filter((item) => item.slug !== slug)
    .slice(0, 3);

  return {
    product,
    relatedProducts,
    campaignNote: narrative.campaignNote,
    fitGuidance: narrative.fitGuidance,
    materialStory: narrative.materialStory,
    sustainabilityNote: narrative.sustainabilityNote,
    deliveryNote: narrative.deliveryNote,
    lookbookMoments: narrative.lookbookMoments,
  };
}
