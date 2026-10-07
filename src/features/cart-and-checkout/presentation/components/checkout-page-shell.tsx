"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cartLineItem, itemsValue } from "@/core/analytics/items";
import { track } from "@/core/analytics/track";
import type { CheckoutProvider, RegionCode, StoreReturnRules } from "@/core/types/commerce";
import { ReturnNotice } from "@/core/ui/return-notice";
import { describeReturnRule, type ReturnNotice as ReturnNoticeValue } from "@/core/utils/return-rule";
import { useAccountAuth } from "@/features/account-auth/presentation/state/account-auth-provider";
import {
  createCustomerAddress,
  formatAddressLine,
  listCustomerAddresses,
  type CustomerAddress,
} from "@/features/account/data/services/account-addresses";
import { createCheckoutSession } from "@/features/cart-and-checkout/data/services/checkout-sessions";
import { useCart } from "../state/cart-provider";
import { useCheckoutQuote } from "../state/use-checkout-quote";

const providerLabels: Record<CheckoutProvider, { title: string; body: string }> = {
  paypal: {
    title: "PayPal",
    body: "Pay with your PayPal account or a card on PayPal's secure checkout.",
  },
  flutterwave: {
    title: "Flutterwave",
    body: "Pay by card or a local payment method on Flutterwave's secure checkout.",
  },
};

const CHECKOUT_ADDRESS_STORAGE_KEY = "sohe-storefront-checkout-address";

type ShippingAddressState = {
  recipientName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: RegionCode;
};

const emptyShippingAddress: ShippingAddressState = {
  recipientName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  countryCode: "NG",
};

function readStoredCheckoutAddress(): ShippingAddressState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CHECKOUT_ADDRESS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ShippingAddressState>;
    if (!parsed.line1 || !parsed.city || !parsed.state) {
      return null;
    }
    return {
      recipientName: parsed.recipientName ?? "",
      phone: parsed.phone ?? "",
      line1: parsed.line1,
      line2: parsed.line2 ?? "",
      city: parsed.city,
      state: parsed.state,
      postalCode: parsed.postalCode ?? "",
      countryCode: (parsed.countryCode as RegionCode) ?? "NG",
    };
  } catch {
    return null;
  }
}

export function CheckoutPageShell({ returnRules }: { returnRules: StoreReturnRules }) {
  const { cart, isHydrated } = useCart();
  const { isAuthenticated, session } = useAccountAuth();
  // Flutterwave is the only provider the API accepts until PayPal credentials exist (api/PLAN.md Slice 9).
  const [provider, setProvider] = useState<CheckoutProvider>("flutterwave");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<CustomerAddress | null>(null);
  const [saveAddress, setSaveAddress] = useState(true);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressState>(
    () => readStoredCheckoutAddress() ?? emptyShippingAddress,
  );
  const { quote, quoteError, isQuoteReady, summary } = useCheckoutQuote(cart, isHydrated);
  const selectedProvider = providerLabels[provider];
  // Final sale depends on where the order is delivered, so notices follow the chosen country.
  const reviewLines: Array<{
    id: string;
    title: string;
    quantity: number;
    lineTotal: { formatted: string };
    returnNotice?: ReturnNoticeValue;
  }> = quote
    ? quote.lines.map((line) => ({
        id: `${line.productId}:${line.variantId}`,
        title: line.title,
        quantity: line.quantity,
        lineTotal: line.lineTotal,
        returnNotice: describeReturnRule(line.returnRule, returnRules, shippingAddress.countryCode),
      }))
    : cart.lines;

  // `begin_checkout` once per visit to checkout, after the stored bag has loaded.
  const checkoutTracked = useRef(false);
  useEffect(() => {
    if (!isHydrated || checkoutTracked.current || !cart.lines.length) return;
    checkoutTracked.current = true;
    const items = cart.lines.map(cartLineItem);
    track({ name: "begin_checkout", currency: cart.currency, value: itemsValue(items), items });
  }, [isHydrated, cart]);

  useEffect(() => {
    let isActive = true;

    async function hydrateAddress() {
      if (!session?.token || !session.email) {
        if (isActive) {
          setDefaultAddress(null);
        }
        return;
      }

      try {
        const list = await listCustomerAddresses({
          token: session.token,
          email: session.email,
          firstName: session.firstName,
          lastName: session.lastName,
        });
        const found = list.find((address) => address.isDefault) ?? list[0] ?? null;
        if (!isActive) return;
        setDefaultAddress(found);
        if (found) {
          setShippingAddress((current) =>
            current.line1 || current.city || current.state
              ? current
              : {
                  recipientName: found.recipientName,
                  phone: found.phone,
                  line1: found.line1,
                  line2: found.line2,
                  city: found.city,
                  state: found.state,
                  postalCode: found.postalCode,
                  countryCode: found.countryCode,
                },
          );
        }
      } catch {
        if (isActive) setDefaultAddress(null);
      }
    }

    void hydrateAddress();
    return () => {
      isActive = false;
    };
  }, [session]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(CHECKOUT_ADDRESS_STORAGE_KEY, JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  async function handleCheckout() {
    if (!isQuoteReady) {
      setFormError(quoteError ?? "Your bag is still being priced. Try again in a moment.");
      return;
    }
    if (!shippingAddress.recipientName.trim() || !shippingAddress.line1.trim() || !shippingAddress.city.trim() || !shippingAddress.state.trim()) {
      setFormError("Recipient, address line, city, and state are required before checkout.");
      return;
    }
    if ((shippingAddress.countryCode === "US" || shippingAddress.countryCode === "GB") && !shippingAddress.postalCode.trim()) {
      setFormError("Postal code is required for US and GB addresses.");
      return;
    }

    setStatus("submitting");
    setFormError(null);

    if (!session?.token) {
      setFormError("Sign in to continue to live payment checkout.");
      setStatus("idle");
      return;
    }

    if (saveAddress && isAuthenticated && session?.token && session.email) {
      try {
        await createCustomerAddress(
          {
            label: "Checkout Address",
            recipientName: shippingAddress.recipientName,
            phone: shippingAddress.phone,
            line1: shippingAddress.line1,
            line2: shippingAddress.line2,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
            countryCode: shippingAddress.countryCode,
            isDefault: true,
          },
          {
            token: session.token,
            email: session.email,
            firstName: session.firstName,
            lastName: session.lastName,
          },
        );
      } catch (error) {
        setFormError(
          error instanceof Error
            ? `Checkout can continue, but address save failed: ${error.message}`
            : "Checkout can continue, but we could not save this address.",
        );
      }
    }

    try {
      const checkoutSession = await createCheckoutSession(
        cart,
        provider,
        shippingAddress,
        { token: session.token },
      );
      setStatus("success");
      if (checkoutSession.approvalUrl) {
        window.location.assign(checkoutSession.approvalUrl);
      }
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to start checkout right now.",
      );
      setStatus("idle");
    }
  }

  if (!isHydrated) {
    return (
      <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(135deg,rgba(38,34,29,0.98),rgba(10,10,10,0.98))] p-8 shadow-[var(--shadow-gold)]">
        <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-gold-highlight)]">
          Loading Checkout
        </p>
        <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
          Bringing your current bag into checkout.
        </p>
      </section>
    );
  }

  if (!cart.lines.length) {
    return (
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="noise-overlay relative overflow-hidden rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(135deg,rgba(38,34,29,0.98),rgba(10,10,10,0.98))] p-8 shadow-[var(--shadow-gold)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,165,72,0.18),transparent_32%),linear-gradient(160deg,transparent,rgba(255,255,255,0.03)_52%,transparent_70%)]" />
          <div className="relative z-10">
            <div className="inline-flex rounded-full border border-[var(--color-border-strong)] bg-black/30 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-gold-highlight)]">
              Bag Empty
            </div>
            <h2 className="mt-6 font-[family:var(--font-heading)] text-6xl uppercase leading-[0.9] text-[var(--color-text-primary)] md:text-7xl">
              Add a look
              <span className="block text-[var(--color-accent-gold-highlight)]">before you check out.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
              Your bag is empty. Add a piece from the current drop, then come back to pay.
            </p>
            <Link
              href="/bag"
              className="mt-8 inline-flex rounded-full bg-[var(--color-accent-gold)] px-5 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
            >
              Return To Bag
            </Link>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/8 bg-[linear-gradient(160deg,rgba(24,22,20,0.98),rgba(8,8,8,0.98))] p-6 md:p-8">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
            How Checkout Works
          </p>
          <div className="mt-5 space-y-4">
            {[
              {
                title: "1. Build your bag",
                body: "Add pieces from the current drop, then come back here.",
              },
              {
                title: "2. Choose how to pay",
                body: "Pay with PayPal or Flutterwave.",
              },
              {
                title: "3. Pay securely",
                body: "Finish payment on the provider's secure page and come straight back to your confirmed order.",
              },
            ].map((step) => (
              <article
                key={step.title}
                className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5"
              >
                <p className="font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                  {step.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="noise-overlay relative overflow-hidden rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(135deg,rgba(38,34,29,0.98),rgba(10,10,10,0.98))] p-6 shadow-[var(--shadow-gold)] md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,165,72,0.18),transparent_32%),linear-gradient(160deg,transparent,rgba(255,255,255,0.03)_52%,transparent_70%)]" />
        <div className="relative z-10">
          <div className="inline-flex rounded-full border border-[var(--color-border-strong)] bg-black/30 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-gold-highlight)]">
            Secure Checkout
          </div>
          <h2 className="mt-6 font-[family:var(--font-heading)] text-6xl uppercase leading-[0.9] text-[var(--color-text-primary)] md:text-7xl">
            Where it&apos;s going,
            <span className="block text-[var(--color-accent-gold-highlight)]">and how you&apos;ll pay.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
            Confirm your delivery address and choose how to pay. You finish payment on the
            provider&apos;s secure page, then come straight back here.
          </p>
        </div>

        <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <article className="min-w-0 rounded-[1.5rem] border border-white/8 bg-black/25 p-5 backdrop-blur-sm">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Shipping Address
            </p>
            {defaultAddress ? (
              <button
                type="button"
                onClick={() =>
                  setShippingAddress({
                    recipientName: defaultAddress.recipientName,
                    phone: defaultAddress.phone,
                    line1: defaultAddress.line1,
                    line2: defaultAddress.line2,
                    city: defaultAddress.city,
                    state: defaultAddress.state,
                    postalCode: defaultAddress.postalCode,
                    countryCode: defaultAddress.countryCode,
                  })
                }
                className="mt-3 rounded-full border border-[var(--color-border-strong)] px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-gold-highlight)] transition hover:bg-[rgba(214,165,72,0.08)]"
              >
                Use Saved Default Address
              </button>
            ) : null}
            <div className="mt-3 grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={shippingAddress.recipientName}
                  onChange={(event) =>
                    setShippingAddress((current) => ({ ...current, recipientName: event.target.value }))
                  }
                  placeholder="Recipient name"
                  className="h-11 rounded-[0.9rem] border border-white/10 bg-black/20 px-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
                />
                <input
                  value={shippingAddress.phone}
                  onChange={(event) =>
                    setShippingAddress((current) => ({ ...current, phone: event.target.value }))
                  }
                  placeholder="Phone number"
                  className="h-11 rounded-[0.9rem] border border-white/10 bg-black/20 px-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
                />
              </div>
              <input
                value={shippingAddress.line1}
                onChange={(event) => setShippingAddress((current) => ({ ...current, line1: event.target.value }))}
                placeholder="Address line 1"
                className="h-11 rounded-[0.9rem] border border-white/10 bg-black/20 px-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
              />
              <input
                value={shippingAddress.line2}
                onChange={(event) => setShippingAddress((current) => ({ ...current, line2: event.target.value }))}
                placeholder="Address line 2 (optional)"
                className="h-11 rounded-[0.9rem] border border-white/10 bg-black/20 px-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={shippingAddress.city}
                  onChange={(event) => setShippingAddress((current) => ({ ...current, city: event.target.value }))}
                  placeholder="City"
                  className="h-11 rounded-[0.9rem] border border-white/10 bg-black/20 px-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
                />
                <input
                  value={shippingAddress.state}
                  onChange={(event) => setShippingAddress((current) => ({ ...current, state: event.target.value }))}
                  placeholder="State / Province"
                  className="h-11 rounded-[0.9rem] border border-white/10 bg-black/20 px-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={shippingAddress.countryCode}
                  onChange={(event) =>
                    setShippingAddress((current) => ({ ...current, countryCode: event.target.value as RegionCode }))
                  }
                  className="h-11 rounded-[0.9rem] border border-white/10 bg-black/20 px-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
                >
                  <option value="NG">Nigeria</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="EU">European Union</option>
                </select>
                <input
                  value={shippingAddress.postalCode}
                  onChange={(event) => setShippingAddress((current) => ({ ...current, postalCode: event.target.value }))}
                  placeholder="Postal code"
                  className="h-11 rounded-[0.9rem] border border-white/10 bg-black/20 px-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
                />
              </div>
            </div>
          </article>

          <div className="min-w-0 rounded-[1.75rem] border border-[var(--color-border-strong)] bg-[linear-gradient(180deg,rgba(214,165,72,0.12),rgba(0,0,0,0.12))] p-5">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Paying with
            </p>
            <p className="mt-3 min-w-0 text-balance break-words font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)] lg:text-5xl">
              {selectedProvider.title}
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
              {selectedProvider.body}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-4">
              <div className="rounded-full border border-white/10 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)]">
                Secure payment page
              </div>
              <div className="rounded-full border border-white/10 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)]">
                We never see your card
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 rounded-[2rem] border border-[var(--color-border-subtle)] bg-[rgba(8,8,8,0.35)] p-6">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
            Payment Method
          </p>
          <div className="mt-5 grid gap-4">
            {Object.entries(providerLabels).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => setProvider(key as CheckoutProvider)}
                className={`rounded-[1.5rem] border p-5 text-left transition ${
                  provider === key
                    ? "border-[var(--color-border-strong)] bg-[rgba(214,165,72,0.08)]"
                    : "border-white/8 bg-black/20 hover:border-white/20"
                }`}
              >
                <p className="font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                  {value.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                  {value.body}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(160deg,rgba(24,22,20,0.98),rgba(8,8,8,0.98))] p-6">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
            Order Review
          </p>
          <div className="mt-5 rounded-[1.5rem] border border-[var(--color-border-strong)] bg-[rgba(214,165,72,0.08)] p-5">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Checkout total
            </p>
            <p className="mt-3 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
              {summary.total.formatted}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              {quoteError
                ? quoteError
                : quote
                  ? "Confirmed against current prices and stock. This is the amount you will be charged."
                  : "Confirming current prices and stock..."}
            </p>
          </div>
          <div className="mt-5 space-y-3">
            {reviewLines.map((line) => (
              <div
                key={line.id}
                className="rounded-[1rem] border border-white/8 bg-black/20 px-4 py-3 text-sm text-[var(--color-text-secondary)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span>
                    {line.title} x {line.quantity}
                  </span>
                  <span>{line.lineTotal.formatted}</span>
                </div>
                {line.returnNotice ? <ReturnNotice notice={line.returnNotice} className="mt-1" /> : null}
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3 border-t border-white/8 pt-5 text-sm text-[var(--color-text-secondary)]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{summary.subtotal.formatted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>{summary.shipping.formatted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>- {summary.discount.formatted}</span>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-5">
            <span className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
              Total
            </span>
            <span className="font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
              {summary.total.formatted}
            </span>
          </div>
          {defaultAddress ? (
            <p className="mt-4 rounded-[1rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--color-text-secondary)]">
              Default address on file: {formatAddressLine(defaultAddress)}
            </p>
          ) : null}
          <label className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={saveAddress}
              onChange={(event) => setSaveAddress(event.target.checked)}
              disabled={!isAuthenticated}
            />
            Save this shipping address to my account
          </label>
          {!isAuthenticated ? (
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">
              Sign in to save addresses for later checkouts.
            </p>
          ) : null}
          {formError ? <p className="mt-3 text-sm text-[#ff9b8a]">{formError}</p> : null}
          <button
            type="button"
            disabled={status === "submitting" || !isQuoteReady}
            onClick={handleCheckout}
            className="mt-6 w-full rounded-full bg-[var(--color-accent-gold)] px-5 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)] disabled:opacity-60"
          >
            {status === "submitting"
              ? `Connecting to ${selectedProvider.title}...`
              : `Pay with ${selectedProvider.title}`}
          </button>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/bag"
              className="rounded-full border border-white/10 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
            >
              Back To Bag
            </Link>
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
            Payment is taken on the provider&apos;s secure page. Your card details never reach us.
          </p>
        </section>

        {status === "success" ? (
          <section className="rounded-[2rem] border border-[var(--color-border-strong)] bg-[rgba(214,165,72,0.08)] p-6">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
              Redirecting
            </p>
            <h3 className="mt-4 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
              Taking you to secure payment.
            </h3>
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
              You&apos;re being sent to {selectedProvider.title} to pay. If nothing happens in a few
              seconds, try again; your bag is kept until the payment is confirmed.
            </p>
            <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
              Delivering to: {shippingAddress.line1}, {shippingAddress.city}, {shippingAddress.state}.
            </p>
          </section>
        ) : null}
      </aside>
    </div>
  );
}
