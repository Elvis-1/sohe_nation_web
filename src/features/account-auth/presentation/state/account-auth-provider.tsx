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

export type MockAccountSession = {
  isAuthenticated: boolean;
  email: string;
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
    email: input.email,
    firstName: input.firstName?.trim() || (mode === "register" ? "New" : "Ada"),
    lastName: input.lastName?.trim() || (mode === "register" ? "Member" : "Okafor"),
  };
}

export function AccountAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<MockAccountSession | null>(null);
  const [isReady, setIsReady] = useState(false);

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
      signIn: async (input) => {
        setSession(buildSession(input, "sign-in"));
      },
      register: async (input) => {
        setSession(buildSession(input, "register"));
      },
      signOut: () => {
        setSession(null);
      },
    }),
    [isReady, session],
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
