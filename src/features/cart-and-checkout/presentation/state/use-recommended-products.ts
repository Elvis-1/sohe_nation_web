"use client";

import { useEffect, useState } from "react";

import type { Product } from "@/core/types/commerce";

import { getRecommendedProducts } from "../../data/services/get-recommended-products";

/** Recommendations for the bag; empty while loading or if the catalog cannot be read. */
export function useRecommendedProducts(productIds: string[]): Product[] {
  const [products, setProducts] = useState<Product[]>([]);
  const key = productIds.join(",");

  useEffect(() => {
    let isActive = true;
    getRecommendedProducts(key ? key.split(",") : []).then(
      (next) => {
        if (isActive) setProducts(next);
      },
      () => {
        if (isActive) setProducts([]);
      },
    );
    return () => {
      isActive = false;
    };
  }, [key]);

  return products;
}
