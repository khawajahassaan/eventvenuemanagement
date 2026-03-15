import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { PlannerDashboard } from "./pages/planner/PlannerDashboard";
import { VenueSearch } from "./pages/planner/VenueSearch";
import { VenueDetails } from "./pages/planner/VenueDetails";
import { BookingWorkflow } from "./pages/planner/BookingWorkflow";
import { PaymentInvoice } from "./pages/planner/PaymentInvoice";
import { GuestManagement } from "./pages/planner/GuestManagement";
import { BudgetResource } from "./pages/planner/BudgetResource";
import { EventSchedule } from "./pages/planner/EventSchedule";
import { OwnerDashboard } from "./pages/owner/OwnerDashboard";
import { ManageVenues } from "./pages/owner/ManageVenues";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { DisputeManagement } from "./pages/admin/DisputeManagement";
import { QRScanner } from "./pages/QRScanner";

export const router = createBrowserRouter([
  // Public
  { path: "/", Component: Landing },
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },

  // Planner (role guard)
  { path: "/planner/dashboard", element: <ProtectedRoute role="planner"><PlannerDashboard /></ProtectedRoute> },
  { path: "/planner/search",    element: <ProtectedRoute role="planner"><VenueSearch /></ProtectedRoute> },
  { path: "/planner/venue/:id", element: <ProtectedRoute role="planner"><VenueDetails /></ProtectedRoute> },
  { path: "/planner/booking/:id",  element: <ProtectedRoute role="planner"><BookingWorkflow /></ProtectedRoute> },
  { path: "/planner/payment/:id",  element: <ProtectedRoute role="planner"><PaymentInvoice /></ProtectedRoute> },
  { path: "/planner/guests/:eventId",   element: <ProtectedRoute role="planner"><GuestManagement /></ProtectedRoute> },
  { path: "/planner/budget/:eventId",   element: <ProtectedRoute role="planner"><BudgetResource /></ProtectedRoute> },
  { path: "/planner/schedule/:eventId", element: <ProtectedRoute role="planner"><EventSchedule /></ProtectedRoute> },

  // Owner (role guard)
  { path: "/owner/dashboard", element: <ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute> },
  { path: "/owner/venues",    element: <ProtectedRoute role="owner"><ManageVenues /></ProtectedRoute> },

  // Admin (role guard)
  { path: "/admin/dashboard", element: <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute> },
  { path: "/admin/disputes",  element: <ProtectedRoute role="admin"><DisputeManagement /></ProtectedRoute> },

  // Scanner (any authenticated user)
  { path: "/scanner", element: <ProtectedRoute><QRScanner /></ProtectedRoute> },
]);