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
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export type MockAccountSession = {
  isAuthenticated: boolean;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
};

type AccountAuthMode = "sign-in" | "register";

type AccountAuthInput = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

type AccountAuthContextValue = {
  session: MockAccountSession | null;
  isAuthenticated: boolean;
  isReady: boolean;
  authError: string | null;
  signIn: (input: AccountAuthInput) => Promise<void>;
  register: (input: AccountAuthInput) => Promise<void>;
  signOut: () => void;
};

const AccountAuthContext = createContext<AccountAuthContextValue | null>(null);

function readStoredSession(): MockAccountSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);

    if (!value) {
      return null;
    }

    const parsed = JSON.parse(value);

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return parsed as MockAccountSession;
  } catch {
    return null;
  }
}

function buildSession(input: AccountAuthInput, mode: AccountAuthMode): MockAccountSession {
  return {
    isAuthenticated: true,
    email: input.email.trim(),
    // Temporary bridge for Slice 2: keep credentials in mocked session so
    // account/order API calls can be scoped to the signed-in customer.
    password: input.password,
    firstName: input.firstName?.trim() || (mode === "register" ? "New" : "Ada"),
    lastName: input.lastName?.trim() || (mode === "register" ? "Member" : "Okafor"),
  };
}

async function verifyAccountCredentials(input: AccountAuthInput): Promise<void> {
  if (!API_BASE) {
    return;
  }

  if (!input.email.trim() || !input.password) {
    throw new Error("Enter both email and password.");
  }

  const encoded = window.btoa(`${input.email.trim()}:${input.password}`);
  const response = await fetch(`${API_BASE}/account/orders/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${encoded}`,
    },
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("Invalid account credentials.");
  }

  if (!response.ok) {
    throw new Error("Account sign-in is temporarily unavailable.");
  }
}

export function AccountAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<MockAccountSession | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setSession(readStoredSession());
      setIsReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
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
          await verifyAccountCredentials(input);
          setSession(buildSession(input, "sign-in"));
        } catch (error) {
          setSession(null);
          setAuthError(error instanceof Error ? error.message : "Unable to sign in.");
          throw error;
        }
      },
      register: async (input) => {
        setAuthError(null);
        setSession(buildSession(input, "register"));
      },
      signOut: () => {
        setAuthError(null);
        setSession(null);
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
