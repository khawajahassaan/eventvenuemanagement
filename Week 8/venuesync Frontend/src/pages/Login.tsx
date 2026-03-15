import { Link, useNavigate, useLocation } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // If the user was redirected here by ProtectedRoute, send them back after login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * ─── BACKEND INTEGRATION ─────────────────────────────────────────────────
   * Calls POST /auth/login → { user, tokens }
   * On success, useAuth stores the token and user in localStorage.
   * Redirects based on the user's role returned from the server.
   *
   * The role selector below is for demo purposes only.
   * In production the role comes from the server — remove the selector.
   * ─────────────────────────────────────────────────────────────────────────
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });

      // After login, read the user role from auth context
      // The role is embedded in the JWT / returned by the server
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : null;
      const role = user?.role ?? "planner";

      const defaultDest = role === "admin" ? "/admin/dashboard"
        : role === "owner" ? "/owner/dashboard"
        : "/planner/dashboard";

      navigate(from ?? defaultDest, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error
        ? err.message
        : (err as { message?: string })?.message ?? "Login failed. Please check your credentials.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-semibold text-xl">VS</span>
            </div>
            <span className="text-2xl font-semibold text-gray-900">VenueSync</span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-4">Login to Your Account</h1>
          <p className="text-sm text-gray-600 mt-2">Access your venue management dashboard</p>
        </div>

        <Card className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                className="mt-1.5 bg-input-background"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1.5 bg-input-background"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Register here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
