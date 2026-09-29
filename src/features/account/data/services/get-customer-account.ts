import type { CustomerProfile, Money, OrderSummary } from "@/core/types/commerce";
import { ApiError } from "@/core/api/http-client";
import { fetchAllPages, pageQuery } from "@/core/api/paginate";
import { resolveApiBaseUrl } from "@/core/api/resolve-api-base-url";
import {
  formatAddressLine,
  listCustomerAddresses,
  type CustomerAddress,
} from "@/features/account/data/services/account-addresses";

const API_BASE = resolveApiBaseUrl();

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

/** Account sections whose API read failed; the matching lists are empty, not "none". */
export type AccountSection = "orders" | "returns" | "addresses";

export type CustomerAccountData = {
  profile: CustomerProfile;
  membershipTier: string;
  preferredStore: string;
  savedAddress: string;
  addresses: CustomerAddress[];
  returns: CustomerReturn[];
  storeName: string;
  supportEmail: string;
  loadErrors: AccountSection[];
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

/** Address snapshotted onto the order at checkout. */
export type OrderShippingDetails = {
  recipientName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
};

export type CustomerOrderDetail = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderSummary["status"];
  total: Money;
  shippingAddress: string;
  /** Null for orders placed before structured snapshots; show `shippingAddress` then. */
  shippingDetails: OrderShippingDetails | null;
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
  count?: number;
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
  const returns = await fetchAllPages(async (page, pageSize) => {
    const response = await fetch(`${API_BASE}/account/returns/${pageQuery(page, pageSize)}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...buildOptionalAuthHeader(auth),
      },
    });

    if (!response.ok) throw new Error(`account_returns_http_${response.status}`);

    return (await response.json()) as ApiPaginatedReturns;
  });
  return returns.map(mapApiReturnToCustomerReturn);
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
  count?: number;
  results: ApiAccountOrder[];
};

type ApiAccountOrderLine = {
  id: string;
  title: string;
  variant_label: string;
  quantity: number;
  unit_price: ApiMoney;
};

type ApiShippingDetails = {
  recipient_name: string;
  phone: string;
  line_1: string;
  line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country_code: string;
};

type ApiAccountOrderDetail = ApiAccountOrder & {
  shipping_address: string;
  shipping_details?: ApiShippingDetails | null;
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
    shippingDetails: order.shipping_details
      ? {
          recipientName: order.shipping_details.recipient_name,
          phone: order.shipping_details.phone,
          line1: order.shipping_details.line_1,
          line2: order.shipping_details.line_2,
          city: order.shipping_details.city,
          state: order.shipping_details.state,
          postalCode: order.shipping_details.postal_code,
          countryCode: order.shipping_details.country_code,
        }
      : null,
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

  const orders = await fetchAllPages(async (page, pageSize) => {
    const response = await fetch(`${API_BASE}/account/orders/${pageQuery(page, pageSize)}`, {
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

    return (await response.json()) as ApiPaginatedOrders;
  });
  return orders.map(mapApiOrderToSummary);
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
  const [settings, ordersResult, returnsResult, addressesResult] = await Promise.all([
    fetchStorefrontSettings(),
    fetchApiOrders(auth).then(
      (value) => ({ ok: true as const, value }),
      () => ({ ok: false as const }),
    ),
    fetchApiReturns(auth).then(
      (value) => ({ ok: true as const, value }),
      () => ({ ok: false as const }),
    ),
    listCustomerAddresses(auth).then(
      (value) => ({ ok: true as const, value }),
      () => ({ ok: false as const }),
    ),
  ]);

  // A failed section keeps an empty list but is reported, so the UI never shows it as "none".
  const loadErrors: AccountSection[] = [];
  if (!ordersResult.ok) loadErrors.push("orders");
  if (!returnsResult.ok) loadErrors.push("returns");
  if (!addressesResult.ok) loadErrors.push("addresses");

  const orders: OrderSummary[] = ordersResult.ok ? ordersResult.value : [];
  const returns: CustomerReturn[] = returnsResult.ok ? returnsResult.value : [];
  const addresses: CustomerAddress[] = addressesResult.ok ? addressesResult.value : [];

  const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;

  return {
    profile: buildProfile(auth, orders),
    membershipTier: "Member",
    preferredStore: "Not set yet",
    savedAddress: defaultAddress
      ? formatAddressLine(defaultAddress)
      : addressesResult.ok
        ? "No saved address available yet."
        : "Saved addresses could not be loaded.",
    addresses,
    returns,
    storeName: settings.storeName,
    supportEmail: settings.supportEmail,
    loadErrors,
  };
}

export async function getCustomerOrderDetail(
  orderId: string,
  auth?: AccountApiAuth,
): Promise<CustomerOrderDetail | null> {
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
