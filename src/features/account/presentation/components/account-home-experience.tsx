"use client";

import { useEffect, useState } from "react";

import { AccountAccessGate } from "@/features/account-auth/presentation/components/account-access-gate";
import { useAccountAuth } from "@/features/account-auth/presentation/state/account-auth-provider";

import {
  getCustomerAccount,
  type CustomerAccountData,
} from "../../data/services/get-customer-account";
import { AccountOverviewShell } from "./account-overview-shell";

export function AccountHomeExperience() {
  const { isAuthenticated, session } = useAccountAuth();
  const [account, setAccount] = useState<CustomerAccountData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadAccount() {
      if (!isAuthenticated) {
        setAccount(null);
        return;
      }

      setIsLoading(true);
      const nextAccount = await getCustomerAccount(
        session?.email && session?.password
          ? { email: session.email, password: session.password }
          : undefined,
      );

      if (isActive) {
        setAccount(nextAccount);
        setIsLoading(false);
      }
    }

    void loadAccount();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, session]);

  return (
    <AccountAccessGate
      title="Sign in before we open your account."
      description="Order history, saved profile details, and returns now live in a separate customer-account feature, while sign-in and registration stay isolated in the new account-auth feature."
    >
      {isLoading || !account ? (
        <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(28,26,23,0.98),rgba(10,10,10,0.98))] p-8">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
            Loading Profile
          </p>
          <h2 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
            Preparing your private desk.
          </h2>
        </section>
      ) : (
        <AccountOverviewShell account={account} />
      )}
    </AccountAccessGate>
  );
}
