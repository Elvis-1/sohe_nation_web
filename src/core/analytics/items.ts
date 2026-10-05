import type { CartLine, Product, ProductVariant } from "@/core/types/commerce";

import type { AnalyticsItem } from "./track";

export function productItem(product: Product, variant: ProductVariant | undefined, quantity = 1): AnalyticsItem {
  return {
    id: product.id,
    name: product.title,
    variant: variant ? variant.title || `${variant.size} / ${variant.color}` : undefined,
    category: product.category,
    price: variant?.price.amount ?? product.priceRange.min.amount,
    quantity,
  };
}

export function cartLineItem(line: Pick<CartLine, "productId" | "title" | "variantLabel" | "unitPrice" | "quantity">): AnalyticsItem {
  return {
    id: line.productId,
    name: line.title,
    variant: line.variantLabel,
    price: line.unitPrice.amount,
    quantity: line.quantity,
  };
}

export function itemsValue(items: AnalyticsItem[]): number {
  return Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100;
}
