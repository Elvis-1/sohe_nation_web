import type { CustomerProfile, Money, OrderSummary } from "@/core/types/commerce";

const CHECKOUT_ORDERS_STORAGE_KEY = "sohe-storefront-checkout-orders";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const ACCOUNT_API_BASIC_AUTH = process.env.NEXT_PUBLIC_ACCOUNT_API_BASIC_AUTH;

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

export type AccountApiAuth = {
  email: string;
  password: string;
};

export type CustomerOrderLine = {
  id: string;
  title: string;
  variantLabel: string;
  quantity: number;
  unitPrice: Money;
};

export type CustomerOrderDetail = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderSummary["status"];
  total: Money;
  shippingAddress: string;
  lines: CustomerOrderLine[];
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

type ApiMoney = {
  amount: number;
  currency: string;
  formatted: string;
};

type ApiAccountOrder = {
  id: string;
  order_number: string;
  created_at: string;
  status: OrderSummary["status"];
  total: ApiMoney;
};

type ApiPaginatedOrders = {
  results: ApiAccountOrder[];
};

type ApiAccountOrderLine = {
  id: string;
  title: string;
  variant_label: string;
  quantity: number;
  unit_price: ApiMoney;
};

type ApiAccountOrderDetail = ApiAccountOrder & {
  shipping_address: string;
  lines: ApiAccountOrderLine[];
};

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

function mapApiOrderToSummary(order: ApiAccountOrder): OrderSummary {
  return {
    id: order.id,
    orderNumber: order.order_number,
    createdAt: order.created_at.slice(0, 10),
    status: order.status,
    total: {
      amount: order.total.amount,
      currency: order.total.currency as Money["currency"],
      formatted: order.total.formatted,
    },
  };
}

function mapApiOrderToDetail(order: ApiAccountOrderDetail): CustomerOrderDetail {
  return {
    id: order.id,
    orderNumber: order.order_number,
    createdAt: order.created_at.slice(0, 10),
    status: order.status,
    total: {
      amount: order.total.amount,
      currency: order.total.currency as Money["currency"],
      formatted: order.total.formatted,
    },
    shippingAddress: order.shipping_address,
    lines: (order.lines ?? []).map((line) => ({
      id: line.id,
      title: line.title,
      variantLabel: line.variant_label,
      quantity: line.quantity,
      unitPrice: {
        amount: line.unit_price.amount,
        currency: line.unit_price.currency as Money["currency"],
        formatted: line.unit_price.formatted,
      },
    })),
  };
}

function buildOptionalAuthHeader(auth?: AccountApiAuth): Record<string, string> {
  if (typeof window === "undefined" || typeof window.btoa !== "function") {
    return {};
  }

  if (auth?.email?.trim() && auth.password) {
    return {
      Authorization: `Basic ${window.btoa(`${auth.email.trim()}:${auth.password}`)}`,
    };
  }

  if (!ACCOUNT_API_BASIC_AUTH) {
    return {};
  }

  if (ACCOUNT_API_BASIC_AUTH.startsWith("Basic ")) {
    return { Authorization: ACCOUNT_API_BASIC_AUTH };
  }

  return { Authorization: `Basic ${window.btoa(ACCOUNT_API_BASIC_AUTH)}` };
}

async function fetchApiOrders(auth?: AccountApiAuth): Promise<OrderSummary[]> {
  if (!API_BASE) {
    return [];
  }

  const response = await fetch(`${API_BASE}/account/orders/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...buildOptionalAuthHeader(auth),
    },
  });

  if (!response.ok) {
    throw new Error(`account_orders_http_${response.status}`);
  }

  const payload = (await response.json()) as ApiPaginatedOrders;
  return (payload.results ?? []).map(mapApiOrderToSummary);
}

export function persistMockCheckoutOrder(order: OrderSummary) {
  const persisted = readPersistedCheckoutOrders();
  writePersistedCheckoutOrders(mergeOrders([order, ...persisted]));
}

export async function getCustomerAccount(auth?: AccountApiAuth): Promise<CustomerAccountData> {
  const persistedOrders = readPersistedCheckoutOrders();
  const hasSessionAuth = Boolean(auth?.email?.trim() && auth?.password);
  let canonicalOrders: OrderSummary[] = hasSessionAuth ? [] : baseOrders;

  try {
    const apiOrders = await fetchApiOrders(auth);
    if (hasSessionAuth || apiOrders.length > 0) {
      canonicalOrders = apiOrders;
    }
  } catch {
    canonicalOrders = hasSessionAuth ? [] : baseOrders;
  }

  const orders = mergeOrders([...persistedOrders, ...canonicalOrders]);

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

export async function getCustomerOrderDetail(
  orderId: string,
  auth?: AccountApiAuth,
): Promise<CustomerOrderDetail | null> {
  if (!API_BASE) {
    return null;
  }

  const response = await fetch(`${API_BASE}/account/orders/${orderId}/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...buildOptionalAuthHeader(auth),
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`account_order_detail_http_${response.status}`);
  }

  const payload = (await response.json()) as ApiAccountOrderDetail;
  return mapApiOrderToDetail(payload);
}
