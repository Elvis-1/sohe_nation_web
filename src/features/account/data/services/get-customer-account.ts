import type { CustomerProfile, Money, OrderSummary } from "@/core/types/commerce";

const CHECKOUT_ORDERS_STORAGE_KEY = "sohe-storefront-checkout-orders";

export type ReturnDraft = {
  orderNumber: string;
  itemTitle: string;
  reason: string;
  status: "draft" | "submitted";
};

export type CustomerAccountData = {
  profile: CustomerProfile;
  membershipTier: string;
  preferredStore: string;
  savedAddress: string;
  draftReturn: ReturnDraft;
};

function money(amount: number): Money {
  return {
    amount,
    currency: "NGN",
    formatted: `NGN ${amount.toLocaleString("en-NG")}`,
  };
}

const baseOrders: OrderSummary[] = [
  {
    id: "ord_2004",
    orderNumber: "SN-2004",
    createdAt: "2026-04-08",
    status: "fulfilled",
    total: money(197000),
  },
  {
    id: "ord_1968",
    orderNumber: "SN-1968",
    createdAt: "2026-03-22",
    status: "paid",
    total: money(112000),
  },
  {
    id: "ord_1881",
    orderNumber: "SN-1881",
    createdAt: "2026-03-04",
    status: "fulfilled",
    total: money(64000),
  },
];

function readPersistedCheckoutOrders(): OrderSummary[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value = window.localStorage.getItem(CHECKOUT_ORDERS_STORAGE_KEY);

    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? (parsed as OrderSummary[]) : [];
  } catch {
    return [];
  }
}

function writePersistedCheckoutOrders(orders: OrderSummary[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CHECKOUT_ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

function mergeOrders(orders: OrderSummary[]) {
  const seen = new Set<string>();

  return [...orders]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .filter((order) => {
      const key = `${order.id}:${order.orderNumber}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}

export function persistMockCheckoutOrder(order: OrderSummary) {
  const persisted = readPersistedCheckoutOrders();
  writePersistedCheckoutOrders(mergeOrders([order, ...persisted]));
}

export async function getCustomerAccount(): Promise<CustomerAccountData> {
  const orders = mergeOrders([...readPersistedCheckoutOrders(), ...baseOrders]);

  return {
    profile: {
      id: "cust_sohe_fixture",
      email: "sohe.customer@fixture.test",
      firstName: "Ada",
      lastName: "Okafor",
      defaultRegion: "NG",
      orders,
    },
    membershipTier: "Campaign Insider",
    preferredStore: "Lagos Primary Market",
    savedAddress: "Lekki Phase 1, Lagos, Nigeria",
    draftReturn: {
      orderNumber: "SN-1968",
      itemTitle: "SN Command Jacket",
      reason: "Need a sharper fit through the shoulder.",
      status: "draft",
    },
  };
}
