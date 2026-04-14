export type RegionCode = "NG" | "US" | "GB" | "EU";
export type CurrencyCode = "NGN" | "USD" | "GBP" | "EUR";

export type Money = {
  amount: number;
  currency: CurrencyCode;
  formatted: string;
};

export type MediaAsset = {
  id: string;
  alt: string;
  type: "image" | "video";
  url: string;
  posterUrl?: string;
};

export type ProductVariantAttribute = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  sku: string;
  slug: string;
  title: string;
  size: string;
  color: string;
  inventoryQuantity: number;
  isAvailable: boolean;
  price: Money;
  compareAtPrice?: Money;
  attributes: ProductVariantAttribute[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  badge?: string;
  description: string;
  regionAvailability: RegionCode[];
  defaultRegion: RegionCode;
  category: "tracksuit" | "outerwear" | "tops" | "bottoms" | "headwear";
  gender: "women" | "men" | "unisex";
  media: MediaAsset[];
  priceRange: {
    min: Money;
    max: Money;
  };
  variants: ProductVariant[];
};

export type NavigationItem = {
  label: string;
  href: string;
};

export type HeroCampaign = {
  eyebrow: string;
  title: string;
  statement: string;
  description: string;
  primaryCta: NavigationItem;
  secondaryCta: NavigationItem;
  campaignStats: Array<{
    label: string;
    value: string;
  }>;
  media: MediaAsset;
};

export type CartLine = {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  variantLabel: string;
  quantity: number;
  unitPrice: Money;
  lineTotal: Money;
};

export type CartSummary = {
  subtotal: Money;
  shipping: Money;
  discount: Money;
  total: Money;
};

export type Cart = {
  id: string;
  region: RegionCode;
  currency: CurrencyCode;
  lines: CartLine[];
  summary: CartSummary;
};

export type CheckoutProvider = "paypal" | "flutterwave";

export type CheckoutSession = {
  id: string;
  region: RegionCode;
  currency: CurrencyCode;
  provider: CheckoutProvider;
  approvalUrl: string;
  status: "created" | "pending_redirect" | "authorized" | "failed";
};

export type OrderSummary = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
  total: Money;
};

export type CustomerProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  defaultRegion: RegionCode;
  orders: OrderSummary[];
};
