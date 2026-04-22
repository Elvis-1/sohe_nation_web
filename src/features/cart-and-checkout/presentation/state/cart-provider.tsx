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
  isHydrated: boolean;
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

function persistLines(lines: StoredCartLine[]) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [storedLines, setStoredLines] = useState<StoredCartLine[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const persisted = readStoredLines();
    setStoredLines((current) => (current.length ? current : persisted));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    persistLines(storedLines);
  }, [isHydrated, storedLines]);

  const cart = useMemo(() => buildCart(storedLines), [storedLines]);
  const itemCount = useMemo(
    () => cart.lines.reduce((sum, line) => sum + line.quantity, 0),
    [cart.lines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      itemCount,
      isHydrated,
      addItem: ({ product, variantId, quantity = 1 }) => {
        setStoredLines((current) => {
          const existingIndex = current.findIndex((line) => line.variantId === variantId);

          if (existingIndex >= 0) {
            const next = current.map((line, index) =>
              index === existingIndex
                ? { ...line, quantity: line.quantity + quantity }
                : line,
            );
            persistLines(next);
            return next;
          }

          const next = [...current, createStoredCartLine(product, variantId, quantity)];
          persistLines(next);
          return next;
        });
      },
      updateQuantity: (variantId, quantity) => {
        setStoredLines((current) => {
          const next = current
            .map((line) =>
              line.variantId === variantId
                ? { ...line, quantity: Math.max(0, quantity) }
                : line,
            )
            .filter((line) => line.quantity > 0);
          persistLines(next);
          return next;
        });
      },
      removeItem: (variantId) => {
        setStoredLines((current) => {
          const next = current.filter((line) => line.variantId !== variantId);
          persistLines(next);
          return next;
        });
      },
      clearCart: () => {
        persistLines([]);
        setStoredLines([]);
      },
    }),
    [cart, isHydrated, itemCount],
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
    isHydrated: false,
    addItem: () => undefined,
    updateQuantity: () => undefined,
    removeItem: () => undefined,
    clearCart: () => undefined,
  };
}
