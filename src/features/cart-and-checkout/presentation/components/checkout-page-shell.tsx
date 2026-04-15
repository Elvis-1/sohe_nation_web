"use client";

import Link from "next/link";
import { useState } from "react";

import type { CheckoutProvider } from "@/core/types/commerce";
import { useAccountAuth } from "@/features/account-auth/presentation/state/account-auth-provider";
import { persistMockCheckoutOrder } from "@/features/account/data/services/get-customer-account";

import { createMockCheckoutSession } from "../../data/repositories/mock-cart-repository";
import { useCart } from "../state/cart-provider";

const providerLabels: Record<CheckoutProvider, { title: string; body: string }> = {
  paypal: {
    title: "PayPal Hosted Flow",
    body: "Use the global wallet route for faster approval and cross-border readiness.",
  },
  flutterwave: {
    title: "Flutterwave Hosted Flow",
    body: "Use the Africa-first hosted checkout for regional convenience and local rails.",
  },
};

export function CheckoutPageShell() {
  const { cart, clearCart } = useCart();
  const { isAuthenticated } = useAccountAuth();
  const [provider, setProvider] = useState<CheckoutProvider>("paypal");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [sessionId, setSessionId] = useState("");
  const selectedProvider = providerLabels[provider];

  async function handleCheckout() {
    setStatus("submitting");
    const session = await createMockCheckoutSession(cart, provider);

    persistMockCheckoutOrder({
      id: `ord_${session.id}`,
      orderNumber: `SN-${session.id.slice(-4).toUpperCase()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      status: "paid",
      total: cart.summary.total,
    });

    setSessionId(session.id);
    setStatus("success");
  }

  if (!cart.lines.length) {
    return (
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="noise-overlay relative overflow-hidden rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(135deg,rgba(38,34,29,0.98),rgba(10,10,10,0.98))] p-8 shadow-[var(--shadow-gold)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,165,72,0.18),transparent_32%),linear-gradient(160deg,transparent,rgba(255,255,255,0.03)_52%,transparent_70%)]" />
          <div className="relative z-10">
            <div className="inline-flex rounded-full border border-[var(--color-border-strong)] bg-black/30 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-gold-highlight)]">
              Checkout Waiting
            </div>
            <h2 className="mt-6 font-[family:var(--font-heading)] text-6xl uppercase leading-[0.9] text-[var(--color-text-primary)] md:text-7xl">
              Add a look
              <span className="block text-[var(--color-accent-gold-highlight)]">before routing payment.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
              The hosted checkout flow expects an active bag so it can generate a provider session,
              preserve the order review, and hand the customer forward with confidence.
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
            Hosted Flow
          </p>
          <div className="mt-5 space-y-4">
            {[
              {
                title: "1. Stage the bag",
                body: "Bring the current line forward from bag so checkout can hold the right order review.",
              },
              {
                title: "2. Pick the provider",
                body: "Choose PayPal or Flutterwave based on the handoff that best fits the customer.",
              },
              {
                title: "3. Create the session",
                body: "Simulate the hosted redirect flow before the real payment integration arrives.",
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
            Hosted Checkout
          </div>
          <h2 className="mt-6 font-[family:var(--font-heading)] text-6xl uppercase leading-[0.9] text-[var(--color-text-primary)] md:text-7xl">
            Choose the handoff,
            <span className="block text-[var(--color-accent-gold-highlight)]">then route the order forward.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
            This checkout flow is shaped around the hosted provider transition, so contact, delivery,
            and payment selection stay readable and trustworthy before the redirect moment.
          </p>
        </div>

        <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="min-w-0 space-y-4">
            <article className="min-w-0 rounded-[1.5rem] border border-white/8 bg-black/25 p-5 backdrop-blur-sm">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Contact
              </p>
              <p className="mt-3 min-w-0 break-words font-[family:var(--font-heading)] text-2xl uppercase leading-none text-[var(--color-text-primary)] lg:text-3xl">
                sohe.customer@fixture.test
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                +234 800 000 0000
              </p>
            </article>
            <article className="min-w-0 rounded-[1.5rem] border border-white/8 bg-black/25 p-5 backdrop-blur-sm">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Delivery
              </p>
              <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                Lekki Phase 1
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                Standard dispatch in 3-5 days.
              </p>
            </article>
          </div>

          <div className="min-w-0 rounded-[1.75rem] border border-[var(--color-border-strong)] bg-[linear-gradient(180deg,rgba(214,165,72,0.12),rgba(0,0,0,0.12))] p-5">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Selected provider
            </p>
            <p className="mt-3 min-w-0 text-balance break-words font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)] lg:text-5xl">
              {selectedProvider.title}
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
              {selectedProvider.body}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-4">
              <div className="rounded-full border border-white/10 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)]">
                Hosted redirect
              </div>
              <div className="rounded-full border border-white/10 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)]">
                Session-based flow
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 rounded-[2rem] border border-[var(--color-border-subtle)] bg-[rgba(8,8,8,0.35)] p-6">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
            Payment Provider
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
              {cart.summary.total.formatted}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              This is the fixture-mode handoff total that will be carried into the hosted provider session.
            </p>
          </div>
          <div className="mt-5 space-y-3">
            {cart.lines.map((line) => (
              <div
                key={line.id}
                className="flex items-center justify-between rounded-[1rem] border border-white/8 bg-black/20 px-4 py-3 text-sm text-[var(--color-text-secondary)]"
              >
                <span>
                  {line.title} x {line.quantity}
                </span>
                <span>{line.lineTotal.formatted}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3 border-t border-white/8 pt-5 text-sm text-[var(--color-text-secondary)]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{cart.summary.subtotal.formatted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>{cart.summary.shipping.formatted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Discount</span>
              <span>- {cart.summary.discount.formatted}</span>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-5">
            <span className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
              Total
            </span>
            <span className="font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
              {cart.summary.total.formatted}
            </span>
          </div>
          <button
            type="button"
            disabled={status === "submitting"}
            onClick={handleCheckout}
            className="mt-6 w-full rounded-full bg-[var(--color-accent-gold)] px-5 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)] disabled:opacity-60"
          >
            {status === "submitting" ? "Creating Session..." : `Create ${provider} Session`}
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
            This fixture flow simulates the redirect-based provider handoff planned for PayPal and
            Flutterwave without touching live payment APIs yet.
          </p>
        </section>

        {status === "success" ? (
          <section className="rounded-[2rem] border border-[var(--color-border-strong)] bg-[rgba(214,165,72,0.08)] p-6">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
              Session Ready
            </p>
            <h3 className="mt-4 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
              Hosted handoff prepared.
            </h3>
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
              Session <span className="text-[var(--color-text-primary)]">{sessionId}</span> is ready
              for redirect handling through {selectedProvider.title}. In Phase 5 this panel can
              yield to real provider return states and order reconciliation.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={clearCart}
                className="rounded-full border border-white/10 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
              >
                Clear Mock Bag
              </button>
              <Link
                href={isAuthenticated ? "/account/orders" : "/account"}
                className="rounded-full bg-[var(--color-accent-gold)] px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
              >
                {isAuthenticated ? "Review Orders Surface" : "Open Account Access"}
              </Link>
            </div>
          </section>
        ) : null}
      </aside>
    </div>
  );
}
