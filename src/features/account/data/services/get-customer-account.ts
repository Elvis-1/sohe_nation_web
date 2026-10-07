import type {
  CustomerProfile,
  Money,
  OrderSummary,
  ProductReturnRule,
  StoreReturnRules,
} from "@/core/types/commerce";
import { ApiError } from "@/core/api/http-client";
import { DEFAULT_STORE_RETURN_RULES, toReturnRule, toStoreReturnRules } from "@/core/utils/return-rule";
import { fetchAllPages, pageQuery } from "@/core/api/paginate";
import { resolveApiBaseUrl } from "@/core/api/resolve-api-base-url";
import {
  formatAddressLine,
  listCustomerAddresses,
  type CustomerAddress,
} from "@/features/account/data/services/account-addresses";

const API_BASE = resolveApiBaseUrl();

export type ReturnReasonCode = "wrong_size" | "not_as_described" | "faulty" | "changed_mind" | "other";

export const RETURN_REASONS: Array<{ code: ReturnReasonCode; label: string }> = [
  { code: "wrong_size", label: "Wrong size or fit" },
  { code: "not_as_described", label: "Not as described" },
  { code: "faulty", label: "Faulty or damaged" },
  { code: "changed_mind", label: "Changed my mind" },
  { code: "other", label: "Other" },
];

export type CustomerReturnLine = {
  orderLineId: string;
  title: string;
  variantLabel: string;
  quantity: number;
  reasonLabel: string;
};

export type CustomerReturn = {
  id: string;
  orderId: string;
  status: "new" | "in_review" | "approved" | "rejected" | "completed";
  reason: string;
  itemSummary: string;
  customerNote: string;
  requestedAt: string;
  /** Empty for returns made before item-level returns; show `itemSummary` then. */
  lines: CustomerReturnLine[];
};

export type CreateReturnPayload = {
  order_id: string;
  lines: Array<{ order_line_id: string; quantity: number; reason_code: ReturnReasonCode }>;
  customer_note?: string;
};

/** A refused return request; `lineErrors` maps order line ids to why that item was refused. */
export class ReturnRequestError extends ApiError {
  constructor(
    status: number,
    code: string,
    message: string,
    public readonly lineErrors: Record<string, string>,
  ) {
    super(status, code, message);
    this.name = "ReturnRequestError";
  }
}

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
  returnRules: StoreReturnRules;
  loadErrors: AccountSection[];
};

export type AccountApiAuth = {
  token: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

/** Whether an order line can be returned now (from the API; it re-checks on submit). */
export type OrderLineReturnEligibility = {
  eligible: boolean;
  /** Only as "faulty or damaged": final sale, or the return window has closed. */
  faultyOnly: boolean;
  remainingQuantity: number;
  returnableUntil: string | null;
  message: string;
};

export type CustomerOrderLine = {
  id: string;
  title: string;
  variantLabel: string;
  quantity: number;
  unitPrice: Money;
  /** The rule the item was bought under. */
  returnRule: ProductReturnRule;
  returnEligibility: OrderLineReturnEligibility | null;
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
  /** Something in the order can be returned now, for any reason or as faulty. */
  canStartReturn: boolean;
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
  lines?: Array<{
    order_line_id: string;
    title: string;
    variant_label: string;
    quantity: number;
    reason_label: string;
  }>;
};

type ApiPaginatedReturns = {
  count?: number;
  results: ApiAccountReturn[];
};

type ApiStorefrontSettings = {
  store_name: string;
  support_email: string;
  returns?: { return_window_days?: number; final_sale_regions?: string[] };
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
    lines: (api.lines ?? []).map((line) => ({
      orderLineId: line.order_line_id,
      title: line.title,
      variantLabel: line.variant_label,
      quantity: line.quantity,
      reasonLabel: line.reason_label,
    })),
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

type AccountStoreSettings = {
  storeName: string;
  supportEmail: string;
  returnRules: StoreReturnRules;
};

const DEFAULT_ACCOUNT_STORE_SETTINGS: AccountStoreSettings = {
  storeName: "Sohe's Nation",
  supportEmail: "support@sohenation.com",
  returnRules: DEFAULT_STORE_RETURN_RULES,
};

async function fetchStorefrontSettings(): Promise<AccountStoreSettings> {
  if (!API_BASE) return DEFAULT_ACCOUNT_STORE_SETTINGS;

  try {
    const response = await fetch(`${API_BASE}/settings/storefront/`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) return DEFAULT_ACCOUNT_STORE_SETTINGS;

    const payload = (await response.json()) as ApiStorefrontSettings;
    return {
      storeName: payload.store_name || DEFAULT_ACCOUNT_STORE_SETTINGS.storeName,
      supportEmail: payload.support_email || DEFAULT_ACCOUNT_STORE_SETTINGS.supportEmail,
      returnRules: toStoreReturnRules(payload.returns),
    };
  } catch {
    return DEFAULT_ACCOUNT_STORE_SETTINGS;
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
    type ErrorBody = {
      error?: { code?: string; message?: string; lines?: Array<{ order_line_id: string; message: string }> };
    };
    const body = await response.json().catch(() => ({})) as ErrorBody;
    const code = body?.error?.code ?? `http_${response.status}`;
    const message = body?.error?.message ?? "Request failed.";
    const lineErrors = Object.fromEntries(
      (body?.error?.lines ?? []).map((line) => [line.order_line_id, line.message]),
    );
    throw new ReturnRequestError(response.status, code, message, lineErrors);
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
  can_report_faulty?: boolean;
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
  return_policy?: string;
  return_window_days?: number | null;
  return_eligibility?: {
    eligible: boolean;
    faulty_only: boolean;
    remaining_quantity: number;
    returnable_until: string | null;
    message: string;
  } | null;
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
    canReportFaulty: order.can_report_faulty ?? false,
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
    canStartReturn: Boolean(order.is_return_eligible || order.can_report_faulty),
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
      returnRule: toReturnRule(line.return_policy, line.return_window_days),
      returnEligibility: line.return_eligibility
        ? {
            eligible: line.return_eligibility.eligible,
            faultyOnly: line.return_eligibility.faulty_only,
            remainingQuantity: line.return_eligibility.remaining_quantity,
            returnableUntil: line.return_eligibility.returnable_until,
            message: line.return_eligibility.message,
          }
        : null,
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
    returnRules: settings.returnRules,
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
