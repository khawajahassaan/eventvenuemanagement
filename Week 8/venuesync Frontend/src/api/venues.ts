/**
 * Venues API Service
 *
 * BACKEND ENDPOINTS EXPECTED:
 *   GET    /venues                     → PaginatedResponse<Venue>
 *   GET    /venues/:id                 → Venue
 *   POST   /venues                     → Venue           (owner only)
 *   PUT    /venues/:id                 → Venue           (owner only)
 *   DELETE /venues/:id                 → 200 OK          (owner only)
 *   GET    /venues/:id/availability    → VenueAvailability
 *   GET    /venues/owner/my-venues     → Venue[]         (owner only)
 */

import { api } from "./client";
import type {
  Venue,
  CreateVenuePayload,
  VenueSearchParams,
  VenueAvailability,
  PaginatedResponse,
} from "../types";

export const venuesApi = {
  /**
   * Search / list venues with optional filters.
   * Maps to GET /venues?location=...&date=...&capacity=...
   */
  search: (params: VenueSearchParams = {}): Promise<PaginatedResponse<Venue>> => {
    const query = new URLSearchParams();
    if (params.location) query.set("location", params.location);
    if (params.date) query.set("date", params.date);
    if (params.capacity) query.set("capacity", String(params.capacity));
    if (params.minPrice) query.set("minPrice", String(params.minPrice));
    if (params.maxPrice) query.set("maxPrice", String(params.maxPrice));
    if (params.amenities?.length) query.set("amenities", params.amenities.join(","));
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return api.get(`/venues${qs ? `?${qs}` : ""}`);
  },

  /** Get a single venue by ID. */
  getById: (id: string): Promise<Venue> => api.get(`/venues/${id}`),

  /** Get availability calendar for a venue. */
  getAvailability: (id: string, month: number, year: number): Promise<VenueAvailability> =>
    api.get(`/venues/${id}/availability?month=${month}&year=${year}`),

  /** Create a new venue listing (Venue Owner only). */
  create: (payload: CreateVenuePayload): Promise<Venue> =>
    api.post("/venues", payload),

  /**
   * Upload images for a venue.
   * Send as FormData — the Content-Type header is set automatically by the browser.
   * DO NOT call api.post here; use fetch directly so Content-Type is multipart.
   */
  uploadImages: async (venueId: string, files: File[]): Promise<{ images: string[] }> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    const token = localStorage.getItem("access_token");
    const res = await fetch(`/api/venues/${venueId}/images`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return res.json();
  },

  /** Update venue details (Venue Owner only). */
  update: (id: string, payload: Partial<CreateVenuePayload>): Promise<Venue> =>
    api.put(`/venues/${id}`, payload),

  /** Delete a venue listing (Venue Owner only). */
  delete: (id: string): Promise<void> => api.delete(`/venues/${id}`),

  /** List all venues owned by the authenticated user. */
  getMyVenues: (): Promise<Venue[]> => api.get("/venues/owner/my-venues"),

  /** Mark dates as manually unavailable (e.g. blocked by owner). */
  blockDates: (id: string, dates: string[]): Promise<void> =>
    api.post(`/venues/${id}/block-dates`, { dates }),
};
