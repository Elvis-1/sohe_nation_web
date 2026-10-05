"use client";

import Link from "next/link";
import { useCart } from "../state/cart-provider";
import { useCheckoutQuote } from "../state/use-checkout-quote";
import { useRecommendedProducts } from "../state/use-recommended-products";

function renderMoneyValue(formatted: string) {
  const [currency, ...amountParts] = formatted.split(" ");
  const amount = amountParts.join(" ");

  return (
    <span className="block min-w-0">
      <span className="block font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        {currency}
      </span>
      <span className="mt-2 block min-w-0 break-words font-[family:var(--font-heading)] text-3xl leading-none text-[var(--color-text-primary)] xl:text-4xl">
        {amount}
      </span>
    </span>
  );
}

export function CartPageShell() {
  const { cart, itemCount, isHydrated, updateQuantity, removeItem } = useCart();
  const { quote, quoteError, summary, priceForVariant } = useCheckoutQuote(cart, isHydrated);
  const largestLine = cart.lines[0];
  const recommendedProducts = useRecommendedProducts(cart.lines.map((line) => line.productId));

  if (!isHydrated) {
    return (
      <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(135deg,rgba(38,34,29,0.98),rgba(10,10,10,0.98))] p-8 shadow-[var(--shadow-gold)]">
        <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-gold-highlight)]">
          Loading Bag
        </p>
        <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
          Getting your bag ready.
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
              The next look
              <span className="block text-[var(--color-accent-gold-highlight)]">has not landed here yet.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
              Add a piece from the current drop and it will wait here until you are ready to check
              out.
            </p>
            <Link
              href="/products"
              className="mt-8 inline-flex rounded-full bg-[var(--color-accent-gold)] px-5 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
            >
              Explore The Drop
            </Link>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/8 bg-[linear-gradient(160deg,rgba(24,22,20,0.98),rgba(8,8,8,0.98))] p-6 md:p-8">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
            Start Here
          </p>
          <div className="mt-5 space-y-4">
            {[
              {
                title: "1. Build the look",
                body: "Pick the pieces that set the tone for your uniform.",
              },
              {
                title: "2. Choose your size",
                body: "Check the size and quantity of each piece before you pay.",
              },
              {
                title: "3. Check out",
                body: "Pay securely with PayPal or Flutterwave.",
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
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex rounded-full border border-[var(--color-border-strong)] bg-black/30 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-gold-highlight)]">
              Bag Review
            </div>
            <h2 className="mt-6 font-[family:var(--font-heading)] text-6xl uppercase leading-[0.9] text-[var(--color-text-primary)] md:text-7xl">
              {itemCount} item{itemCount === 1 ? "" : "s"}
              <span className="block text-[var(--color-accent-gold-highlight)]">held in formation.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
              Check sizes and quantities, see your totals, and check out when you&apos;re ready.
            </p>
          </div>
          <Link
            href="/checkout"
            className="rounded-full bg-[var(--color-accent-gold)] px-5 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
          >
            Continue To Checkout
          </Link>
        </div>

        <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-[1.15fr_0.85fr_0.85fr]">
          <article className="flex h-full flex-col rounded-[1.75rem] border border-[var(--color-border-strong)] bg-[linear-gradient(180deg,rgba(214,165,72,0.12),rgba(0,0,0,0.12))] p-5">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Lead piece
            </p>
            <p className="mt-3 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
              {largestLine?.title ?? "No line"}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              {largestLine?.variantLabel ?? "No variant selected"} ready for checkout.
            </p>
          </article>
          <article className="flex h-full min-w-0 flex-col rounded-[1.5rem] border border-white/8 bg-black/25 p-5 backdrop-blur-sm">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Subtotal
            </p>
            <div className="mt-auto pt-3">{renderMoneyValue(summary.subtotal.formatted)}</div>
          </article>
          <article className="flex h-full min-w-0 flex-col rounded-[1.5rem] border border-white/8 bg-black/25 p-5 backdrop-blur-sm">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Order total
            </p>
            <div className="mt-auto pt-3">{renderMoneyValue(summary.total.formatted)}</div>
          </article>
        </div>

        <div className="relative z-10 mt-8 space-y-4">
          {cart.lines.map((line) => {
            const serverPrice = priceForVariant(line.variantId);
            return (
              <article
                key={line.id}
                className="rounded-[1.75rem] border border-white/8 bg-black/20 p-5 transition hover:border-[var(--color-border-strong)]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                      {line.variantLabel}
                    </p>
                    <h3 className="mt-2 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                      {line.title}
                    </h3>
                    <p className="mt-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                      Unit price {(serverPrice?.unitPrice ?? line.unitPrice).formatted}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                      Line total
                    </p>
                    <p className="mt-2 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                      {(serverPrice?.lineTotal ?? line.lineTotal).formatted}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
                  <label className="flex items-center gap-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
                    Quantity
                    <select
                      value={line.quantity}
                      onChange={(event) => updateQuantity(line.variantId, Number(event.target.value))}
                      className="h-11 rounded-full border border-white/10 bg-black/30 px-4 text-xs text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
                    >
                      {[1, 2, 3, 4].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(line.variantId)}
                    className="rounded-full border border-white/10 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <aside className="space-y-6">
        <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(160deg,rgba(24,22,20,0.98),rgba(8,8,8,0.98))] p-6">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
            Order Summary
          </p>
          <div className="mt-6 space-y-4 text-sm text-[var(--color-text-secondary)]">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{summary.subtotal.formatted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>{summary.shipping.formatted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Drop discount</span>
              <span>- {summary.discount.formatted}</span>
            </div>
          </div>
          <div className="mt-5 border-t border-white/8 pt-5">
            <div className="flex items-center justify-between">
              <span className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                Total
              </span>
              <span className="font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
                {summary.total.formatted}
              </span>
            </div>
            {quoteError ? (
              <p className="mt-3 text-sm leading-7 text-[#ff9b8a]">{quoteError}</p>
            ) : (
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                {quote
                  ? "Confirmed against current prices and stock."
                  : "Confirming current prices and stock..."}
              </p>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/checkout"
              className="rounded-full bg-[var(--color-accent-gold)] px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
            >
              Move To Checkout
            </Link>
            <Link
              href="/products"
              className="rounded-full border border-white/10 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
            >
              Keep Shopping
            </Link>
          </div>
        </section>

        {recommendedProducts.length > 0 ? (
          <section className="rounded-[2rem] border border-white/8 bg-black/20 p-6">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
              Keep Building The Look
            </p>
            <div className="mt-5 space-y-4">
              {recommendedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="block rounded-[1.25rem] border border-white/8 bg-black/25 p-4 transition hover:border-[var(--color-border-strong)]"
                >
                  <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                    {product.subtitle}
                  </p>
                  <p className="mt-2 font-[family:var(--font-heading)] text-2xl uppercase leading-none text-[var(--color-text-primary)]">
                    {product.title}
                  </p>
                  <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                    {product.priceRange.min.formatted}
                  </p>
                  <p className="mt-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                    Open product and stage the next piece
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </aside>
    </div>
  );
}
