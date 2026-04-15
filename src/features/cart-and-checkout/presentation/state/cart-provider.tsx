"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Cart, Product } from "@/core/types/commerce";

import {
  buildCart,
  createStoredCartLine,
  type StoredCartLine,
} from "../../data/repositories/mock-cart-repository";

const STORAGE_KEY = "sohe-storefront-cart";

type AddToCartInput = {
  product: Product;
  variantId: string;
  quantity?: number;
};

type CartContextValue = {
  cart: Cart;
  itemCount: number;
  addItem: (input: AddToCartInput) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
};

const emptyCart = buildCart([]);

const CartContext = createContext<CartContextValue | null>(null);

function readStoredLines(): StoredCartLine[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);

    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [storedLines, setStoredLines] = useState<StoredCartLine[]>(() => readStoredLines());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedLines));
  }, [storedLines]);

  const cart = useMemo(() => buildCart(storedLines), [storedLines]);
  const itemCount = useMemo(
    () => cart.lines.reduce((sum, line) => sum + line.quantity, 0),
    [cart.lines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      itemCount,
      addItem: ({ product, variantId, quantity = 1 }) => {
        setStoredLines((current) => {
          const existingIndex = current.findIndex((line) => line.variantId === variantId);

          if (existingIndex >= 0) {
            return current.map((line, index) =>
              index === existingIndex
                ? { ...line, quantity: line.quantity + quantity }
                : line,
            );
          }

          return [...current, createStoredCartLine(product, variantId, quantity)];
        });
      },
      updateQuantity: (variantId, quantity) => {
        setStoredLines((current) =>
          current
            .map((line) =>
              line.variantId === variantId
                ? { ...line, quantity: Math.max(0, quantity) }
                : line,
            )
            .filter((line) => line.quantity > 0),
        );
      },
      removeItem: (variantId) => {
        setStoredLines((current) => current.filter((line) => line.variantId !== variantId));
      },
      clearCart: () => {
        setStoredLines([]);
      },
    }),
    [cart, itemCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}

export function useCartSnapshot() {
  const context = useContext(CartContext);

  return context ?? {
    cart: emptyCart,
    itemCount: 0,
    addItem: () => undefined,
    updateQuantity: () => undefined,
    removeItem: () => undefined,
    clearCart: () => undefined,
  };
}
