/**
 * AuthContext
 *
 * Wraps the entire app and provides:
 *   - user: current User | null
 *   - login(), register(), logout()
 *   - isLoading: whether auth state is being resolved
 *
 * Usage:
 *   const { user, login, logout } = useAuth();
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authApi } from "../api/auth";
import type { User, LoginPayload, RegisterPayload } from "../types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate user from localStorage on mount
  useEffect(() => {
    const localUser = authApi.getLocalUser();
    if (localUser) {
      setUser(localUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const { user } = await authApi.login(payload);
    setUser(user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { user } = await authApi.register(payload);
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
