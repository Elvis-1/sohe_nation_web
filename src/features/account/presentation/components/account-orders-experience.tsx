"use client";

import { useEffect, useState } from "react";

import { AccountAccessGate } from "@/features/account-auth/presentation/components/account-access-gate";
import { useAccountAuth } from "@/features/account-auth/presentation/state/account-auth-provider";

import {
  getCustomerAccount,
  type CustomerAccountData,
} from "../../data/services/get-customer-account";
import { OrdersPageShell } from "./orders-page-shell";

export function AccountOrdersExperience() {
  const { isAuthenticated, session } = useAccountAuth();
  const [account, setAccount] = useState<CustomerAccountData | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadAccount() {
      if (!isAuthenticated) {
        setAccount(null);
        return;
      }

      const nextAccount = await getCustomerAccount(
        session?.email && session?.token
          ? {
              token: session.token,
              email: session.email,
              firstName: session.firstName,
              lastName: session.lastName,
            }
          : undefined,
      );

      if (isActive) {
        setAccount(nextAccount);
      }
    }

    void loadAccount();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, session]);

  return (
    <AccountAccessGate
      title="Sign in to review order history."
      description="The order-history UI now belongs to the customer-account feature and only opens after backend-backed customer access is granted."
    >
      {account ? (
        <OrdersPageShell account={account} />
      ) : (
        <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(28,26,23,0.98),rgba(10,10,10,0.98))] p-8">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
            Loading Orders
          </p>
        </section>
      )}
    </AccountAccessGate>
  );
}
