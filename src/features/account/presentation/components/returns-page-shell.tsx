"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { AccountApiAuth, CustomerAccountData, CustomerOrderDetail, CustomerOrderLine, ReturnReasonCode } from "../../data/services/get-customer-account";
import {
  RETURN_REASONS,
  ReturnRequestError,
  getCustomerOrderDetail,
  submitReturnRequest,
} from "../../data/services/get-customer-account";

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
  /** Preselects this order when it has returnable items (from order detail "Start Return"). */
  initialOrderId?: string;
  onReturnCreated: () => void;
};

type LineChoice = { selected: boolean; quantity: number; reason: ReturnReasonCode | "" };

/** The order being returned from, keyed by what was loaded so a changed order reads as loading. */
type LoadedOrder = { key: string; order: CustomerOrderDetail | null; failed: boolean };

const fieldClass =
  "h-11 rounded-[0.9rem] border border-white/10 bg-black/25 px-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)] disabled:opacity-60";
const labelClass =
  "font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]";

export function ReturnsPageShell({ account, auth, initialOrderId, onReturnCreated }: Props) {
  const { returns, profile, returnRules } = account;
  const orders = profile.orders;
  const returnableOrders = orders.filter((o) => o.isReturnEligible || o.canReportFaulty);
  const orderNumberById = Object.fromEntries(orders.map((o) => [o.id, o.orderNumber]));

  const [chosenOrderId, setChosenOrderId] = useState(initialOrderId ?? "");
  const orderId = returnableOrders.some((o) => o.id === chosenOrderId)
    ? chosenOrderId
    : (returnableOrders[0]?.id ?? "");
  const [reloadKey, setReloadKey] = useState(0);
  const [loaded, setLoaded] = useState<LoadedOrder | null>(null);
  const [choices, setChoices] = useState<Record<string, LineChoice>>({});
  const [customerNote, setCustomerNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [lineErrors, setLineErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const token = auth?.token;
  const loadKey = `${orderId}:${reloadKey}`;
  useEffect(() => {
    if (!orderId) return;
    let isActive = true;
    getCustomerOrderDetail(orderId, auth)
      .then((order) => {
        if (isActive) setLoaded({ key: loadKey, order, failed: order === null });
      })
      .catch(() => {
        if (isActive) setLoaded({ key: loadKey, order: null, failed: true });
      });
    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadKey, orderId, token]);

  const current = loaded?.key === loadKey ? loaded : null;
  const lines = current?.order?.lines ?? [];
  const selectedLines = lines.filter((line) => choices[line.id]?.selected);
  const canSubmit =
    selectedLines.length > 0 && selectedLines.every((line) => choices[line.id]?.reason) && !submitting;

  function updateChoice(line: CustomerOrderLine, patch: Partial<LineChoice>) {
    setChoices((all) => {
      const faultyOnly = line.returnEligibility?.faultyOnly ?? false;
      const existing = all[line.id] ?? { selected: false, quantity: 1, reason: faultyOnly ? "faulty" : "" };
      return { ...all, [line.id]: { ...existing, ...patch } };
    });
  }

  function chooseOrder(nextOrderId: string) {
    setChosenOrderId(nextOrderId);
    setChoices({});
    setLineErrors({});
    setFormError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!orderId || !canSubmit) return;

    setSubmitting(true);
    setFormError(null);
    setLineErrors({});
    setSuccessMessage(null);

    try {
      await submitReturnRequest(
        {
          order_id: orderId,
          lines: selectedLines.map((line) => ({
            order_line_id: line.id,
            quantity: choices[line.id].quantity,
            reason_code: choices[line.id].reason as ReturnReasonCode,
          })),
          customer_note: customerNote.trim() || undefined,
        },
        auth,
      );
      setChoices({});
      setCustomerNote("");
      setSuccessMessage("Return request submitted. We'll email you once it has been reviewed.");
      setReloadKey((key) => key + 1);
      onReturnCreated();
    } catch (err) {
      if (err instanceof ReturnRequestError && err.code === "return_line_not_eligible") {
        setLineErrors(err.lineErrors);
        setFormError("Some items can't be returned as chosen. See the notes on each item.");
      } else if (
        err instanceof ReturnRequestError &&
        (err.code === "duplicate_return_request" || err.code === "order_not_eligible_for_return")
      ) {
        setFormError(err.message);
      } else if (err instanceof ReturnRequestError && err.status === 400) {
        setFormError("Check the items, quantities, and reasons, then try again.");
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
            Returns
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
              {account.loadErrors.includes("returns")
                ? "Your return requests could not be loaded."
                : "No return requests yet."}
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

          <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
            Choose the items you want to return. Most items can be returned within{" "}
            {returnRules.returnWindowDays} days of delivery; final-sale items only if faulty. Items must be
            unused and in their original condition unless faulty.
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
            Need help before you submit? Contact {account.storeName} at{" "}
            <a
              href={`mailto:${account.supportEmail}`}
              className="text-[var(--color-accent-gold-highlight)] underline-offset-4 hover:underline"
            >
              {account.supportEmail}
            </a>
            .
          </p>

          <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className={labelClass}>Order</span>
              {returnableOrders.length === 0 ? (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {account.loadErrors.includes("orders")
                    ? "Your orders could not be loaded, so returns cannot be started right now."
                    : orders.length === 0
                    ? "No orders found."
                    : `None of your orders are currently eligible for a return. Returns open once an order is delivered and last ${returnRules.returnWindowDays} days for most items.`}
                </p>
              ) : (
                <select
                  value={orderId}
                  onChange={(e) => chooseOrder(e.target.value)}
                  required
                  className={`h-12 ${fieldClass}`}
                >
                  {returnableOrders.map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.orderNumber} — {order.createdAt}
                    </option>
                  ))}
                </select>
              )}
            </label>

            {orderId ? (
              <div className="grid gap-3">
                <span className={labelClass}>Items</span>
                {!current ? (
                  <p className="text-sm text-[var(--color-text-secondary)]">Loading the items in this order…</p>
                ) : current.failed ? (
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                    <span>The items in this order could not be loaded.</span>
                    <button
                      type="button"
                      onClick={() => setReloadKey((key) => key + 1)}
                      className="rounded-full border border-white/10 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  lines.map((line) => (
                    <ReturnLinePicker
                      key={line.id}
                      line={line}
                      choice={choices[line.id]}
                      error={lineErrors[line.id]}
                      onChange={(patch) => updateChoice(line, patch)}
                    />
                  ))
                )}
              </div>
            ) : null}

            <label className="grid gap-2">
              <span className={labelClass}>Additional note (optional)</span>
              <textarea
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="Anything that helps us, e.g. what is faulty."
                className="min-h-20 rounded-[1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
              />
            </label>

            {formError ? (
              <p role="alert" className="text-sm text-red-400">{formError}</p>
            ) : null}

            {successMessage ? (
              <p className="text-sm text-[var(--color-accent-gold-highlight)]">{successMessage}</p>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit}
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

/** One order line: tick it, then choose how many and why. Items that can't be returned say why. */
function ReturnLinePicker({
  line,
  choice,
  error,
  onChange,
}: {
  line: CustomerOrderLine;
  choice: LineChoice | undefined;
  error: string | undefined;
  onChange: (patch: Partial<LineChoice>) => void;
}) {
  const check = line.returnEligibility;
  const canPick = Boolean(check?.eligible && check.remainingQuantity > 0);
  const faultyOnly = check?.faultyOnly ?? false;
  const reasons = faultyOnly ? RETURN_REASONS.filter((reason) => reason.code === "faulty") : RETURN_REASONS;
  const selected = canPick && Boolean(choice?.selected);

  return (
    <div
      role="group"
      aria-label={line.title}
      className={`rounded-[1.25rem] border p-4 ${
        selected ? "border-[var(--color-border-strong)] bg-black/30" : "border-white/8 bg-black/20"
      } ${canPick ? "" : "opacity-70"}`}
    >
      <label className={`flex items-start gap-3 ${canPick ? "cursor-pointer" : ""}`}>
        <input
          type="checkbox"
          aria-label={`Return ${line.title}`}
          disabled={!canPick}
          checked={selected}
          onChange={(event) => onChange({ selected: event.target.checked })}
          className="mt-1 h-4 w-4 accent-[var(--color-accent-gold)]"
        />
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-[var(--color-text-primary)]">{line.title}</span>
          <span className="block text-xs text-[var(--color-text-secondary)]">
            {line.variantLabel} · Bought {line.quantity}
          </span>
          {check ? (
            <span
              className={`mt-1 block text-xs leading-5 ${
                faultyOnly ? "text-[var(--color-warning)]" : "text-[var(--color-text-muted)]"
              }`}
            >
              {check.message}
            </span>
          ) : null}
        </span>
      </label>

      {selected && check ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-[8rem_1fr]">
          <select
            aria-label={`Quantity of ${line.title}`}
            value={choice?.quantity ?? 1}
            onChange={(event) => onChange({ quantity: Number(event.target.value) })}
            className={fieldClass}
          >
            {Array.from({ length: check.remainingQuantity }, (_, index) => index + 1).map((value) => (
              <option key={value} value={value}>
                Qty {value}
              </option>
            ))}
          </select>
          <select
            aria-label={`Reason for ${line.title}`}
            value={choice?.reason ?? ""}
            onChange={(event) => onChange({ reason: event.target.value as ReturnReasonCode | "" })}
            required
            className={fieldClass}
          >
            {faultyOnly ? null : <option value="">Choose a reason</option>}
            {reasons.map((reason) => (
              <option key={reason.code} value={reason.code}>
                {reason.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {error ? <p role="alert" className="mt-2 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
