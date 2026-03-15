/**
 * API Client
 *
 * HOW TO CONNECT YOUR BACKEND:
 * 1. Set the BASE_URL below to your backend URL (e.g. "http://localhost:3000/api")
 * 2. The client automatically attaches the JWT token from localStorage on every request
 * 3. On 401, it clears auth and redirects to /login
 *
 * All API service files import from here — you only need to change BASE_URL.
 */

export const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// ─── Token helpers ────────────────────────────────────────────────────────────

export const getAccessToken = () => localStorage.getItem("access_token");
export const setAccessToken = (token: string) => localStorage.setItem("access_token", token);
export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, headers = {}, ...rest } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
  });

  // Handle auth errors
  if (response.status === 401) {
    clearTokens();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      message: data?.message ?? "An unexpected error occurred",
      statusCode: response.status,
      errors: data?.errors,
    };
  }

  return data as T;
}

// ─── Convenience helpers ──────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string, opts?: RequestOptions) =>
    apiRequest<T>(path, { method: "GET", ...opts }),

  post: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    apiRequest<T>(path, { method: "POST", body: JSON.stringify(body), ...opts }),

  put: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    apiRequest<T>(path, { method: "PUT", body: JSON.stringify(body), ...opts }),

  patch: <T>(path: string, body: unknown, opts?: RequestOptions) =>
    apiRequest<T>(path, { method: "PATCH", body: JSON.stringify(body), ...opts }),

  delete: <T>(path: string, opts?: RequestOptions) =>
    apiRequest<T>(path, { method: "DELETE", ...opts }),
};
