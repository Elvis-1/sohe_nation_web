/**
 * Client-side bag: lines live in browser storage (see api/PLAN.md Slice 9 cart decision).
 * Totals here are display estimates; checkout prices come from the server quote.
 */

import type { Cart, CartLine, CurrencyCode, Product } from "@/core/types/commerce";

export type StoredCartLine = {
  productId: string;
  variantId: string;
  quantity: number;
  title?: string;
  variantLabel?: string;
  unitPriceAmount?: number;
  unitPriceCurrency?: CurrencyCode;
  unitPriceFormatted?: string;
  unitShippingAmount?: number;
  unitShippingCurrency?: CurrencyCode;
  unitShippingFormatted?: string;
};

function formatMoney(amount: number, currency: CurrencyCode = "NGN") {
  const locale = currency === "NGN" ? "en-NG" : "en-US";
  return {
    amount,
    currency,
    formatted: `${currency} ${amount.toLocaleString(locale)}`,
  };
}

function findVariant(product: Product, variantId: string) {
  return product.variants.find((variant) => variant.id === variantId);
}

export function createStoredCartLine(product: Product, variantId: string, quantity = 1): StoredCartLine {
  const variant = findVariant(product, variantId);
  const fallbackVariant = product.variants[0];
  const selectedVariant = variant ?? fallbackVariant;

  if (!selectedVariant) {
    return {
      productId: product.id,
      variantId,
      quantity,
      title: product.title,
      variantLabel: "Selected variant",
      unitPriceAmount: 0,
      unitPriceCurrency: "NGN",
      unitPriceFormatted: "NGN 0",
      unitShippingAmount: 0,
      unitShippingCurrency: "NGN",
      unitShippingFormatted: "NGN 0",
    };
  }

  return {
    productId: product.id,
    variantId: selectedVariant.id,
    quantity,
    title: product.title,
    variantLabel: `${selectedVariant.color} / ${selectedVariant.size}`,
    unitPriceAmount: selectedVariant.price.amount,
    unitPriceCurrency: selectedVariant.price.currency,
    unitPriceFormatted: selectedVariant.price.formatted,
    unitShippingAmount: product.shippingCost?.amount ?? 0,
    unitShippingCurrency: product.shippingCost?.currency ?? selectedVariant.price.currency,
    unitShippingFormatted:
      product.shippingCost?.formatted ??
      formatMoney(0, selectedVariant.price.currency).formatted,
  };
}

export function buildCart(lines: StoredCartLine[]): Cart {
  const hydratedLines: CartLine[] = lines.flatMap((line) => {
    // Hydrate from the stored snapshot so API-backed products remain stable.
    if (
      line.title &&
      line.variantLabel &&
      typeof line.unitPriceAmount === "number" &&
      line.unitPriceCurrency &&
      line.unitPriceFormatted &&
      typeof line.unitShippingAmount === "number" &&
      line.unitShippingCurrency &&
      line.unitShippingFormatted
    ) {
      const quantity = Math.max(1, line.quantity);
      const unitPrice = {
        amount: line.unitPriceAmount,
        currency: line.unitPriceCurrency,
        formatted: line.unitPriceFormatted,
      };
      const lineShippingAmount = line.unitShippingAmount * quantity;
      return [
        {
          id: `${line.productId}:${line.variantId}`,
          productId: line.productId,
          variantId: line.variantId,
          title: line.title,
          variantLabel: line.variantLabel,
          quantity,
          unitPrice,
          lineTotal: formatMoney(unitPrice.amount * quantity, unitPrice.currency),
          shippingTotal: formatMoney(lineShippingAmount, line.unitShippingCurrency),
        },
      ];
    }

    // Lines without a price snapshot predate the API catalog and cannot be priced; drop them.
    return [];
  });

  const subtotalAmount = hydratedLines.reduce((sum, line) => sum + line.lineTotal.amount, 0);
  const summaryCurrency = hydratedLines[0]?.unitPrice.currency ?? "NGN";
  const shippingAmount = hydratedLines.reduce((sum, line) => sum + (line.shippingTotal?.amount ?? 0), 0);
  const discountAmount = subtotalAmount >= 250000 ? 10000 : 0;
  const totalAmount = subtotalAmount + shippingAmount - discountAmount;

  return {
    id: "local-cart",
    region: "NG",
    currency: "NGN",
    lines: hydratedLines,
    summary: {
      subtotal: formatMoney(subtotalAmount, summaryCurrency),
      shipping: formatMoney(shippingAmount, summaryCurrency),
      discount: formatMoney(discountAmount, summaryCurrency),
      total: formatMoney(totalAmount, summaryCurrency),
    },
  };
}
