"use client";

import Link from "next/link";
import { useState } from "react";

import { useAccountAuth } from "../state/account-auth-provider";

export function AccountForgotPasswordShell() {
  const { requestPasswordReset, authError } = useAccountAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit() {
    setStatus("submitting");
    setMessage(null);
    try {
      const result = await requestPasswordReset(email);
      setStatus("success");
      setMessage(result);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to request password reset.");
    }
  }

  return (
    <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(26,25,24,0.98),rgba(10,10,10,0.98))] p-6 md:p-8">
      <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-gold-highlight)]">
        Account Recovery
      </p>
      <h1 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)] md:text-6xl">
        Forgot your password?
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)]">
        Enter your account email and we will send a secure reset link if the account exists.
      </p>

      <div className="mt-6 grid gap-4">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)]"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!email.trim() || status === "submitting"}
          className="rounded-full bg-[var(--color-accent-gold)] px-5 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)] disabled:opacity-60"
        >
          {status === "submitting" ? "Sending..." : "Send reset link"}
        </button>
        {message ? (
          <p className={`text-sm ${status === "error" ? "text-[#ff9b8a]" : "text-[var(--color-text-secondary)]"}`}>
            {message}
          </p>
        ) : null}
        {status === "error" && authError && !message ? (
          <p className="text-sm text-[#ff9b8a]">{authError}</p>
        ) : null}
        <Link
          href="/account"
          className="text-xs uppercase tracking-[0.16em] text-[var(--color-accent-gold-highlight)] transition hover:text-[var(--color-text-primary)]"
        >
          Back to account access
        </Link>
      </div>
    </section>
  );
}
