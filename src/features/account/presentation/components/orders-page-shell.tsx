import Link from "next/link";

import type { CustomerAccountData } from "../../data/services/get-customer-account";

export function OrdersPageShell({ account }: { account: CustomerAccountData }) {
  const latestOrder = account.profile.orders[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="noise-overlay relative overflow-hidden rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(135deg,rgba(38,34,29,0.98),rgba(10,10,10,0.98))] p-6 shadow-[var(--shadow-gold)] md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,165,72,0.18),transparent_32%),linear-gradient(160deg,transparent,rgba(255,255,255,0.03)_52%,transparent_70%)]" />
        <div className="relative z-10">
          <div className="inline-flex rounded-full border border-[var(--color-border-strong)] bg-black/30 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-gold-highlight)]">
            Order Command
          </div>
          <h2 className="mt-6 font-[family:var(--font-heading)] text-6xl uppercase leading-[0.9] text-[var(--color-text-primary)] md:text-7xl">
            Every movement,
            <span className="block text-[var(--color-accent-gold-highlight)]">kept on your line.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
            Review the newest delivery first, then move through your recent order history with
            faster status scanning and clearer next actions.
          </p>
        </div>

        <div className="relative z-10 mt-8 rounded-[1.75rem] border border-[var(--color-border-strong)] bg-[linear-gradient(180deg,rgba(214,165,72,0.12),rgba(0,0,0,0.12))] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Latest order
              </p>
              <p className="mt-3 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
                {latestOrder?.orderNumber ?? "No orders"}
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent-gold-highlight)]">
              {latestOrder?.status === "fulfilled"
                ? "Delivered"
                : latestOrder?.status === "paid"
                  ? "In progress"
                  : latestOrder?.status ?? "No status"}
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Total
              </p>
              <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                {latestOrder?.total.formatted ?? "NGN 0"}
              </p>
            </article>
            <article className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Placed
              </p>
              <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                {latestOrder?.createdAt ?? "No date"}
              </p>
            </article>
            <article className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Next move
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                {latestOrder?.status === "fulfilled"
                  ? "Order is complete. Keep the line moving or begin a return."
                  : "Order is active. Track delivery progress from the customer desk."}
              </p>
            </article>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-4">
            <Link
              href="/account"
              className="rounded-full bg-[var(--color-accent-gold)] px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
            >
              Return To Account
            </Link>
            <Link
              href="/account/returns"
              className="rounded-full border border-white/10 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
            >
              Open Return Options
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {account.profile.orders.map((order) => (
          <article
            key={order.id}
            className="rounded-[1.75rem] border border-white/8 bg-[linear-gradient(160deg,rgba(24,22,20,0.98),rgba(8,8,8,0.98))] p-5 transition hover:border-[var(--color-border-strong)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                  Order number
                </p>
                <p className="mt-3 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
                  {order.orderNumber}
                </p>
              </div>
              <div
                className={`rounded-full border px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] ${
                  order.status === "fulfilled"
                    ? "border-[rgba(12,188,50,0.45)] text-[var(--color-success)]"
                    : order.status === "paid"
                      ? "border-[rgba(214,165,72,0.35)] text-[var(--color-accent-gold-highlight)]"
                      : "border-white/10 text-[var(--color-text-secondary)]"
                }`}
              >
                {order.status === "fulfilled"
                  ? "Delivered and closed"
                  : order.status === "paid"
                    ? "Confirmed and in progress"
                    : order.status}
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <article className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
                <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  Placed
                </p>
                <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                  {order.createdAt}
                </p>
              </article>
              <article className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
                <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  Order total
                </p>
                <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                  {order.total.formatted}
                </p>
              </article>
              <article className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
                <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  Next step
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                  {order.status === "fulfilled"
                    ? "Reorder, review, or open a return request."
                    : "Stay with this order while the next delivery update lands."}
                </p>
              </article>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 border-t border-white/8 pt-4">
              <Link
                href="/account"
                className="rounded-full border border-white/10 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
              >
                Back To Account
              </Link>
              <Link
                href="/account/returns"
                className="rounded-full bg-[var(--color-accent-gold)] px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
              >
                Start Return
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
