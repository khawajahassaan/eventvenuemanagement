import { Link, useLocation, useNavigate } from "react-router";
import {
  Home, Search, Calendar, CreditCard, Users, DollarSign,
  Clock, Building2, LayoutDashboard, QrCode, AlertTriangle, LogOut,
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  role: "planner" | "owner" | "admin";
}

const plannerLinks = [
  { to: "/planner/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/planner/search", icon: Search, label: "Search Venues" },
  { to: "/planner/booking/1", icon: Calendar, label: "My Bookings" },
  { to: "/planner/payment/1", icon: CreditCard, label: "Payments" },
  { to: "/planner/guests/1", icon: Users, label: "Guest Management" },
  { to: "/planner/budget/1", icon: DollarSign, label: "Budget & Resources" },
  { to: "/planner/schedule/1", icon: Clock, label: "Event Schedule" },
];

const ownerLinks = [
  { to: "/owner/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/owner/venues", icon: Building2, label: "Manage Venues" },
];

const adminLinks = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/disputes", icon: AlertTriangle, label: "Disputes" },
  { to: "/scanner", icon: QrCode, label: "QR Scanner" },
];

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const links = role === "planner" ? plannerLinks : role === "owner" ? ownerLinks : adminLinks;

  /**
   * ─── BACKEND INTEGRATION ─────────────────────────────────────────────────
   * Calls POST /auth/logout (clears server-side session if applicable),
   * then clears local tokens via useAuth().
   * ─────────────────────────────────────────────────────────────────────────
   */
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground min-h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
            <span className="text-primary font-semibold text-xl">VS</span>
          </div>
          <span className="text-xl font-semibold">VenueSync</span>
        </Link>
      </div>

      {/* User info */}
      {user && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs opacity-70 truncate">{user.email}</p>
          <span className="text-xs opacity-60 capitalize">{user.role}</span>
        </div>
      )}

      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              location.pathname === link.to ||
              location.pathname.startsWith(link.to.replace(/\/\d+$/, ""));

            return (
              <Link key={link.to} to={link.to}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
