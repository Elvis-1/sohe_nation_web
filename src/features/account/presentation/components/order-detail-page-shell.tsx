import Link from "next/link";

import type { CustomerOrderDetail } from "../../data/services/get-customer-account";

type OrderDetailPageShellProps = {
  order: CustomerOrderDetail;
};

export function OrderDetailPageShell({ order }: OrderDetailPageShellProps) {
  const statusLabel =
    order.status === "fulfilled"
      ? "Delivered and closed"
      : order.status === "paid"
        ? "Confirmed and in progress"
        : order.status === "pending"
          ? "Awaiting payment confirmation"
          : "Cancelled";

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="noise-overlay relative overflow-hidden rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(135deg,rgba(38,34,29,0.98),rgba(10,10,10,0.98))] p-6 shadow-[var(--shadow-gold)] md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,165,72,0.18),transparent_32%),linear-gradient(160deg,transparent,rgba(255,255,255,0.03)_52%,transparent_70%)]" />
        <div className="relative z-10">
          <div className="inline-flex rounded-full border border-[var(--color-border-strong)] bg-black/30 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-gold-highlight)]">
            Order Detail
          </div>
          <h2 className="mt-6 break-words font-[family:var(--font-heading)] text-5xl uppercase leading-[0.92] text-[var(--color-text-primary)] md:text-6xl">
            {order.orderNumber}
          </h2>
          <p className="mt-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Placed {order.createdAt}
          </p>
          <div className="mt-6 inline-flex rounded-full border border-white/10 bg-black/30 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent-gold-highlight)]">
            {statusLabel}
          </div>
        </div>

        <div className="relative z-10 mt-8 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Shipping Address
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
            {order.shippingAddress}
          </p>
        </div>

        <div className="relative z-10 mt-6 flex flex-wrap gap-3">
          <Link
            href="/account/orders"
            className="rounded-full border border-white/10 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
          >
            Back To Orders
          </Link>
          <Link
            href="/account/returns"
            className="rounded-full bg-[var(--color-accent-gold)] px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
          >
            Start Return
          </Link>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/8 bg-[linear-gradient(160deg,rgba(24,22,20,0.98),rgba(8,8,8,0.98))] p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
              Line Items
            </p>
            <h3 className="mt-3 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
              What moved in this order.
            </h3>
          </div>
          <p className="font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
            {order.total.formatted}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {order.lines.length > 0 ? (
            order.lines.map((line) => (
              <article
                key={line.id}
                className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="break-words font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                      {line.title}
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{line.variantLabel}</p>
                  </div>
                  <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                    Qty {line.quantity}
                  </p>
                </div>
                <div className="mt-4 border-t border-white/8 pt-4">
                  <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.22em] text-[var(--color-text-primary)]">
                    {line.unitPrice.formatted}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <article className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
              <p className="font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                No line details yet.
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                This order was staged in fixture mode. Line items will appear once full order detail
                sync is available for this entry.
              </p>
            </article>
          )}
        </div>
      </section>
    </div>
  );
}
