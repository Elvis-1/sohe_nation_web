"use client";

import Link from "next/link";
import { useState } from "react";

import { ApiError } from "@/core/api/http-client";
import type { AccountApiAuth, CustomerAccountData } from "../../data/services/get-customer-account";
import { submitReturnRequest } from "../../data/services/get-customer-account";

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  in_review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
};

type Props = {
  account: CustomerAccountData;
  auth?: AccountApiAuth;
  onReturnCreated: () => void;
};

export function ReturnsPageShell({ account, auth, onReturnCreated }: Props) {
  const { returns, profile } = account;
  const orders = profile.orders;
  const eligibleOrders = orders.filter((o) => o.isReturnEligible);
  const orderNumberById = Object.fromEntries(orders.map((o) => [o.id, o.orderNumber]));

  const [orderId, setOrderId] = useState(eligibleOrders[0]?.id ?? "");
  const [itemSummary, setItemSummary] = useState("");
  const [reason, setReason] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!orderId || !itemSummary.trim() || !reason.trim() || eligibleOrders.length === 0) return;

    setSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      await submitReturnRequest(
        {
          order_id: orderId,
          item_summary: itemSummary.trim(),
          reason: reason.trim(),
          customer_note: customerNote.trim() || undefined,
        },
        auth,
      );
      setItemSummary("");
      setReason("");
      setCustomerNote("");
      setSuccessMessage("Return request submitted successfully.");
      onReturnCreated();
    } catch (err) {
      if (err instanceof ApiError && err.code === "duplicate_return_request") {
        setFormError("A return request already exists for this order. Contact support if you need to update it.");
      } else if (err instanceof ApiError && err.code === "order_not_eligible_for_return") {
        setFormError(err.message);
      } else {
        setFormError("Failed to submit. Check your connection and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
      <section className="noise-overlay relative overflow-hidden rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(135deg,rgba(38,34,29,0.98),rgba(10,10,10,0.98))] p-6 shadow-[var(--shadow-gold)] md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,165,72,0.18),transparent_32%),linear-gradient(160deg,transparent,rgba(255,255,255,0.03)_52%,transparent_70%)]" />
        <div className="relative z-10">
          <div className="inline-flex rounded-full border border-[var(--color-border-strong)] bg-black/30 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-gold-highlight)]">
            Return Workspace
          </div>
          <h2 className="mt-6 font-[family:var(--font-heading)] text-6xl uppercase leading-[0.9] text-[var(--color-text-primary)] md:text-7xl">
            Keep the return
            <span className="block text-[var(--color-accent-gold-highlight)]">calm and in motion.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
            Submit a new return against one of your orders, or review the status of a previous request below.
          </p>
        </div>

        <div className="relative z-10 mt-8">
          {returns.length === 0 ? (
            <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
              No return requests yet.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Your returns
              </p>
              {returns.map((ret) => (
                <article
                  key={ret.id}
                  className="rounded-[1.5rem] border border-[var(--color-border-strong)] bg-black/25 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-gold-highlight)]">
                        {orderNumberById[ret.orderId] ?? ret.orderId}
                      </p>
                      <p className="mt-1 font-[family:var(--font-heading)] text-2xl uppercase leading-none text-[var(--color-text-primary)]">
                        {ret.itemSummary}
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                        {ret.reason}
                      </p>
                      <p className="mt-1 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                        {ret.requestedAt}
                      </p>
                    </div>
                    <span className="rounded-full border border-[var(--color-border-strong)] bg-black/30 px-3 py-1 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-gold-highlight)]">
                      {STATUS_LABEL[ret.status] ?? ret.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="relative z-10 mt-8 flex flex-wrap gap-3">
          <Link
            href="/account/orders"
            className="rounded-full border border-white/10 bg-black/25 px-5 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
          >
            Review Orders
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(160deg,rgba(24,22,20,0.98),rgba(8,8,8,0.98))] p-6 md:p-8">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
            New Return Request
          </p>
          <h3 className="mt-3 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
            Submit a return against one of your orders.
          </h3>

          <p className="mt-4 rounded-[1rem] border border-white/10 bg-black/20 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase leading-6 tracking-[0.18em] text-[var(--color-text-muted)]">
            Returns are accepted for delivered orders within 14 days of delivery. Items must be unused and in original condition.
          </p>

          <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Order
              </span>
              {eligibleOrders.length === 0 ? (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {orders.length === 0
                    ? "No orders found."
                    : "None of your orders are currently eligible for a return. Orders must be delivered and within the 14-day return window."}
                </p>
              ) : (
                <select
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  required
                  className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
                >
                  {eligibleOrders.map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.orderNumber} — {order.createdAt}
                    </option>
                  ))}
                </select>
              )}
            </label>

            <label className="grid gap-2">
              <span className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Item summary
              </span>
              <input
                value={itemSummary}
                onChange={(e) => setItemSummary(e.target.value)}
                placeholder="e.g. SN Command Jacket, size M"
                required
                className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Return reason
              </span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe why you are returning this item."
                required
                className="min-h-24 rounded-[1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Additional note (optional)
              </span>
              <textarea
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Any extra context for the team."
                className="min-h-20 rounded-[1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
              />
            </label>

            {formError ? (
              <p className="text-sm text-red-400">{formError}</p>
            ) : null}

            {successMessage ? (
              <p className="text-sm text-[var(--color-accent-gold-highlight)]">{successMessage}</p>
            ) : null}

            <button
              type="submit"
              disabled={submitting || eligibleOrders.length === 0}
              className="rounded-full bg-[var(--color-accent-gold)] px-5 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)] disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit Return Request"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
