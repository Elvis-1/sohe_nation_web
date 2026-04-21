import type { CustomerProfile, Money, OrderSummary } from "@/core/types/commerce";
import { ApiError } from "@/core/api/http-client";
import {
  formatAddressLine,
  listCustomerAddresses,
  type CustomerAddress,
} from "@/features/account/data/services/account-addresses";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export type CustomerReturn = {
  id: string;
  orderId: string;
  status: "new" | "in_review" | "approved" | "rejected" | "completed";
  reason: string;
  itemSummary: string;
  customerNote: string;
  requestedAt: string;
};

export type CreateReturnPayload = {
  order_id: string;
  item_summary: string;
  reason: string;
  customer_note?: string;
};

export type CustomerAccountData = {
  profile: CustomerProfile;
  membershipTier: string;
  preferredStore: string;
  savedAddress: string;
  addresses: CustomerAddress[];
  returns: CustomerReturn[];
  storeName: string;
  supportEmail: string;
};

export type AccountApiAuth = {
  token: string;
  email: string;
  firstName?: string;
  lastName?: string;
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

type ApiAccountReturn = {
  id: string;
  order_id: string;
  status: CustomerReturn["status"];
  reason: string;
  item_summary: string;
  customer_note: string;
  requested_at: string;
};

type ApiPaginatedReturns = {
  results: ApiAccountReturn[];
};

type ApiStorefrontSettings = {
  store_name: string;
  support_email: string;
};

function mapApiReturnToCustomerReturn(api: ApiAccountReturn): CustomerReturn {
  return {
    id: api.id,
    orderId: api.order_id,
    status: api.status,
    reason: api.reason,
    itemSummary: api.item_summary,
    customerNote: api.customer_note,
    requestedAt: api.requested_at.slice(0, 10),
  };
}

async function fetchApiReturns(auth?: AccountApiAuth): Promise<CustomerReturn[]> {
  if (!API_BASE) return [];

  const response = await fetch(`${API_BASE}/account/returns/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...buildOptionalAuthHeader(auth),
    },
  });

  if (!response.ok) throw new Error(`account_returns_http_${response.status}`);

  const payload = (await response.json()) as ApiPaginatedReturns;
  return (payload.results ?? []).map(mapApiReturnToCustomerReturn);
}

async function fetchStorefrontSettings(): Promise<{
  storeName: string;
  supportEmail: string;
}> {
  if (!API_BASE) {
    return {
      storeName: "Sohe's Nation",
      supportEmail: "support@sohesnation.com",
    };
  }

  try {
    const response = await fetch(`${API_BASE}/settings/storefront/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {
        storeName: "Sohe's Nation",
        supportEmail: "support@sohesnation.com",
      };
    }

    const payload = (await response.json()) as ApiStorefrontSettings;
    return {
      storeName: payload.store_name || "Sohe's Nation",
      supportEmail: payload.support_email || "support@sohesnation.com",
    };
  } catch {
    return {
      storeName: "Sohe's Nation",
      supportEmail: "support@sohesnation.com",
    };
  }
}

export async function submitReturnRequest(
  payload: CreateReturnPayload,
  auth?: AccountApiAuth,
): Promise<CustomerReturn> {
  const response = await fetch(`${API_BASE}/account/returns/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...buildOptionalAuthHeader(auth),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    type ErrorBody = { error?: { code?: string; message?: string } };
    const body = await response.json().catch(() => ({})) as ErrorBody;
    const code = body?.error?.code ?? `http_${response.status}`;
    const message = body?.error?.message ?? "Request failed.";
    throw new ApiError(response.status, code, message);
  }

  const data = (await response.json()) as ApiAccountReturn;
  return mapApiReturnToCustomerReturn(data);
}

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
  is_return_eligible?: boolean;
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
    isReturnEligible: order.is_return_eligible ?? false,
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
  if (!auth?.token) {
    return {};
  }

  return { Authorization: `Bearer ${auth.token}` };
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

function buildProfile(auth?: AccountApiAuth, orders: OrderSummary[] = []): CustomerProfile {
  return {
    id: auth?.email?.trim() || "customer-account",
    email: auth?.email?.trim() || "",
    firstName: auth?.firstName?.trim() || "Customer",
    lastName: auth?.lastName?.trim() || "Account",
    defaultRegion: "NG",
    orders,
  };
}

export async function getCustomerAccount(auth?: AccountApiAuth): Promise<CustomerAccountData> {
  let orders: OrderSummary[] = [];
  const settings = await fetchStorefrontSettings();

  try {
    orders = await fetchApiOrders(auth);
  } catch {
    orders = [];
  }

  let returns: CustomerReturn[] = [];
  try {
    returns = await fetchApiReturns(auth);
  } catch {
    // fall through with empty list
  }

  let addresses: CustomerAddress[] = [];
  try {
    addresses = await listCustomerAddresses(auth);
  } catch {
    // fall through with empty list
  }

  const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;

  return {
    profile: buildProfile(auth, orders),
    membershipTier: "Member",
    preferredStore: "Not set yet",
    savedAddress: defaultAddress ? formatAddressLine(defaultAddress) : "No saved address available yet.",
    addresses,
    returns,
    storeName: settings.storeName,
    supportEmail: settings.supportEmail,
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
