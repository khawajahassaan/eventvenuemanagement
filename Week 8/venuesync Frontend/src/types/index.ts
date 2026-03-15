// ─── Auth ────────────────────────────────────────────────────────────────────

export type UserRole = "planner" | "owner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "planner" | "owner";
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ─── Venues ──────────────────────────────────────────────────────────────────

export interface Venue {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  capacity: number;
  pricePerDay: number;
  amenities: string[];
  images: string[];
  ownerId: string;
  status: "active" | "inactive" | "maintenance";
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CreateVenuePayload {
  name: string;
  description: string;
  location: string;
  city: string;
  capacity: number;
  pricePerDay: number;
  amenities: string[];
  venueType: string;
}

export interface VenueSearchParams {
  location?: string;
  date?: string;
  capacity?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  page?: number;
  limit?: number;
}

export interface VenueAvailability {
  venueId: string;
  month: number;
  year: number;
  bookedDates: number[];
  unavailableDates: number[];
}

// ─── Bookings ────────────────────────────────────────────────────────────────

export type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  plannerId: string;
  plannerName: string;
  eventName: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  specialRequirements?: string;
  status: BookingStatus;
  totalAmount: number;
  serviceFee: number;
  tax: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingPayload {
  venueId: string;
  eventName: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  specialRequirements?: string;
}

export interface UpdateBookingStatusPayload {
  status: "approved" | "rejected";
  rejectionReason?: string;
}

// ─── Payments ────────────────────────────────────────────────────────────────

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  description: string;
  method: string;
  status: PaymentStatus;
  date: string;
}

export interface Invoice {
  invoiceNumber: string;
  bookingId: string;
  venue: string;
  eventDate: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paid: number;
  balance: number;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// ─── Guests ───────────────────────────────────────────────────────────────────

export type RsvpStatus = "pending" | "confirmed" | "declined";

export interface Guest {
  id: string;
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  category?: string;
  rsvp: RsvpStatus;
  qrCode?: string;
  qrGenerated: boolean;
  entryStatus: "not_entered" | "entered";
  entryTime?: string;
}

export interface CreateGuestPayload {
  name: string;
  email: string;
  phone: string;
  category?: string;
}

export interface QRValidationResult {
  status: "valid" | "invalid" | "already_entered";
  guestName?: string;
  eventName?: string;
  ticketId?: string;
  entryTime?: string;
}

// ─── Budget & Vendors ────────────────────────────────────────────────────────

export interface BudgetCategory {
  id: string;
  bookingId: string;
  category: string;
  planned: number;
  actual: number;
}

export interface Vendor {
  id: string;
  bookingId: string;
  name: string;
  service: string;
  contact: string;
  status: "confirmed" | "pending";
  amount: number;
}

export interface Resource {
  id: string;
  venueId: string;
  item: string;
  quantity: number;
  assigned: number;
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

export interface ScheduleItem {
  id: string;
  bookingId: string;
  time: string;
  duration: number;
  activity: string;
  responsible: string;
  order: number;
}

// ─── Disputes ─────────────────────────────────────────────────────────────────

export type DisputeStatus = "open" | "in_review" | "resolved" | "rejected";
export type DisputePriority = "critical" | "high" | "medium" | "low";

export interface Dispute {
  id: string;
  bookingId: string;
  raisedBy: string;
  against: string;
  issue: string;
  description: string;
  amount: number;
  refundRequested: number;
  status: DisputeStatus;
  priority: DisputePriority;
  date: string;
  lastUpdate: string;
  resolutionNotes?: string;
  approvedRefund?: number;
}

export interface ResolveDisputePayload {
  status: DisputeStatus;
  approvedRefund?: number;
  resolutionNotes: string;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalVenues: number;
  totalBookings: number;
  totalRevenue: number;
  monthlyRevenue: MonthlyRevenue[];
  bookingsByStatus: BookingStatusBreakdown[];
  topVenues: TopVenue[];
  recentActivity: ActivityLog[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  bookings: number;
}

export interface BookingStatusBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface TopVenue {
  name: string;
  bookings: number;
  revenue: number;
}

export interface ActivityLog {
  id: number;
  type: "booking" | "venue" | "payment" | "dispute";
  user: string;
  action: string;
  venue: string;
  time: string;
}

// ─── API Response Wrappers ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
