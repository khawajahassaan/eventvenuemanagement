/**
 * Auth API Service
 *
 * BACKEND ENDPOINTS EXPECTED:
 *   POST /auth/login     → { user, tokens: { accessToken, refreshToken } }
 *   POST /auth/register  → { user, tokens: { accessToken, refreshToken } }
 *   POST /auth/logout    → 200 OK
 *   GET  /auth/me        → { user }
 */

import { api, setAccessToken, clearTokens } from "./client";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "../types";

export const authApi = {
  /**
   * Login with email + password.
   * Automatically stores the access token in localStorage.
   */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/login", payload, {
      skipAuth: true,
    });
    setAccessToken(res.tokens.accessToken);
    localStorage.setItem("refresh_token", res.tokens.refreshToken);
    localStorage.setItem("user", JSON.stringify(res.user));
    return res;
  },

  /**
   * Register a new user account.
   * Automatically stores the access token in localStorage.
   */
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/auth/register", payload, {
      skipAuth: true,
    });
    setAccessToken(res.tokens.accessToken);
    localStorage.setItem("refresh_token", res.tokens.refreshToken);
    localStorage.setItem("user", JSON.stringify(res.user));
    return res;
  },

  /**
   * Logout. Clears tokens from localStorage.
   */
  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout", {});
    } finally {
      clearTokens();
    }
  },

  /**
   * Fetch the current authenticated user.
   */
  me: (): Promise<{ user: User }> => api.get("/auth/me"),

  /**
   * Read the user from localStorage (no network call).
   */
  getLocalUser: (): User | null => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  },
};
