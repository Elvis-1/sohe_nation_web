/**
 * Customer auth API calls (`/api/v1/auth/customer/*`).
 * Normalizes backend payloads into `AccountSession` so presentation code never sees raw shapes.
 */

import { resolveApiBaseUrl } from "@/core/api/resolve-api-base-url";

const API_BASE = resolveApiBaseUrl({ preferInternal: false });

export type AccountSession = {
  isAuthenticated: boolean;
  token: string;
  expiresAt: number;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
};

export type CustomerCredentials = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

type AuthPayload = {
  token: string;
  expires_at: string;
  user: {
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    email_verified: boolean;
  };
};

type ApiErrorPayload = {
  error?: {
    message?: string;
  };
};

function toSession(payload: AuthPayload): AccountSession {
  return {
    isAuthenticated: true,
    token: payload.token,
    expiresAt: new Date(payload.expires_at).getTime(),
    email: payload.user.email,
    firstName: payload.user.first_name || "Customer",
    lastName: payload.user.last_name || "Account",
    emailVerified: payload.user.email_verified,
  };
}

async function postAuth(path: string, body: Record<string, string>): Promise<AccountSession> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as AuthPayload | ApiErrorPayload | null;

  if (!response.ok || !payload || "error" in payload) {
    throw new Error(
      payload && "error" in payload
        ? payload.error?.message ?? "Unable to complete account auth."
        : "Unable to complete account auth.",
    );
  }

  return toSession(payload as AuthPayload);
}

async function postAnonymous(path: string, body: Record<string, string>): Promise<string> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as
    | { message?: string }
    | ApiErrorPayload
    | null;

  if (!response.ok) {
    throw new Error(
      payload && "error" in payload
        ? payload.error?.message ?? "Unable to complete this request."
        : "Unable to complete this request.",
    );
  }

  if (payload && "message" in payload && typeof payload.message === "string") {
    return payload.message;
  }
  return "Request completed.";
}

export function signInCustomer(credentials: CustomerCredentials): Promise<AccountSession> {
  return postAuth("/auth/customer/login/", {
    email: credentials.email.trim(),
    password: credentials.password,
  });
}

export function registerCustomer(credentials: CustomerCredentials): Promise<AccountSession> {
  return postAuth("/auth/customer/register/", {
    email: credentials.email.trim(),
    password: credentials.password,
    first_name: credentials.firstName?.trim() || "Customer",
    last_name: credentials.lastName?.trim() || "Account",
  });
}

/**
 * Re-validate a stored token.
 * Returns null when the API rejects it; throws on network failure so callers can keep the stored session.
 */
export async function fetchCustomerSession(token: string): Promise<AccountSession | null> {
  const response = await fetch(`${API_BASE}/auth/customer/session/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return toSession((await response.json()) as AuthPayload);
}

/** Best-effort server sign-out; the local session is cleared regardless. */
export async function endCustomerSession(token: string): Promise<void> {
  await fetch(`${API_BASE}/auth/customer/session/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(() => undefined);
}

export function requestPasswordReset(email: string): Promise<string> {
  return postAnonymous("/auth/customer/password-reset/request/", { email: email.trim() });
}

export function confirmPasswordReset(token: string, password: string): Promise<string> {
  return postAnonymous("/auth/customer/password-reset/confirm/", { token: token.trim(), password });
}

export function resendEmailVerification(email: string): Promise<string> {
  return postAnonymous("/auth/customer/email-verification/resend/", { email: email.trim() });
}

export function confirmEmailVerification(token: string): Promise<string> {
  return postAnonymous("/auth/customer/email-verification/confirm/", { token: token.trim() });
}
