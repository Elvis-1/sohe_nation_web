"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "sohe-storefront-account-session";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export type AccountSession = {
  isAuthenticated: boolean;
  token: string;
  expiresAt: number;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
};

type AccountAuthInput = {
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

type AccountAuthContextValue = {
  session: AccountSession | null;
  isAuthenticated: boolean;
  isReady: boolean;
  authError: string | null;
  signIn: (input: AccountAuthInput) => Promise<void>;
  register: (input: AccountAuthInput) => Promise<void>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string>;
  confirmPasswordReset: (token: string, password: string) => Promise<string>;
  resendEmailVerification: (email: string) => Promise<string>;
  confirmEmailVerification: (token: string) => Promise<string>;
};

const AccountAuthContext = createContext<AccountAuthContextValue | null>(null);

function readStoredSession(): AccountSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) {
      return null;
    }

    const parsed = JSON.parse(value) as AccountSession;
    if (parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

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

async function postAuth(path: string, body: Record<string, string>) {
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

  return payload as AuthPayload;
}

async function postAnonymous(path: string, body: Record<string, string>) {
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

export function AccountAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AccountSession | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function restoreSession() {
      const stored = readStoredSession();
      if (!stored) {
        if (isActive) {
          setSession(stored);
          setIsReady(true);
        }
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/customer/session/`, {
          headers: {
            Authorization: `Bearer ${stored.token}`,
          },
        });

        if (!response.ok) {
          window.localStorage.removeItem(STORAGE_KEY);
          if (isActive) {
            setSession(null);
            setIsReady(true);
          }
          return;
        }

        const payload = (await response.json()) as AuthPayload;
        const nextSession = toSession(payload);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));

        if (isActive) {
          setSession(nextSession);
          setIsReady(true);
        }
      } catch {
        if (isActive) {
          setSession(stored);
          setIsReady(true);
        }
      }
    }

    void restoreSession();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (session) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [isReady, session]);

  const value = useMemo<AccountAuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session?.isAuthenticated),
      isReady,
      authError,
      signIn: async (input) => {
        setAuthError(null);
        try {
          const payload = await postAuth("/auth/customer/login/", {
            email: input.email.trim(),
            password: input.password,
          });
          setSession(toSession(payload));
        } catch (error) {
          setSession(null);
          setAuthError(error instanceof Error ? error.message : "Unable to sign in.");
          throw error;
        }
      },
      register: async (input) => {
        setAuthError(null);
        try {
          const payload = await postAuth("/auth/customer/register/", {
            email: input.email.trim(),
            password: input.password,
            first_name: input.firstName?.trim() || "Customer",
            last_name: input.lastName?.trim() || "Account",
          });
          setSession(toSession(payload));
        } catch (error) {
          setSession(null);
          setAuthError(error instanceof Error ? error.message : "Unable to register.");
          throw error;
        }
      },
      signOut: async () => {
        setAuthError(null);
        if (session?.token) {
          await fetch(`${API_BASE}/auth/customer/session/`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${session.token}`,
            },
          }).catch(() => undefined);
        }
        setSession(null);
      },
      requestPasswordReset: async (email: string) => {
        setAuthError(null);
        try {
          return await postAnonymous("/auth/customer/password-reset/request/", {
            email: email.trim(),
          });
        } catch (error) {
          setAuthError(error instanceof Error ? error.message : "Unable to request password reset.");
          throw error;
        }
      },
      confirmPasswordReset: async (token: string, password: string) => {
        setAuthError(null);
        try {
          return await postAnonymous("/auth/customer/password-reset/confirm/", {
            token: token.trim(),
            password,
          });
        } catch (error) {
          setAuthError(error instanceof Error ? error.message : "Unable to reset password.");
          throw error;
        }
      },
      resendEmailVerification: async (email: string) => {
        setAuthError(null);
        try {
          return await postAnonymous("/auth/customer/email-verification/resend/", {
            email: email.trim(),
          });
        } catch (error) {
          setAuthError(error instanceof Error ? error.message : "Unable to resend verification email.");
          throw error;
        }
      },
      confirmEmailVerification: async (token: string) => {
        setAuthError(null);
        try {
          const message = await postAnonymous("/auth/customer/email-verification/confirm/", {
            token: token.trim(),
          });
          setSession((current) =>
            current
              ? {
                  ...current,
                  emailVerified: true,
                }
              : current,
          );
          return message;
        } catch (error) {
          setAuthError(error instanceof Error ? error.message : "Unable to verify email.");
          throw error;
        }
      },
    }),
    [authError, isReady, session],
  );

  return <AccountAuthContext.Provider value={value}>{children}</AccountAuthContext.Provider>;
}

export function useAccountAuth() {
  const context = useContext(AccountAuthContext);

  if (!context) {
    throw new Error("useAccountAuth must be used within AccountAuthProvider");
  }

  return context;
}
