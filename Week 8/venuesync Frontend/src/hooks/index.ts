/**
 * Custom hooks for data fetching.
 *
 * Each hook wraps an API call with loading/error state.
 * Replace the mock data with real API calls by uncommenting the api lines.
 *
 * Pattern:
 *   const { data, isLoading, error, refetch } = useVenues(params);
 */

import { useState, useEffect, useCallback } from "react";
import { venuesApi } from "../api/venues";
import { bookingsApi } from "../api/bookings";
import { guestsApi, budgetApi, scheduleApi, disputesApi, adminApi } from "../api/services";
import type {
  Venue,
  Booking,
  Guest,
  BudgetCategory,
  Vendor,
  ScheduleItem,
  Dispute,
  AdminStats,
  VenueSearchParams,
  Invoice,
} from "../types";

// ─── Generic fetch hook ───────────────────────────────────────────────────────

function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message ?? "An error occurred";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

// ─── Venue hooks ──────────────────────────────────────────────────────────────

export function useVenueSearch(params: VenueSearchParams) {
  return useFetch(
    () => venuesApi.search(params),
    [JSON.stringify(params)]
  );
}

export function useVenue(id: string) {
  return useFetch(() => venuesApi.getById(id), [id]);
}

export function useMyVenues() {
  return useFetch(() => venuesApi.getMyVenues(), []);
}

// ─── Booking hooks ────────────────────────────────────────────────────────────

export function useBookings() {
  return useFetch(() => bookingsApi.getAll(), []);
}

export function useBooking(id: string) {
  return useFetch(() => bookingsApi.getById(id), [id]);
}

export function useInvoice(id: string) {
  return useFetch(() => bookingsApi.getInvoice(id), [id]);
}

export function usePendingRequests() {
  return useFetch(() => bookingsApi.getPendingRequests(), []);
}

// ─── Guest hooks ─────────────────────────────────────────────────────────────

export function useGuests(bookingId: string) {
  return useFetch(() => guestsApi.getAll(bookingId), [bookingId]);
}

// ─── Budget hooks ─────────────────────────────────────────────────────────────

export function useBudget(bookingId: string) {
  return useFetch<BudgetCategory[]>(() => budgetApi.getBudget(bookingId), [bookingId]);
}

export function useVendors(bookingId: string) {
  return useFetch<Vendor[]>(() => budgetApi.getVendors(bookingId), [bookingId]);
}

// ─── Schedule hooks ───────────────────────────────────────────────────────────

export function useSchedule(bookingId: string) {
  return useFetch<ScheduleItem[]>(() => scheduleApi.getAll(bookingId), [bookingId]);
}

// ─── Dispute hooks ────────────────────────────────────────────────────────────

export function useDisputes() {
  return useFetch<Dispute[]>(() => disputesApi.getAll(), []);
}

// ─── Admin hooks ──────────────────────────────────────────────────────────────

export function useAdminStats() {
  return useFetch<AdminStats>(() => adminApi.getStats(), []);
}
