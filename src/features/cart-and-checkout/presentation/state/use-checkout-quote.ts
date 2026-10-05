"use client";

import { useEffect, useState } from "react";

import type { Cart, CartSummary, Money } from "@/core/types/commerce";
import {
  getCheckoutQuote,
  type CheckoutQuote,
} from "@/features/cart-and-checkout/data/services/checkout-sessions";

type QuoteResult = {
  cart: Cart;
  quote: CheckoutQuote | null;
  error: string | null;
};

export type CheckoutQuoteState = {
  quote: CheckoutQuote | null;
  quoteError: string | null;
  isQuoteReady: boolean;
  /** Server summary once priced; the client estimate until then. */
  summary: CartSummary;
  /** Server-priced line money keyed by variant id, when available. */
  priceForVariant: (variantId: string) => { unitPrice: Money; lineTotal: Money } | null;
};

/**
 * Prices the bag on the server whenever it changes. The server quote is the
 * amount checkout will charge; the cart's own summary is only a client estimate.
 */
export function useCheckoutQuote(cart: Cart, isHydrated: boolean): CheckoutQuoteState {
  // Keyed to the cart it priced so a changed bag reads as "pricing" until the new quote lands.
  const [result, setResult] = useState<QuoteResult | null>(null);

  useEffect(() => {
    if (!isHydrated || !cart.lines.length) {
      return;
    }

    let isActive = true;
    getCheckoutQuote(cart)
      .then((quote) => {
        if (isActive) setResult({ cart, quote, error: null });
      })
      .catch((error) => {
        if (isActive) {
          setResult({
            cart,
            quote: null,
            error: error instanceof Error ? error.message : "Unable to price your bag right now.",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [cart, isHydrated]);

  const current = result?.cart === cart ? result : null;
  const quote = current?.quote ?? null;
  const quoteError = current?.error ?? null;

  return {
    quote,
    quoteError,
    isQuoteReady: quote !== null && quoteError === null,
    summary: quote?.summary ?? cart.summary,
    priceForVariant: (variantId) => {
      const line = quote?.lines.find((candidate) => candidate.variantId === variantId);
      return line ? { unitPrice: line.unitPrice, lineTotal: line.lineTotal } : null;
    },
  };
}
