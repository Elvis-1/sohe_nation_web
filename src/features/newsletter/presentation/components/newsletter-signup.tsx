"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { track } from "@/core/analytics/track";

import { subscribeToNewsletter } from "../../data/services/newsletter";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = email.trim();
    if (!emailPattern.test(trimmed)) {
      setStatus("error");
      setMessage("Enter a valid email so we can hold your place on the drop list.");
      return;
    }

    setStatus("submitting");
    setMessage(null);
    try {
      // Success only after the API has stored the sign-up.
      setMessage(await subscribeToNewsletter(trimmed, "footer"));
      track({ name: "generate_lead", source: "newsletter_footer" });
      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not add you right now. Please try again.");
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Newsletter sign-up"
      className="rounded-[1.75rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(33,31,28,0.98),rgba(15,15,15,0.98))] p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
            Newsletter
          </p>
          <h3 className="mt-3 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
            Stay on drop alert.
          </h3>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
          Weekly dispatch
        </div>
      </div>

      <p className="mt-4 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
        Release notes, lookbook previews, and first-call access for the next Sohe Nation drop.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="sr-only">Email address</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email address"
            value={email}
            aria-invalid={status === "error"}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status !== "submitting" && message) {
                setStatus("idle");
                setMessage(null);
              }
            }}
            className="h-13 w-full rounded-full border border-white/10 bg-black/30 px-5 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)] focus:bg-black/45"
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-13 rounded-full bg-[var(--color-accent-gold)] px-6 font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Securing" : "Join The List"}
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.22em]">
        <p className="font-[family:var(--font-supporting)] text-[var(--color-text-muted)]">
          No spam. Confirm by email. Unsubscribe anytime. See our{" "}
          <Link
            href="/privacy"
            className="text-[var(--color-text-secondary)] underline decoration-white/30 underline-offset-4 transition hover:text-[var(--color-text-primary)]"
          >
            privacy policy
          </Link>
          .
        </p>
        <p
          role="status"
          aria-live="polite"
          className={`font-[family:var(--font-supporting)] ${
            status === "error" ? "text-[#ff9b8a]" : "text-[var(--color-text-secondary)]"
          }`}
        >
          {message ?? "First notice stays with the list."}
        </p>
      </div>
    </form>
  );
}
