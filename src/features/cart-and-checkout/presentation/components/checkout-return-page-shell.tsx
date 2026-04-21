"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useAccountAuth } from "@/features/account-auth/presentation/state/account-auth-provider";
import { getCheckoutSession } from "@/features/cart-and-checkout/data/services/checkout-sessions";

type ViewState =
  | { mode: "loading" }
  | { mode: "error"; message: string }
  | { mode: "success"; message: string };

export function CheckoutReturnPageShell() {
  const searchParams = useSearchParams();
  const { session } = useAccountAuth();
  const [state, setState] = useState<ViewState>({ mode: "loading" });

  useEffect(() => {
    let isActive = true;
    async function reconcile() {
      const checkoutSessionId = searchParams.get("checkout_session_id")?.trim() ?? "";
      const transactionId = searchParams.get("transaction_id")?.trim() ?? "";
      const txRef = searchParams.get("tx_ref")?.trim() ?? "";
      if (!checkoutSessionId) {
        if (isActive) {
          setState({ mode: "error", message: "Missing checkout session reference." });
        }
        return;
      }

      try {
        const checkoutSession = await getCheckoutSession(
          checkoutSessionId,
          session?.token ? { token: session.token } : undefined,
          { transactionId, txRef },
        );
        if (!isActive) return;
        if (checkoutSession.status === "authorized") {
          setState({ mode: "success", message: "Payment authorized successfully." });
          return;
        }
        if (checkoutSession.status === "failed") {
          setState({ mode: "error", message: "Payment was not completed." });
          return;
        }
        setState({ mode: "loading" });
      } catch (error) {
        if (!isActive) return;
        setState({
          mode: "error",
          message: error instanceof Error ? error.message : "Unable to confirm payment status.",
        });
      }
    }
    void reconcile();
    return () => {
      isActive = false;
    };
  }, [searchParams, session?.token]);

  if (state.mode === "loading") {
    return (
      <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(160deg,rgba(24,22,20,0.98),rgba(8,8,8,0.98))] p-6 md:p-8">
        <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
          Payment status
        </p>
        <h2 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
          Confirming provider response.
        </h2>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(160deg,rgba(24,22,20,0.98),rgba(8,8,8,0.98))] p-6 md:p-8">
      <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
        Payment return
      </p>
      <h2 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
        {state.mode === "success" ? "Payment confirmed." : "Payment needs attention."}
      </h2>
      <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">{state.message}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/account/orders"
          className="rounded-full bg-[var(--color-accent-gold)] px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
        >
          Review Orders
        </Link>
        <Link
          href="/checkout"
          className="rounded-full border border-white/10 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
        >
          Back To Checkout
        </Link>
      </div>
    </section>
  );
}

