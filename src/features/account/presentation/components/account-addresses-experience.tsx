"use client";

import { useEffect, useState } from "react";

import { AccountAccessGate } from "@/features/account-auth/presentation/components/account-access-gate";
import { useAccountAuth } from "@/features/account-auth/presentation/state/account-auth-provider";

import {
  getCustomerAccount,
  type AccountApiAuth,
  type CustomerAccountData,
} from "../../data/services/get-customer-account";
import { AddressBookPageShell } from "./address-book-page-shell";

function buildAuth(session: ReturnType<typeof useAccountAuth>["session"]): AccountApiAuth | undefined {
  if (!session?.token || !session.email) return undefined;
  return {
    token: session.token,
    email: session.email,
    firstName: session.firstName,
    lastName: session.lastName,
  };
}

export function AccountAddressesExperience() {
  const { isAuthenticated, session } = useAccountAuth();
  const [account, setAccount] = useState<CustomerAccountData | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadAccount() {
      if (!isAuthenticated) {
        setAccount(null);
        return;
      }

      const nextAccount = await getCustomerAccount(buildAuth(session));
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
      title="Sign in to manage your addresses."
      description="Saved delivery addresses now live in your account workspace so checkout can preload reliable shipping details."
    >
      {account ? (
        <AddressBookPageShell
          addresses={account.addresses}
          auth={buildAuth(session)}
        />
      ) : (
        <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(28,26,23,0.98),rgba(10,10,10,0.98))] p-8">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
            Loading Addresses
          </p>
        </section>
      )}
    </AccountAccessGate>
  );
}
