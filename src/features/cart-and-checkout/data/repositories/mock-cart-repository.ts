import type { Cart, CartLine, CheckoutProvider, CheckoutSession, Product } from "@/core/types/commerce";
import { storefrontMock } from "@/mocks/storefront";

export type StoredCartLine = {
  productId: string;
  variantId: string;
  quantity: number;
};

function formatMoney(amount: number) {
  return {
    amount,
    currency: "NGN" as const,
    formatted: `NGN ${amount.toLocaleString("en-NG")}`,
  };
}

function findProduct(productId: string) {
  return storefrontMock.featuredProducts.find((product) => product.id === productId);
}

function findVariant(product: Product, variantId: string) {
  return product.variants.find((variant) => variant.id === variantId);
}

export function createStoredCartLine(product: Product, variantId: string, quantity = 1): StoredCartLine {
  return {
    productId: product.id,
    variantId,
    quantity,
  };
}

export function buildCart(lines: StoredCartLine[]): Cart {
  const hydratedLines: CartLine[] = lines.flatMap((line) => {
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
        lineTotal: formatMoney(lineTotalAmount),
      },
    ];
  });

  const subtotalAmount = hydratedLines.reduce((sum, line) => sum + line.lineTotal.amount, 0);
  const shippingAmount = hydratedLines.length ? 15000 : 0;
  const discountAmount = subtotalAmount >= 250000 ? 10000 : 0;
  const totalAmount = subtotalAmount + shippingAmount - discountAmount;

  return {
    id: "mock-cart-ng",
    region: "NG",
    currency: "NGN",
    lines: hydratedLines,
    summary: {
      subtotal: formatMoney(subtotalAmount),
      shipping: formatMoney(shippingAmount),
      discount: formatMoney(discountAmount),
      total: formatMoney(totalAmount),
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
