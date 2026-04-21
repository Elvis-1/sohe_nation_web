import type { CheckoutProvider } from "@/core/types/commerce";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type EndpointDefinition = {
  method: HttpMethod;
  path: string;
  auth: "public" | "customer" | "staff";
  description: string;
};

export const apiEndpoints = {
  campaignHome: {
    method: "GET",
    path: "/api/v1/content/homepage",
    auth: "public",
    description: "Returns homepage campaign modules, hero content, and featured rails.",
  },
  catalogList: {
    method: "GET",
    path: "/api/v1/catalog/products",
    auth: "public",
    description:
      "Returns paginated catalog items filtered by collection, category, gender, size, price, search, and region.",
  },
  catalogDetail: {
    method: "GET",
    path: "/api/v1/catalog/products/:slug",
    auth: "public",
    description: "Returns a single PDP payload including media, variants, delivery messaging, and related products.",
  },
  cartDetail: {
    method: "GET",
    path: "/api/v1/cart",
    auth: "customer",
    description: "Returns the active cart for the current customer or guest session.",
  },
  cartUpsertLine: {
    method: "POST",
    path: "/api/v1/cart/lines",
    auth: "customer",
    description: "Adds or updates a cart line for a selected product variant and quantity.",
  },
  checkoutCreate: {
    method: "POST",
    path: "/api/v1/checkout/sessions",
    auth: "customer",
    description:
      "Creates a checkout session for the active cart and returns a hosted provider redirect URL for PayPal or Flutterwave.",
  },
  checkoutStatus: {
    method: "GET",
    path: "/api/v1/checkout/sessions/:id",
    auth: "customer",
    description: "Polls the status of a checkout session after provider redirect or webhook reconciliation.",
  },
  accountProfile: {
    method: "GET",
    path: "/api/v1/account/profile",
    auth: "customer",
    description: "Returns the authenticated customer profile and saved preferences.",
  },
  accountOrders: {
    method: "GET",
    path: "/api/v1/account/orders",
    auth: "customer",
    description: "Returns paginated order history for the authenticated customer.",
  },
  accountAddresses: {
    method: "GET",
    path: "/api/v1/account/addresses",
    auth: "customer",
    description: "Returns the authenticated customer's saved shipping addresses.",
  },
} satisfies Record<string, EndpointDefinition>;

export const supportedCheckoutProviders: CheckoutProvider[] = [
  "paypal",
  "flutterwave",
];

export const regionalizationDecision = {
  strategy: "region-ready-single-market-launch",
  summary:
    "Contracts support region and currency fields from day one, while v1 UI and operations can launch with one primary market before expanding.",
};
