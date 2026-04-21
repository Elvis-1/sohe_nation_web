import type { RegionCode } from "@/core/types/commerce";
import { resolveApiBaseUrl } from "@/core/api/resolve-api-base-url";

import type { AccountApiAuth } from "./get-customer-account";

const API_BASE = resolveApiBaseUrl();

export type CustomerAddress = {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: RegionCode;
  isDefault: boolean;
};

export type CustomerAddressInput = {
  label?: string;
  recipientName: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode?: string;
  countryCode: RegionCode;
  isDefault?: boolean;
};

type ApiAddress = {
  id: string;
  label: string;
  recipient_name: string;
  phone: string;
  line_1: string;
  line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country_code: RegionCode;
  is_default: boolean;
};

type ApiAddressList = {
  results: ApiAddress[];
};

type ApiErrorBody = {
  error?: {
    message?: string;
    detail?: Record<string, string[]>;
  };
};

function buildAuthHeader(auth?: AccountApiAuth): Record<string, string> {
  if (!auth?.token) {
    return {};
  }
  return { Authorization: `Bearer ${auth.token}` };
}

function mapApiAddress(address: ApiAddress): CustomerAddress {
  return {
    id: address.id,
    label: address.label,
    recipientName: address.recipient_name,
    phone: address.phone,
    line1: address.line_1,
    line2: address.line_2,
    city: address.city,
    state: address.state,
    postalCode: address.postal_code,
    countryCode: address.country_code,
    isDefault: address.is_default,
  };
}

function mapInput(input: CustomerAddressInput) {
  return {
    label: input.label ?? "",
    recipient_name: input.recipientName,
    phone: input.phone ?? "",
    line_1: input.line1,
    line_2: input.line2 ?? "",
    city: input.city,
    state: input.state,
    postal_code: input.postalCode ?? "",
    country_code: input.countryCode,
    is_default: Boolean(input.isDefault),
  };
}

async function extractErrorMessage(response: Response, fallback: string): Promise<string> {
  const payload = (await response.json().catch(() => null)) as ApiErrorBody | null;
  if (payload?.error?.message) {
    return payload.error.message;
  }
  const firstDetail = payload?.error?.detail
    ? Object.values(payload.error.detail).flat()[0]
    : null;
  if (firstDetail) {
    return firstDetail;
  }
  return fallback;
}

export async function listCustomerAddresses(auth?: AccountApiAuth): Promise<CustomerAddress[]> {
  const response = await fetch(`${API_BASE}/account/addresses/`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeader(auth),
    },
  });
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, "Unable to load saved addresses."));
  }

  const payload = (await response.json()) as ApiAddressList;
  return (payload.results ?? []).map(mapApiAddress);
}

export async function createCustomerAddress(
  input: CustomerAddressInput,
  auth?: AccountApiAuth,
): Promise<CustomerAddress> {
  const response = await fetch(`${API_BASE}/account/addresses/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeader(auth),
    },
    body: JSON.stringify(mapInput(input)),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, "Unable to save this address right now."));
  }
  return mapApiAddress((await response.json()) as ApiAddress);
}

export async function updateCustomerAddress(
  addressId: string,
  input: Partial<CustomerAddressInput>,
  auth?: AccountApiAuth,
): Promise<CustomerAddress> {
  const payload: Record<string, string | boolean> = {};
  if (input.label !== undefined) payload.label = input.label;
  if (input.recipientName !== undefined) payload.recipient_name = input.recipientName;
  if (input.phone !== undefined) payload.phone = input.phone;
  if (input.line1 !== undefined) payload.line_1 = input.line1;
  if (input.line2 !== undefined) payload.line_2 = input.line2;
  if (input.city !== undefined) payload.city = input.city;
  if (input.state !== undefined) payload.state = input.state;
  if (input.postalCode !== undefined) payload.postal_code = input.postalCode;
  if (input.countryCode !== undefined) payload.country_code = input.countryCode;
  if (input.isDefault !== undefined) payload.is_default = input.isDefault;

  const response = await fetch(`${API_BASE}/account/addresses/${addressId}/`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeader(auth),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, "Unable to update this address right now."));
  }
  return mapApiAddress((await response.json()) as ApiAddress);
}

export async function deleteCustomerAddress(addressId: string, auth?: AccountApiAuth): Promise<void> {
  const response = await fetch(`${API_BASE}/account/addresses/${addressId}/`, {
    method: "DELETE",
    credentials: "include",
    headers: buildAuthHeader(auth),
  });
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, "Unable to delete this address right now."));
  }
}

export async function setDefaultCustomerAddress(
  addressId: string,
  auth?: AccountApiAuth,
): Promise<CustomerAddress> {
  const response = await fetch(`${API_BASE}/account/addresses/${addressId}/set-default/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeader(auth),
    },
  });
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, "Unable to set this as default right now."));
  }
  return mapApiAddress((await response.json()) as ApiAddress);
}

export function formatAddressLine(address: CustomerAddress): string {
  return [address.line1, address.line2, `${address.city}, ${address.state}`, address.postalCode]
    .filter(Boolean)
    .join(", ");
}
