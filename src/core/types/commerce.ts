export type RegionCode = "NG" | "US" | "GB" | "EU";
export type CurrencyCode = "NGN" | "USD" | "GBP" | "EUR";

export type Money = {
  amount: number;
  currency: CurrencyCode;
  formatted: string;
};

/** Staff-set search/share overrides; empty strings mean "use the default". */
export type SeoOverrides = {
  title: string;
  description: string;
  imageUrl: string;
};

export type ProductReturnPolicy = "standard" | "final_sale" | "custom";

/** A product's own return rule; `windowDays` is set only for a custom window. */
export type ProductReturnRule = {
  policy: ProductReturnPolicy;
  windowDays: number | null;
};

/** Store-wide return rules from dashboard Settings → Returns. */
export type StoreReturnRules = {
  returnWindowDays: number;
  /** Delivery regions where "final sale" applies; elsewhere final-sale items get the store window. */
  finalSaleRegions: RegionCode[];
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
  /** Only on the product detail read. */
  seo?: SeoOverrides;
  priceRange: {
    min: Money;
    max: Money;
  };
  shippingCost?: Money;
  returnRule: ProductReturnRule;
  variants: ProductVariant[];
};

export type NavigationItem = {
  label: string;
  href: string;
  isDisabled?: boolean;
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
  shippingTotal?: Money;
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
  /** Present on the status read; used to report the purchase to analytics. */
  orderId?: string;
  orderNumber?: string;
  total?: Money;
  lines?: Array<{
    productId: string;
    variantId: string;
    title: string;
    variantLabel: string;
    quantity: number;
    unitPrice: Money;
  }>;
};

export type OrderSummary = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
  total: Money;
  /** Something can be returned for any reason. */
  isReturnEligible?: boolean;
  /** Something can be returned, at least as faulty (final sale, or the window has closed). */
  canReportFaulty?: boolean;
};

export type CustomerProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  defaultRegion: RegionCode;
  orders: OrderSummary[];
};
