import type { Product } from "@/core/types/commerce";

export type ProductDetail = {
  product: Product;
  campaignNote: string;
  fitGuidance: string;
  materialStory: string;
  sustainabilityNote: string;
  deliveryNote: string;
  lookbookMoments: Array<{
    title: string;
    body: string;
  }>;
  relatedProducts: Product[];
};
