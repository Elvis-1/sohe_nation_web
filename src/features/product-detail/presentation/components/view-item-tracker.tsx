"use client";

import { useEffect } from "react";

import { productItem } from "@/core/analytics/items";
import { track } from "@/core/analytics/track";
import type { Product } from "@/core/types/commerce";

/** Reports `view_item` once per product page view (dropped unless consent was given). */
export function ViewItemTracker({ product }: { product: Product }) {
  useEffect(() => {
    const variant = product.variants.find((item) => item.isAvailable) ?? product.variants[0];
    const item = productItem(product, variant, 1);
    track({
      name: "view_item",
      currency: variant?.price.currency ?? product.priceRange.min.currency,
      value: item.price,
      items: [item],
    });
    // Keyed on the product id: one event per product, not per render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  return null;
}
