"use client";

import type { ReactNode } from "react";

import { useAccountAuth } from "../state/account-auth-provider";
import { AccountAuthPanel } from "./account-auth-panel";

export function AccountAccessGate({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description: string;
}) {
  const { isAuthenticated, isReady } = useAccountAuth();

  if (!isReady) {
    return (
      <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(28,26,23,0.98),rgba(10,10,10,0.98))] p-8">
        <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
          Loading Account
        </p>
        <h2 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
          Preparing the customer surface.
        </h2>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AccountAuthPanel />
        <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(24,22,20,0.98),rgba(8,8,8,0.98))] p-6 md:p-8">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
            Account Access
          </p>
          <h2 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)]">
            {description}
          </p>
        </section>
      </div>
    );
  }

  return <>{children}</>;
}
