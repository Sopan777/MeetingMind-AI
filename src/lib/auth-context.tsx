"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface User {
  name: string;
  email: string;
  avatar: string | null;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const AUTH_STORAGE_KEY = "meetingmind_auth";

const DEFAULT_USER: User = {
  name: "Alex Johnson",
  email: "alex@meetingmind.ai",
  avatar: null,
  role: "Admin",
};

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Helper ──────────────────────────────────────────────────────────────────

function delay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadStoredAuth(): AuthState {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false, isLoading: true };
  }
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as User;
      return { user: parsed, isAuthenticated: true, isLoading: false };
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  return { user: null, isAuthenticated: false, isLoading: false };
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = loadStoredAuth();
    setUser(stored.user);
    setIsAuthenticated(stored.isAuthenticated);
    setIsLoading(false);
  }, []);

  const persistUser = useCallback((u: User) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    setIsAuthenticated(true);
  }, []);

  const login = useCallback(
    async (email: string, _password: string) => {
      setIsLoading(true);
      await delay();

      // For the demo, any valid-looking email works — use default user data
      // but honour the email provided.
      const loggedInUser: User = {
        ...DEFAULT_USER,
        email,
      };

      persistUser(loggedInUser);
      setIsLoading(false);
    },
    [persistUser],
  );

  const signup = useCallback(
    async (name: string, email: string, _password: string) => {
      setIsLoading(true);
      await delay();

      const newUser: User = {
        name,
        email,
        avatar: null,
        role: "Member",
      };

      persistUser(newUser);
      setIsLoading(false);
    },
    [persistUser],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const forgotPassword = useCallback(async (_email: string) => {
    setIsLoading(true);
    await delay();
    // Simulate sending a reset email
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, signup, logout, forgotPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider />");
  }
  return ctx;
}
