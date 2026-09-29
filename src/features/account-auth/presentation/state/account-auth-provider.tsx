"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as customerAuth from "@/features/account-auth/data/services/customer-auth";
import type {
  AccountSession,
  CustomerCredentials,
} from "@/features/account-auth/data/services/customer-auth";

export type { AccountSession };

const STORAGE_KEY = "sohe-storefront-account-session";

type AccountAuthContextValue = {
  session: AccountSession | null;
  isAuthenticated: boolean;
  isReady: boolean;
  authError: string | null;
  signIn: (input: CustomerCredentials) => Promise<void>;
  register: (input: CustomerCredentials) => Promise<void>;
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
        const nextSession = await customerAuth.fetchCustomerSession(stored.token);

        if (!nextSession) {
          window.localStorage.removeItem(STORAGE_KEY);
          if (isActive) {
            setSession(null);
            setIsReady(true);
          }
          return;
        }

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
          setSession(await customerAuth.signInCustomer(input));
        } catch (error) {
          setSession(null);
          setAuthError(error instanceof Error ? error.message : "Unable to sign in.");
          throw error;
        }
      },
      register: async (input) => {
        setAuthError(null);
        try {
          setSession(await customerAuth.registerCustomer(input));
        } catch (error) {
          setSession(null);
          setAuthError(error instanceof Error ? error.message : "Unable to register.");
          throw error;
        }
      },
      signOut: async () => {
        setAuthError(null);
        if (session?.token) {
          await customerAuth.endCustomerSession(session.token);
        }
        setSession(null);
      },
      requestPasswordReset: async (email: string) => {
        setAuthError(null);
        try {
          return await customerAuth.requestPasswordReset(email);
        } catch (error) {
          setAuthError(error instanceof Error ? error.message : "Unable to request password reset.");
          throw error;
        }
      },
      confirmPasswordReset: async (token: string, password: string) => {
        setAuthError(null);
        try {
          return await customerAuth.confirmPasswordReset(token, password);
        } catch (error) {
          setAuthError(error instanceof Error ? error.message : "Unable to reset password.");
          throw error;
        }
      },
      resendEmailVerification: async (email: string) => {
        setAuthError(null);
        try {
          return await customerAuth.resendEmailVerification(email);
        } catch (error) {
          setAuthError(error instanceof Error ? error.message : "Unable to resend verification email.");
          throw error;
        }
      },
      confirmEmailVerification: async (token: string) => {
        setAuthError(null);
        try {
          const message = await customerAuth.confirmEmailVerification(token);
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
