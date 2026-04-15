"use client";

import type { ReactNode } from "react";

import { AccountAuthProvider } from "@/features/account-auth/presentation/state/account-auth-provider";

import { CartProvider } from "../state/cart-provider";

export function StorefrontProviders({ children }: { children: ReactNode }) {
  return (
    <AccountAuthProvider>
      <CartProvider>{children}</CartProvider>
    </AccountAuthProvider>
  );
}
