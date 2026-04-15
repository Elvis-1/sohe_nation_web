"use client";

import Link from "next/link";

import { useAccountAuth } from "@/features/account-auth/presentation/state/account-auth-provider";

import type { CustomerAccountData } from "../../data/services/get-customer-account";

export function AccountOverviewShell({ account }: { account: CustomerAccountData }) {
  const { session, signOut } = useAccountAuth();
  const latestOrder = account.profile.orders[0];
  const submittedReturn = account.draftReturn.status === "submitted";
  const latestOrderLabel =
    latestOrder?.status === "fulfilled"
      ? "Delivered to your line"
      : latestOrder?.status === "paid"
        ? "Confirmed and moving"
        : "Awaiting the next move";

  const statusTone =
    latestOrder?.status === "fulfilled"
      ? "text-[var(--color-success)]"
      : latestOrder?.status === "paid"
        ? "text-[var(--color-accent-gold-highlight)]"
        : "text-[var(--color-text-secondary)]";

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="noise-overlay relative overflow-hidden rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(135deg,rgba(38,34,29,0.98),rgba(10,10,10,0.98))] p-6 shadow-[var(--shadow-gold)] md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,165,72,0.18),transparent_32%),linear-gradient(160deg,transparent,rgba(255,255,255,0.03)_52%,transparent_70%)]" />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="relative z-10">
            <div className="inline-flex rounded-full border border-[var(--color-border-strong)] bg-black/30 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-gold-highlight)]">
              Campaign Access
            </div>
            <p className="mt-6 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
              Signed in as {session?.email ?? account.profile.email}
            </p>
            <h2 className="mt-4 max-w-3xl font-[family:var(--font-heading)] text-6xl uppercase leading-[0.9] text-[var(--color-text-primary)] md:text-7xl">
              Welcome back,
              <span className="block text-[var(--color-accent-gold-highlight)]">
                {session?.firstName ?? account.profile.firstName}.
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="relative z-10 rounded-full border border-white/10 bg-black/20 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
          >
            Sign Out
          </button>
        </div>

        <p className="relative z-10 mt-6 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
          Track the newest delivery, keep your return request moving, and step straight back into
          the next chapter of the drop without losing the campaign rhythm.
        </p>

        <div className="relative z-10 mt-8 flex flex-wrap gap-3">
          <Link
            href="/account/orders"
            className="rounded-full bg-[var(--color-accent-gold)] px-5 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
          >
            Track Latest Order
          </Link>
          <Link
            href="/account/returns"
            className="rounded-full border border-white/10 bg-black/25 px-5 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
          >
            Continue Return Draft
          </Link>
        </div>

        <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-[1.25fr_0.85fr_0.9fr]">
          <article className="rounded-[1.75rem] border border-[var(--color-border-strong)] bg-[linear-gradient(180deg,rgba(214,165,72,0.12),rgba(0,0,0,0.12))] p-5 backdrop-blur-sm">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Latest order
            </p>
            <p className="mt-3 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
              {latestOrder?.orderNumber ?? "No orders"}
            </p>
            <p className={`mt-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] ${statusTone}`}>
              {latestOrderLabel}
            </p>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-4">
              <div>
                <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  Order total
                </p>
                <p className="mt-2 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                  {latestOrder?.total.formatted ?? "NGN 0"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  Placed
                </p>
                <p className="mt-2 font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.22em] text-[var(--color-text-primary)]">
                  {latestOrder?.createdAt ?? "No date"}
                </p>
              </div>
            </div>
          </article>
          <article className="rounded-[1.5rem] border border-white/8 bg-black/25 p-5 backdrop-blur-sm">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Account tier
            </p>
            <p className="mt-3 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
              {account.membershipTier}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              First look at selected releases and a faster route back into active customer updates.
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-white/8 bg-black/25 p-5 backdrop-blur-sm">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Return status
            </p>
            <p className="mt-3 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
              {submittedReturn ? "Submitted" : "Draft Open"}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              {submittedReturn
                ? "Your request is already logged and ready for the next update."
                : "Your return draft is open and ready for review before submission."}
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(160deg,rgba(24,22,20,0.98),rgba(8,8,8,0.98))] p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
                Profile Details
              </p>
              <h3 className="mt-3 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
                Ready for every next move.
              </h3>
            </div>
            <div className="rounded-full border border-white/10 bg-black/25 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
              Primary market {account.profile.defaultRegion}
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Preferred store
              </p>
              <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                {account.preferredStore}
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Default address
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                {account.savedAddress}
              </p>
            </article>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(160deg,rgba(24,22,20,0.98),rgba(8,8,8,0.98))] p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
                Recent Orders
              </p>
              <h3 className="mt-3 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
                The latest movement in your line.
              </h3>
            </div>
            <Link
              href="/account/orders"
              className="rounded-full border border-white/10 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
            >
              View All Orders
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {account.profile.orders.slice(0, 2).map((order) => (
              <article
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-white/8 bg-black/20 px-5 py-5 transition hover:border-[var(--color-border-strong)]"
              >
                <div>
                  <p className="font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                    {order.orderNumber}
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    Placed {order.createdAt}
                  </p>
                  <p
                    className={`mt-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] ${
                      order.status === "fulfilled"
                        ? "text-[var(--color-success)]"
                        : order.status === "paid"
                          ? "text-[var(--color-accent-gold-highlight)]"
                          : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {order.status === "fulfilled"
                      ? "Delivered and closed"
                      : order.status === "paid"
                        ? "Confirmed and in progress"
                        : order.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.22em] text-[var(--color-text-primary)]">
                    {order.total.formatted}
                  </p>
                  <Link
                    href="/account/orders"
                    className="mt-3 inline-flex rounded-full border border-white/10 px-3 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
                  >
                    View Detail
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(160deg,rgba(24,22,20,0.98),rgba(8,8,8,0.98))] p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
                Returns
              </p>
              <h3 className="mt-3 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
                Keep the return conversation moving.
              </h3>
            </div>
            <Link
              href="/account/returns"
              className="rounded-full border border-white/10 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
            >
              Open Returns Form
            </Link>
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                  {account.draftReturn.itemTitle}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                  Return tied to {account.draftReturn.orderNumber}. Reason: {account.draftReturn.reason}
                </p>
              </div>
              <div className="rounded-full border border-white/10 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent-gold-highlight)]">
                {submittedReturn ? "Submitted" : "Draft"}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 border-t border-white/8 pt-4">
              <Link
                href="/account/returns"
                className="rounded-full bg-[var(--color-accent-gold)] px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
              >
                {submittedReturn ? "Review Return Request" : "Continue Return Request"}
              </Link>
              <p className="self-center text-sm text-[var(--color-text-secondary)]">
                {submittedReturn
                  ? "Next step: wait for the next account update."
                  : "Next step: review the draft and submit when ready."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
