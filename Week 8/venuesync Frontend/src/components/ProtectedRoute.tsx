/**
 * ProtectedRoute
 *
 * Wraps any route that requires authentication.
 * - If not logged in → redirects to /login
 * - If logged in but wrong role → redirects to their own dashboard
 * - Shows a loading spinner while auth state resolves
 *
 * Usage in routes.tsx:
 *   { path: "/planner/dashboard", element: <ProtectedRoute role="planner"><PlannerDashboard /></ProtectedRoute> }
 */

import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If provided, only this role can access the route. Others are redirected to their own dashboard. */
  role?: UserRole;
}

const roleDashboard: Record<UserRole, string> = {
  planner: "/planner/dashboard",
  owner: "/owner/dashboard",
  admin: "/admin/dashboard",
};

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Still resolving auth from localStorage — show a spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated → send to login, preserve the intended destination
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Wrong role → redirect to the correct dashboard
  if (role && user.role !== role) {
    return <Navigate to={roleDashboard[user.role]} replace />;
  }

  return <>{children}</>;
}
