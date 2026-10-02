/**
 * Commerce events for GA4 (recommended e-commerce events) and the Meta Pixel (standard
 * events). Each tracker only receives events once its consent category is accepted; events
 * before consent are dropped, not queued. Events carry product IDs, prices, and quantities
 * only; never names, emails, or addresses.
 */

import { readConsent } from "./consent";
import { ensureFbq, ensureGtag } from "./trackers";

export type AnalyticsItem = {
  id: string;
  name: string;
  variant?: string;
  category?: string;
  price: number;
  quantity: number;
};

type Commerce = { currency: string; value: number; items: AnalyticsItem[] };

export type AnalyticsEvent =
  | ({ name: "view_item" } & Commerce)
  | ({ name: "add_to_cart" } & Commerce)
  | ({ name: "begin_checkout" } & Commerce)
  | ({ name: "purchase"; transactionId: string; shipping?: number } & Commerce)
  | { name: "sign_up"; method: "email" }
  | { name: "generate_lead"; source: string };

type Gtag = (...args: unknown[]) => void;
type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    fbq?: Fbq;
  }
}

const META_EVENT_NAMES: Record<AnalyticsEvent["name"], string> = {
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
  sign_up: "CompleteRegistration",
  generate_lead: "Lead",
};

function gaParams(event: AnalyticsEvent): Record<string, unknown> {
  switch (event.name) {
    case "sign_up":
      return { method: event.method };
    case "generate_lead":
      return { lead_source: event.source };
    default:
      return {
        currency: event.currency,
        value: event.value,
        ...(event.name === "purchase"
          ? { transaction_id: event.transactionId, shipping: event.shipping ?? 0 }
          : {}),
        items: event.items.map((item) => ({
          item_id: item.id,
          item_name: item.name,
          item_variant: item.variant,
          item_category: item.category,
          price: item.price,
          quantity: item.quantity,
        })),
      };
  }
}

function metaParams(event: AnalyticsEvent): Record<string, unknown> {
  if (event.name === "sign_up" || event.name === "generate_lead") {
    return {};
  }
  return {
    currency: event.currency,
    value: event.value,
    content_type: "product",
    content_ids: [...new Set(event.items.map((item) => item.id))],
    num_items: event.items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  const consent = readConsent();
  if (!consent) return;

  if (consent.analytics) {
    ensureGtag(consent);
    window.gtag?.("event", event.name, gaParams(event));
  }
  if (consent.marketing) {
    ensureFbq();
    const options = event.name === "purchase" ? { eventID: event.transactionId } : undefined;
    window.fbq?.("track", META_EVENT_NAMES[event.name], metaParams(event), options);
  }
}

const PURCHASE_KEY_PREFIX = "sohe_purchase_tracked:";

/**
 * `purchase` once per order, even if the payment-return page is reloaded or reopened.
 * GA4 also de-duplicates on `transaction_id` and Meta on `eventID`.
 */
export function trackPurchaseOnce(event: Extract<AnalyticsEvent, { name: "purchase" }>) {
  const key = `${PURCHASE_KEY_PREFIX}${event.transactionId}`;
  try {
    if (window.localStorage.getItem(key)) return;
    window.localStorage.setItem(key, new Date().toISOString());
  } catch {
    // Storage blocked: fall back to the trackers' own de-duplication.
  }
  track(event);
}
