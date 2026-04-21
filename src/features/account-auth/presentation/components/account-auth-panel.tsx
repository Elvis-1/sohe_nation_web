"use client";

import Link from "next/link";
import { useState } from "react";

import { useAccountAuth } from "../state/account-auth-provider";

type AccountAuthMode = "sign-in" | "register";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "sohe.customer@fixture.test",
  password: "mock-pass-123",
};

export function AccountAuthPanel() {
  const [mode, setMode] = useState<AccountAuthMode>("sign-in");
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const { signIn, register, authError } = useAccountAuth();

  async function handleSubmit() {
    setStatus("submitting");
    try {
      if (mode === "sign-in") {
        await signIn(form);
      } else {
        await register(form);
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(28,26,23,0.98),rgba(10,10,10,0.98))] p-6 md:p-8">
      <div className="flex gap-3">
        {[
          { value: "sign-in", label: "Sign In" },
          { value: "register", label: "Register" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setMode(item.value as AccountAuthMode)}
            className={`rounded-full px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] transition ${
              mode === item.value
                ? "bg-[var(--color-accent-gold)] text-black"
                : "border border-white/10 text-[var(--color-text-secondary)]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <h2 className="mt-6 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
        {mode === "sign-in" ? "Return to the campaign." : "Create your customer profile."}
      </h2>
      <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
        Account entry now runs through the backend customer auth layer, so sign-in and registration
        open the live account surfaces instead of a mocked credential bridge.
      </p>

      <div className="mt-6 grid gap-4">
        {mode === "register" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.firstName}
              onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
              placeholder="First name"
              className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)]"
            />
            <input
              value={form.lastName}
              onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
              placeholder="Last name"
              className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)]"
            />
          </div>
        ) : null}
        <input
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="Email"
          className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)]"
        />
        <input
          type="password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          placeholder="Password"
          className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)]"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={status === "submitting"}
          className="rounded-full bg-[var(--color-accent-gold)] px-5 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)] disabled:opacity-60"
        >
          {status === "submitting"
            ? "Processing..."
            : mode === "sign-in"
              ? "Sign In"
              : "Create Account"}
        </button>
        {mode === "sign-in" ? (
          <div className="flex justify-end">
            <Link
              href="/account/forgot-password"
              className="text-xs uppercase tracking-[0.16em] text-[var(--color-accent-gold-highlight)] transition hover:text-[var(--color-text-primary)]"
            >
              Forgot password?
            </Link>
          </div>
        ) : null}
        {status === "error" && authError ? (
          <p className="text-sm text-[#ff9b8a]">{authError}</p>
        ) : null}
      </div>
    </section>
  );
}
