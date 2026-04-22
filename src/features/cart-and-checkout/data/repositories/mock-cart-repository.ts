import type { Cart, CartLine, CheckoutProvider, CheckoutSession, CurrencyCode, Product } from "@/core/types/commerce";
import { storefrontMock } from "@/mocks/storefront";

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

function findProduct(productId: string) {
  return storefrontMock.featuredProducts.find((product) => product.id === productId);
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
    // Preferred path: hydrate directly from stored snapshot so API-backed products remain stable.
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

    // Backward-compat path for older localStorage entries from the fixture-only phase.
    const product = findProduct(line.productId);

    if (!product) {
      return [];
    }

    const variant = findVariant(product, line.variantId);

    if (!variant) {
      return [];
    }

    const quantity = Math.max(1, line.quantity);
    const lineTotalAmount = variant.price.amount * quantity;

    return [
      {
        id: `${line.productId}:${line.variantId}`,
        productId: product.id,
        variantId: variant.id,
        title: product.title,
        variantLabel: `${variant.color} / ${variant.size}`,
        quantity,
        unitPrice: variant.price,
        lineTotal: formatMoney(lineTotalAmount, variant.price.currency),
        shippingTotal: formatMoney(0, variant.price.currency),
      },
    ];
  });

  const subtotalAmount = hydratedLines.reduce((sum, line) => sum + line.lineTotal.amount, 0);
  const summaryCurrency = hydratedLines[0]?.unitPrice.currency ?? "NGN";
  const shippingAmount = hydratedLines.reduce((sum, line) => sum + (line.shippingTotal?.amount ?? 0), 0);
  const discountAmount = subtotalAmount >= 250000 ? 10000 : 0;
  const totalAmount = subtotalAmount + shippingAmount - discountAmount;

  return {
    id: "mock-cart-ng",
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

export function getCartProducts(cart: Cart) {
  return cart.lines
    .map((line) => findProduct(line.productId))
    .filter((product): product is Product => Boolean(product));
}

export function getRecommendedProducts(cart: Cart): Product[] {
  const cartProductIds = new Set(cart.lines.map((line) => line.productId));

  return storefrontMock.featuredProducts
    .filter((product) => !cartProductIds.has(product.id))
    .slice(0, 3);
}

export function getRecommendedProductsForProductIds(productIds: string[]): Product[] {
  const cartProductIds = new Set(productIds);

  return storefrontMock.featuredProducts
    .filter((product) => !cartProductIds.has(product.id))
    .slice(0, 3);
}

export async function createMockCheckoutSession(
  cart: Cart,
  provider: CheckoutProvider,
): Promise<CheckoutSession> {
  return {
    id: `chk_${provider}_${cart.lines.length || 1}`,
    region: cart.region,
    currency: cart.currency,
    provider,
    approvalUrl: `https://mock.sohe.test/checkout/${provider}`,
    status: "pending_redirect",
  };
}
