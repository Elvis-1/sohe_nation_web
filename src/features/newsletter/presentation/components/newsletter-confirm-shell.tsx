"use client";

import Link from "next/link";
import { useState } from "react";

import { confirmNewsletterSubscription } from "../../data/services/newsletter";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Confirmation needs a click, not a page load: inbox link scanners open emailed links,
 * and an auto-confirm would sign people up who never saw the email.
 */
export function NewsletterConfirmShell({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>(token ? "idle" : "error");
  const [message, setMessage] = useState<string | null>(
    token ? null : "This confirmation link is incomplete. Open the link from your email again.",
  );

  async function handleConfirm() {
    setStatus("submitting");
    setMessage(null);
    try {
      setMessage(await confirmNewsletterSubscription(token));
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not confirm your place right now.");
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(26,25,24,0.98),rgba(10,10,10,0.98))] p-6 md:p-8">
      <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-gold-highlight)]">
        Drop Alerts
      </p>
      <h1 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)] md:text-6xl">
        {status === "success" ? "You're on the list." : "Confirm your place."}
      </h1>
      <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
        {status === "success"
          ? "Release notes, lookbook previews, and first-call access now come straight to your inbox."
          : "One click confirms you want release notes, lookbook previews, and first-call access for the next drop."}
      </p>

      {status !== "success" && token ? (
        <button
          type="button"
          onClick={handleConfirm}
          disabled={status === "submitting"}
          className="mt-6 w-full rounded-full bg-[var(--color-accent-gold)] px-5 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)] disabled:opacity-60"
        >
          {status === "submitting" ? "Confirming..." : "Confirm drop alerts"}
        </button>
      ) : null}

      {message ? (
        <p
          role="status"
          aria-live="polite"
          className={`mt-4 text-sm ${status === "error" ? "text-[#ff9b8a]" : "text-[var(--color-text-secondary)]"}`}
        >
          {message}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-5">
        <Link
          href="/products"
          className="text-xs uppercase tracking-[0.16em] text-[var(--color-accent-gold-highlight)] transition hover:text-[var(--color-text-primary)]"
        >
          Shop the line
        </Link>
        <Link
          href="/stories"
          className="text-xs uppercase tracking-[0.16em] text-[var(--color-accent-gold-highlight)] transition hover:text-[var(--color-text-primary)]"
        >
          Read the stories
        </Link>
      </div>
    </section>
  );
}
