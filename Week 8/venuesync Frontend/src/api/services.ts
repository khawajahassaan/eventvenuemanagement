/**
 * Guests API Service
 *
 * BACKEND ENDPOINTS EXPECTED:
 *   GET    /bookings/:bookingId/guests           → Guest[]
 *   POST   /bookings/:bookingId/guests           → Guest
 *   PUT    /bookings/:bookingId/guests/:guestId  → Guest
 *   DELETE /bookings/:bookingId/guests/:guestId  → 200 OK
 *   POST   /bookings/:bookingId/guests/generate-qr → { generated: number }
 *   POST   /qr/validate                          → QRValidationResult
 */

import { api } from "./client";
import type { Guest, CreateGuestPayload, QRValidationResult } from "../types";

export const guestsApi = {
  getAll: (bookingId: string): Promise<Guest[]> =>
    api.get(`/bookings/${bookingId}/guests`),

  /** Add a single guest. Backend auto-generates QR code and emails the guest. */
  create: (bookingId: string, payload: CreateGuestPayload): Promise<Guest> =>
    api.post(`/bookings/${bookingId}/guests`, payload),

  update: (bookingId: string, guestId: string, payload: Partial<CreateGuestPayload>): Promise<Guest> =>
    api.put(`/bookings/${bookingId}/guests/${guestId}`, payload),

  delete: (bookingId: string, guestId: string): Promise<void> =>
    api.delete(`/bookings/${bookingId}/guests/${guestId}`),

  /** Generate QR codes for all guests that don't have one yet. */
  generateAllQR: (bookingId: string): Promise<{ generated: number }> =>
    api.post(`/bookings/${bookingId}/guests/generate-qr`, {}),

  /**
   * Validate a QR code at the event entry point.
   * Send the raw QR code string scanned from the guest's ticket.
   * Backend marks entry_status = 'entered' on success.
   */
  validateQR: (qrCode: string): Promise<QRValidationResult> =>
    api.post("/qr/validate", { qrCode }),
};


// ─── Payments ─────────────────────────────────────────────────────────────────

/**
 * Payments API Service
 *
 * BACKEND ENDPOINTS EXPECTED:
 *   GET  /bookings/:bookingId/payments   → Payment[]
 *   POST /bookings/:bookingId/payments   → Payment    (logs a manual payment)
 *   POST /payments/checkout              → { checkoutUrl: string }  (Stripe/PayPal redirect)
 */

import type { Payment } from "../types";

export const paymentsApi = {
  getAll: (bookingId: string): Promise<Payment[]> =>
    api.get(`/bookings/${bookingId}/payments`),

  /** Log a manual payment (bank transfer / cash). */
  logPayment: (bookingId: string, payload: { amount: number; method: string; description: string }): Promise<Payment> =>
    api.post(`/bookings/${bookingId}/payments`, payload),

  /**
   * Initiate an online payment via Stripe/PayPal.
   * Backend creates a checkout session and returns the redirect URL.
   * Frontend should redirect the user to checkoutUrl.
   */
  initiateOnlinePayment: (bookingId: string, amount: number): Promise<{ checkoutUrl: string }> =>
    api.post("/payments/checkout", { bookingId, amount }),
};


// ─── Budget & Resources ────────────────────────────────────────────────────────

/**
 * Budget API Service
 *
 * BACKEND ENDPOINTS EXPECTED:
 *   GET  /bookings/:bookingId/budget           → BudgetCategory[]
 *   POST /bookings/:bookingId/budget           → BudgetCategory
 *   PUT  /bookings/:bookingId/budget/:id       → BudgetCategory
 *   GET  /bookings/:bookingId/vendors          → Vendor[]
 *   POST /bookings/:bookingId/vendors          → Vendor
 *   GET  /venues/:venueId/resources            → Resource[]
 *   PUT  /bookings/:bookingId/resources        → Resource[]  (update assignments)
 */

import type { BudgetCategory, Vendor, Resource } from "../types";

export const budgetApi = {
  getBudget: (bookingId: string): Promise<BudgetCategory[]> =>
    api.get(`/bookings/${bookingId}/budget`),

  addCategory: (bookingId: string, payload: Omit<BudgetCategory, "id" | "bookingId">): Promise<BudgetCategory> =>
    api.post(`/bookings/${bookingId}/budget`, payload),

  updateCategory: (bookingId: string, categoryId: string, payload: Partial<BudgetCategory>): Promise<BudgetCategory> =>
    api.put(`/bookings/${bookingId}/budget/${categoryId}`, payload),

  getVendors: (bookingId: string): Promise<Vendor[]> =>
    api.get(`/bookings/${bookingId}/vendors`),

  addVendor: (bookingId: string, payload: Omit<Vendor, "id" | "bookingId">): Promise<Vendor> =>
    api.post(`/bookings/${bookingId}/vendors`, payload),

  getResources: (venueId: string): Promise<Resource[]> =>
    api.get(`/venues/${venueId}/resources`),

  updateResourceAssignment: (bookingId: string, assignments: { resourceId: string; assigned: number }[]): Promise<Resource[]> =>
    api.put(`/bookings/${bookingId}/resources`, { assignments }),
};


// ─── Schedule ─────────────────────────────────────────────────────────────────

/**
 * Schedule API Service
 *
 * BACKEND ENDPOINTS EXPECTED:
 *   GET    /bookings/:bookingId/schedule         → ScheduleItem[]
 *   POST   /bookings/:bookingId/schedule         → ScheduleItem
 *   PUT    /bookings/:bookingId/schedule/:id     → ScheduleItem
 *   DELETE /bookings/:bookingId/schedule/:id     → 200 OK
 */

import type { ScheduleItem } from "../types";

export const scheduleApi = {
  getAll: (bookingId: string): Promise<ScheduleItem[]> =>
    api.get(`/bookings/${bookingId}/schedule`),

  create: (bookingId: string, payload: Omit<ScheduleItem, "id" | "bookingId">): Promise<ScheduleItem> =>
    api.post(`/bookings/${bookingId}/schedule`, payload),

  update: (bookingId: string, itemId: string, payload: Partial<ScheduleItem>): Promise<ScheduleItem> =>
    api.put(`/bookings/${bookingId}/schedule/${itemId}`, payload),

  delete: (bookingId: string, itemId: string): Promise<void> =>
    api.delete(`/bookings/${bookingId}/schedule/${itemId}`),
};


// ─── Disputes ─────────────────────────────────────────────────────────────────

/**
 * Disputes API Service
 *
 * BACKEND ENDPOINTS EXPECTED:
 *   GET   /disputes           → Dispute[]    (admin: all; others: own)
 *   GET   /disputes/:id       → Dispute
 *   POST  /disputes           → Dispute      (planner or owner raises dispute)
 *   PATCH /disputes/:id       → Dispute      (admin resolves)
 */

import type { Dispute, ResolveDisputePayload } from "../types";

export const disputesApi = {
  getAll: (): Promise<Dispute[]> => api.get("/disputes"),

  getById: (id: string): Promise<Dispute> => api.get(`/disputes/${id}`),

  create: (payload: Omit<Dispute, "id" | "date" | "lastUpdate" | "status">): Promise<Dispute> =>
    api.post("/disputes", payload),

  resolve: (id: string, payload: ResolveDisputePayload): Promise<Dispute> =>
    api.patch(`/disputes/${id}`, payload),
};


// ─── Admin ────────────────────────────────────────────────────────────────────

/**
 * Admin API Service
 *
 * BACKEND ENDPOINTS EXPECTED:
 *   GET   /admin/stats        → AdminStats
 *   GET   /admin/users        → User[]
 *   PATCH /admin/users/:id    → User   (suspend / activate)
 */

import type { AdminStats, User } from "../types";

export const adminApi = {
  getStats: (): Promise<AdminStats> => api.get("/admin/stats"),

  getUsers: (): Promise<User[]> => api.get("/admin/users"),

  updateUserStatus: (userId: string, status: "active" | "suspended"): Promise<User> =>
    api.patch(`/admin/users/${userId}`, { status }),
};
