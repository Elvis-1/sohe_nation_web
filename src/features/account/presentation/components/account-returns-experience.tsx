"use client";

import { useEffect, useState } from "react";

import { AccountAccessGate } from "@/features/account-auth/presentation/components/account-access-gate";
import { useAccountAuth } from "@/features/account-auth/presentation/state/account-auth-provider";

import {
  getCustomerAccount,
  type AccountApiAuth,
  type CustomerAccountData,
} from "../../data/services/get-customer-account";
import { ReturnsPageShell } from "./returns-page-shell";

export function AccountReturnsExperience() {
  const { isAuthenticated, session } = useAccountAuth();
  const [account, setAccount] = useState<CustomerAccountData | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const auth: AccountApiAuth | undefined =
    session?.email && session?.password
      ? { email: session.email, password: session.password }
      : undefined;

  useEffect(() => {
    let isActive = true;

    async function loadAccount() {
      if (!isAuthenticated) {
        setAccount(null);
        return;
      }

      const nextAccount = await getCustomerAccount(auth);

      if (isActive) {
        setAccount(nextAccount);
      }
    }

    void loadAccount();

    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, session, refreshKey]);

  return (
    <AccountAccessGate
      title="Sign in to open your returns workspace."
      description="Returns are managed inside your customer account. Sign in to view and submit return requests."
    >
      {account ? (
        <ReturnsPageShell
          account={account}
          auth={auth}
          onReturnCreated={() => setRefreshKey((k) => k + 1)}
        />
      ) : (
        <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(28,26,23,0.98),rgba(10,10,10,0.98))] p-8">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
            Returns
          </p>
          <h2 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
            Opening your return workspace.
          </h2>
        </section>
      )}
    </AccountAccessGate>
  );
}
