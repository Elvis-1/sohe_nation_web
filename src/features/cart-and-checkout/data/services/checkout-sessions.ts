import type { Cart, CheckoutProvider, CheckoutSession } from "@/core/types/commerce";
import { resolveApiBaseUrl } from "@/core/api/resolve-api-base-url";

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
  };
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
      summary_total: {
        amount: cart.summary.total.amount,
        currency: cart.summary.total.currency,
      },
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
      lines: cart.lines.map((line) => ({
        product_id: line.productId,
        variant_id: line.variantId,
        title: line.title,
        variant_label: line.variantLabel,
        quantity: line.quantity,
        unit_price: {
          amount: line.unitPrice.amount,
          currency: line.unitPrice.currency,
        },
      })),
    }),
  });

  if (!response.ok) {
    throw new Error(await parseError(response, "Unable to start checkout right now."));
  }

  const payload = (await response.json()) as ApiCheckoutSession;
  return toApiSession(payload);
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
