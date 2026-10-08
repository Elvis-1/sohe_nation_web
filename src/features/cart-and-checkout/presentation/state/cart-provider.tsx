"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import type { Cart, Product } from "@/core/types/commerce";

import {
  buildCart,
  createStoredCartLine,
  type StoredCartLine,
} from "../../data/repositories/cart-repository";

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
const EMPTY_LINES: StoredCartLine[] = [];

const CartContext = createContext<CartContextValue | null>(null);

// Browser storage is the cart's source of truth (api/PLAN.md Slice 9), read as an external
// store so every tab and component sees the same lines without copying them into state.
const cartListeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedLines: StoredCartLine[] = EMPTY_LINES;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getLinesSnapshot(): StoredCartLine[] {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedLines;

  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cachedLines = Array.isArray(parsed) ? parsed : EMPTY_LINES;
  } catch {
    cachedLines = EMPTY_LINES;
  }
  return cachedLines;
}

function getServerLinesSnapshot(): StoredCartLine[] {
  return EMPTY_LINES;
}

function subscribeToLines(onChange: () => void) {
  cartListeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    cartListeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function writeLines(update: (current: StoredCartLine[]) => StoredCartLine[]) {
  const next = update(getLinesSnapshot());
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable (private mode); the bag then lasts only for this render.
  }
  cartListeners.forEach((listener) => listener());
}

/** Removes paid-for lines once the API confirms payment; anything added since stays. */
export function removePurchasedVariants(variantIds: string[]) {
  const paid = new Set(variantIds);
  if (!paid.size) return;
  writeLines((current) => current.filter((line) => !paid.has(line.variantId)));
}

const subscribeNever = () => () => undefined;

export function CartProvider({ children }: { children: ReactNode }) {
  const storedLines = useSyncExternalStore(subscribeToLines, getLinesSnapshot, getServerLinesSnapshot);
  // False during server render and hydration, true once running in the browser.
  const isHydrated = useSyncExternalStore(subscribeNever, () => true, () => false);

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
        writeLines((current) => {
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
        writeLines((current) =>
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
        writeLines((current) => current.filter((line) => line.variantId !== variantId));
      },
      clearCart: () => {
        writeLines(() => []);
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
