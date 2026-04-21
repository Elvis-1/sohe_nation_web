"use client";

import { useEffect, useState } from "react";

import { AccountAccessGate } from "@/features/account-auth/presentation/components/account-access-gate";
import { useAccountAuth } from "@/features/account-auth/presentation/state/account-auth-provider";

import {
  getCustomerOrderDetail,
  type CustomerOrderDetail,
} from "../../data/services/get-customer-account";
import { OrderDetailPageShell } from "./order-detail-page-shell";

type AccountOrderDetailExperienceProps = {
  orderId: string;
};

export function AccountOrderDetailExperience({ orderId }: AccountOrderDetailExperienceProps) {
  const { isAuthenticated, session } = useAccountAuth();
  const [order, setOrder] = useState<CustomerOrderDetail | null>(null);
  const [isMissing, setIsMissing] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadOrderDetail() {
      if (!isAuthenticated) {
        setOrder(null);
        setIsMissing(false);
        return;
      }

      const auth =
        session?.email && session?.token
          ? {
              token: session.token,
              email: session.email,
              firstName: session.firstName,
              lastName: session.lastName,
            }
          : undefined;

      try {
        const detail = await getCustomerOrderDetail(orderId, auth);

        if (detail) {
          if (isActive) {
            setOrder(detail);
            setIsMissing(false);
          }
          return;
        }

        if (isActive) {
          setOrder(null);
          setIsMissing(true);
        }
      } catch {
        if (isActive) {
          setOrder(null);
          setIsMissing(true);
        }
      }
    }

    void loadOrderDetail();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, orderId, session]);

  return (
    <AccountAccessGate
      title="Sign in to open your order detail."
      description="Order detail and line-item visibility are part of the customer-account feature and open only after account access is granted."
    >
      {order ? (
        <OrderDetailPageShell order={order} />
      ) : isMissing ? (
        <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(28,26,23,0.98),rgba(10,10,10,0.98))] p-8">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
            Order Not Found
          </p>
          <h2 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
            This order is not available.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)]">
            The order may not belong to this account, or it may no longer be accessible from this
            session.
          </p>
        </section>
      ) : (
        <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(28,26,23,0.98),rgba(10,10,10,0.98))] p-8">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
            Loading Order
          </p>
        </section>
      )}
    </AccountAccessGate>
  );
}
