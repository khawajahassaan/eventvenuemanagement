import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { useAuth } from "../context/AuthContext";

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "planner" as "planner" | "owner",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  /**
   * ─── BACKEND INTEGRATION ─────────────────────────────────────────────────
   * Calls POST /auth/register → { user, tokens }
   * Backend should send a verification email after registration.
   * On success, user is logged in automatically and redirected to dashboard.
   * ─────────────────────────────────────────────────────────────────────────
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register(formData);
      if (formData.role === "owner") navigate("/owner/dashboard");
      else navigate("/planner/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error
        ? err.message
        : (err as { message?: string })?.message ?? "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-semibold text-xl">VS</span>
            </div>
            <span className="text-2xl font-semibold text-gray-900">VenueSync</span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-4">Create Your Account</h1>
          <p className="text-sm text-gray-600 mt-2">Join our venue management platform</p>
        </div>

        <Card className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="mt-1.5 bg-input-background"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter your full legal name</p>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                className="mt-1.5 bg-input-background"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">We'll send verification to this email</p>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+92 300 1234567"
                className="mt-1.5 bg-input-background"
                value={formData.phone}
                onChange={handleChange}
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
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <Label htmlFor="role">Register As</Label>
              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1.5 w-full px-3 py-2 bg-input-background border border-gray-300 rounded-md"
              >
                <option value="planner">Event Planner</option>
                <option value="owner">Venue Owner</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Select your account type</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
