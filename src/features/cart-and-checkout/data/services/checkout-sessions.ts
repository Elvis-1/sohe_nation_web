import type {
  Cart,
  CartSummary,
  CheckoutProvider,
  CheckoutSession,
  Money,
  ProductReturnRule,
} from "@/core/types/commerce";
import { resolveApiBaseUrl } from "@/core/api/resolve-api-base-url";
import { toReturnRule } from "@/core/utils/return-rule";

type ShippingAddressInput = {
  recipientName: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode?: string;
  countryCode: string;
};

type ApiCheckoutSession = {
  id: string;
  order_id: string;
  provider: CheckoutProvider;
  status: CheckoutSession["status"] | "cancelled";
  region: string;
  currency: Cart["currency"];
  approvalUrl: string;
  providerStatus: string;
  order_number?: string;
  total?: Money;
  lines?: Array<{
    product_id: string;
    variant_id: string;
    title: string;
    variant_label: string;
    quantity: number;
    unit_price: Money;
  }>;
};

type ApiCheckoutQuote = {
  currency: Cart["currency"];
  lines: Array<{
    product_id: string;
    variant_id: string;
    title: string;
    variant_label: string;
    quantity: number;
    unit_price: Money;
    line_total: Money;
    return_policy?: string;
    return_window_days?: number | null;
  }>;
  summary: CartSummary;
};

export type CheckoutQuote = {
  currency: Cart["currency"];
  lines: Array<{
    productId: string;
    variantId: string;
    title: string;
    variantLabel: string;
    quantity: number;
    unitPrice: Money;
    lineTotal: Money;
    /** The product's own return rule; the notice resolves it for the delivery region. */
    returnRule: ProductReturnRule;
  }>;
  summary: CartSummary;
};

type AccountAuth = {
  token: string;
};

type ApiError = {
  error?: {
    code?: string;
    message?: string;
  };
};

const API_BASE = resolveApiBaseUrl();
const STOREFRONT_BASE =
  process.env.NEXT_PUBLIC_STOREFRONT_BASE_URL ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

function toApiSession(payload: ApiCheckoutSession): CheckoutSession {
  return {
    id: payload.id,
    region: payload.region as CheckoutSession["region"],
    currency: payload.currency,
    provider: payload.provider,
    approvalUrl: payload.approvalUrl,
    status:
      payload.status === "authorized"
        ? "authorized"
        : payload.status === "failed" || payload.status === "cancelled"
          ? "failed"
          : payload.status === "pending_redirect"
            ? "pending_redirect"
            : "created",
    orderId: payload.order_id,
    orderNumber: payload.order_number,
    total: payload.total,
    lines: payload.lines?.map((line) => ({
      productId: line.product_id,
      variantId: line.variant_id,
      title: line.title,
      variantLabel: line.variant_label,
      quantity: line.quantity,
      unitPrice: line.unit_price,
    })),
  };
}

function toRequestLines(cart: Cart) {
  return cart.lines.map((line) => ({
    product_id: line.productId,
    variant_id: line.variantId,
    quantity: line.quantity,
  }));
}

async function parseError(response: Response, fallback: string): Promise<string> {
  const body = (await response.json().catch(() => null)) as ApiError | null;
  return body?.error?.message ?? fallback;
}

export async function createCheckoutSession(
  cart: Cart,
  provider: CheckoutProvider,
  shippingAddress: ShippingAddressInput,
  auth?: AccountAuth,
): Promise<CheckoutSession> {
  const response = await fetch(`${API_BASE}/checkout/sessions/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
    },
    body: JSON.stringify({
      provider,
      region: cart.region,
      currency: cart.currency,
      shipping_address: {
        recipient_name: shippingAddress.recipientName,
        phone: shippingAddress.phone ?? "",
        line_1: shippingAddress.line1,
        line_2: shippingAddress.line2 ?? "",
        city: shippingAddress.city,
        state: shippingAddress.state,
        postal_code: shippingAddress.postalCode ?? "",
        country_code: shippingAddress.countryCode,
      },
      callback_url: `${STOREFRONT_BASE}/checkout/return`,
      lines: toRequestLines(cart),
    }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Unable to start checkout right now."));
  }

  const payload = (await response.json()) as ApiCheckoutSession;
  return toApiSession(payload);
}

/**
 * Prices the bag on the server. The returned summary is what the provider
 * session will charge; the client-side cart summary is only an estimate.
 */
export async function getCheckoutQuote(cart: Cart): Promise<CheckoutQuote> {
  const response = await fetch(`${API_BASE}/checkout/quote/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      region: cart.region,
      currency: cart.currency,
      lines: toRequestLines(cart),
    }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Unable to price your bag right now."));
  }

  const payload = (await response.json()) as ApiCheckoutQuote;
  return {
    currency: payload.currency,
    lines: payload.lines.map((line) => ({
      productId: line.product_id,
      variantId: line.variant_id,
      title: line.title,
      variantLabel: line.variant_label,
      quantity: line.quantity,
      unitPrice: line.unit_price,
      lineTotal: line.line_total,
      returnRule: toReturnRule(line.return_policy, line.return_window_days),
    })),
    summary: payload.summary,
  };
}

export async function getCheckoutSession(
  sessionId: string,
  auth?: AccountAuth,
  params?: { transactionId?: string; txRef?: string },
): Promise<CheckoutSession> {
  const url = new URL(`${API_BASE}/checkout/sessions/${sessionId}/`);
  if (params?.transactionId) {
    url.searchParams.set("transaction_id", params.transactionId);
  }
  if (params?.txRef) {
    url.searchParams.set("tx_ref", params.txRef);
  }
  const response = await fetch(url.toString(), {
    method: "GET",
    credentials: "include",
    headers: {
      ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Unable to check payment status right now."));
  }

  const payload = (await response.json()) as ApiCheckoutSession;
  return toApiSession(payload);
}
