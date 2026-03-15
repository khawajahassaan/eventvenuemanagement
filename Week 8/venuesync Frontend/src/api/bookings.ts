/**
 * Bookings API Service
 *
 * BACKEND ENDPOINTS EXPECTED:
 *   GET    /bookings                    → Booking[]      (filtered by role)
 *   GET    /bookings/:id               → Booking
 *   POST   /bookings                   → Booking        (planner only)
 *   PATCH  /bookings/:id/status        → Booking        (owner: approve/reject)
 *   DELETE /bookings/:id               → 200 OK         (planner: cancel)
 *   GET    /bookings/:id/invoice       → Invoice
 */

import { api } from "./client";
import type {
  Booking,
  CreateBookingPayload,
  UpdateBookingStatusPayload,
  Invoice,
} from "../types";

export const bookingsApi = {
  /**
   * Get all bookings for the authenticated user.
   * Backend should filter by role automatically (planner sees own, owner sees venue bookings).
   */
  getAll: (): Promise<Booking[]> => api.get("/bookings"),

  /** Get pending booking requests for owner's venues. */
  getPendingRequests: (): Promise<Booking[]> =>
    api.get("/bookings?status=pending&role=owner"),

  /** Get a single booking by ID. */
  getById: (id: string): Promise<Booking> => api.get(`/bookings/${id}`),

  /**
   * Submit a new booking request (Event Planner only).
   * Backend should validate date availability before creating.
   */
  create: (payload: CreateBookingPayload): Promise<Booking> =>
    api.post("/bookings", payload),

  /**
   * Approve or reject a booking request (Venue Owner only).
   * On approval, backend should block the date in the availability calendar.
   */
  updateStatus: (id: string, payload: UpdateBookingStatusPayload): Promise<Booking> =>
    api.patch(`/bookings/${id}/status`, payload),

  /**
   * Cancel a booking (Event Planner only).
   * Backend should calculate refund based on cancellation policy.
   */
  cancel: (id: string, reason?: string): Promise<void> =>
    api.delete(`/bookings/${id}${reason ? `?reason=${encodeURIComponent(reason)}` : ""}`),

  /** Get the invoice for a booking. */
  getInvoice: (id: string): Promise<Invoice> => api.get(`/bookings/${id}/invoice`),

  /**
   * Join the waitlist for a booked date.
   * Backend stores the waitlist entry and notifies planner when the date opens.
   */
  joinWaitlist: (venueId: string, date: string): Promise<void> =>
    api.post("/bookings/waitlist", { venueId, date }),
};
