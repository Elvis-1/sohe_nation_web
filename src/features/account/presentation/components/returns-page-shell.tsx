"use client";

import Link from "next/link";
import { useState } from "react";

import type { CustomerAccountData } from "../../data/services/get-customer-account";

export function ReturnsPageShell({ account }: { account: CustomerAccountData }) {
  const [draft, setDraft] = useState(account.draftReturn);
  const isSubmitted = draft.status === "submitted";

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
            Edit the request, confirm the reason, and send it forward with a clearer sense of what
            happens next across the customer line.
          </p>
        </div>

        <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[1.75rem] border border-[var(--color-border-strong)] bg-[linear-gradient(180deg,rgba(214,165,72,0.12),rgba(0,0,0,0.12))] p-5">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Return state
            </p>
            <p className="mt-3 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
              {isSubmitted ? "Submitted" : "Draft Open"}
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
              {isSubmitted
                ? "Your return request is logged and waiting for the next account-side update."
                : "Your request is still editable. Review the details and submit when the reason is final."}
            </p>
          </article>
          <article className="rounded-[1.5rem] border border-white/8 bg-black/25 p-5 backdrop-blur-sm">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Current item
            </p>
            <p className="mt-3 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
              {draft.itemTitle}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              Tied to {draft.orderNumber}
            </p>
          </article>
        </div>

        <div className="relative z-10 mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setDraft((current) => ({ ...current, status: "submitted" }))}
            className="rounded-full bg-[var(--color-accent-gold)] px-5 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
          >
            {isSubmitted ? "Return Submitted" : "Submit Return Request"}
          </button>
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
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
                Request Details
              </p>
              <h3 className="mt-3 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
                Review the request before it leaves your desk.
              </h3>
            </div>
            <div className="rounded-full border border-white/10 bg-black/25 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
              Editable in fixture mode
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Order number
              </span>
              <input
                value={draft.orderNumber}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, orderNumber: event.target.value }))
                }
                className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
              />
            </label>
            <label className="grid gap-2">
              <span className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Item title
              </span>
              <input
                value={draft.itemTitle}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, itemTitle: event.target.value }))
                }
                className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
              />
            </label>
            <label className="grid gap-2">
              <span className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Return reason
              </span>
              <textarea
                value={draft.reason}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, reason: event.target.value }))
                }
                className="min-h-32 rounded-[1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
              />
            </label>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(160deg,rgba(24,22,20,0.98),rgba(8,8,8,0.98))] p-6 md:p-8">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
            What Happens Next
          </p>
          <div className="mt-5 space-y-4">
            {[
              {
                title: "1. Review",
                body: "Confirm the item, order number, and return reason before sending the request forward.",
              },
              {
                title: "2. Submit",
                body: "Lock the draft into a submitted state so the next account-side update can pick it up.",
              },
              {
                title: "3. Wait for update",
                body: "In live mode this area will hand off to real return handling, notifications, and status changes.",
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
        </div>

        {isSubmitted ? (
          <div className="rounded-[2rem] border border-[var(--color-border-strong)] bg-[rgba(214,165,72,0.08)] p-6">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
              Return Logged
            </p>
            <h3 className="mt-4 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
              Request submitted with calm handoff.
            </h3>
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
              The request for {draft.orderNumber} is now marked as submitted in the fixture flow.
              Live account mutations can replace this with real confirmation, notifications, and
              follow-up states later.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
