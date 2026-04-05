<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Venue;
use App\Models\Waitlist;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user  = $request->user();
        $query = Booking::with('venue:id,name,location');

        if ($user->role === 'planner') {
            $query->where('planner_id', $user->id);
        } elseif ($user->role === 'owner') {
            $venueIds = $user->venues()->pluck('id');
            $query->whereIn('venue_id', $venueIds);
            if ($request->status) $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function show(Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);
        $booking->load('venue', 'planner:id,name,email,phone');
        return response()->json($booking);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'venueId'             => 'required|exists:venues,id',
            'eventName'           => 'required|string|max:255',
            'eventType'           => 'required|string',
            'eventDate'           => 'required|date|after:today',
            'startTime'           => 'required|date_format:H:i',
            'endTime'             => 'required|date_format:H:i',
            'guestCount'          => 'required|integer|min:1',
            'contactName'         => 'required|string',
            'contactPhone'        => 'required|string',
            'contactEmail'        => 'required|email',
            'specialRequirements' => 'nullable|string',
        ]);

        $venue    = Venue::findOrFail($data['venueId']);
        $conflict = Booking::where('venue_id', $venue->id)->where('event_date', $data['eventDate'])
            ->whereIn('status', ['pending','approved'])->exists();

        if ($conflict) {
            return response()->json(['message' => 'This date is already booked or pending.'], 422);
        }

        $venueCost  = $venue->price_per_day;
        $serviceFee = 5000;
        $tax        = (int) round(($venueCost + $serviceFee) * 0.05);
        $total      = $venueCost + $serviceFee + $tax;

        $booking = Booking::create([
            'booking_ref' => 'BK-' . strtoupper(Str::random(6)),
            'venue_id' => $venue->id, 'planner_id' => $request->user()->id,
            'event_name' => $data['eventName'], 'event_type' => $data['eventType'],
            'event_date' => $data['eventDate'], 'start_time' => $data['startTime'],
            'end_time' => $data['endTime'], 'guest_count' => $data['guestCount'],
            'contact_name' => $data['contactName'], 'contact_phone' => $data['contactPhone'],
            'contact_email' => $data['contactEmail'],
            'special_requirements' => $data['specialRequirements'] ?? null,
            'status' => 'pending', 'venue_cost' => $venueCost,
            'service_fee' => $serviceFee, 'tax' => $tax, 'total_amount' => $total,
        ]);

        return response()->json($booking->load('venue:id,name'), 201);
    }

    public function updateStatus(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('updateStatus', $booking);
        $data = $request->validate([
            'status'          => 'required|in:approved,rejected',
            'rejectionReason' => 'required_if:status,rejected|nullable|string',
        ]);
        $booking->update(['status' => $data['status'], 'rejection_reason' => $data['rejectionReason'] ?? null]);
        return response()->json($booking);
    }

    public function destroy(Booking $booking): JsonResponse
    {
        $this->authorize('cancel', $booking);
        $daysUntilEvent = now()->diffInDays($booking->event_date, false);
        $refundPercent  = match(true) {
            $daysUntilEvent >= 30 => 100,
            $daysUntilEvent >= 15 => 50,
            default => 0,
        };
        $booking->update(['status' => 'cancelled']);
        return response()->json(['message' => 'Booking cancelled.', 'refundPercent' => $refundPercent, 'refundAmount' => (int) ($booking->totalPaid() * $refundPercent / 100)]);
    }

    public function invoice(Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);
        $booking->load('venue', 'planner', 'payments');
        return response()->json([
            'invoiceNumber' => 'INV-' . $booking->id . '-' . date('Y'),
            'bookingId'     => $booking->booking_ref,
            'venue'         => $booking->venue->name,
            'eventDate'     => $booking->event_date,
            'issueDate'     => $booking->created_at->toDateString(),
            'dueDate'       => $booking->event_date,
            'items'         => [
                ['description' => 'Venue Rental (1 day)', 'quantity' => 1, 'rate' => $booking->venue_cost,  'amount' => $booking->venue_cost],
                ['description' => 'Service Fee',           'quantity' => 1, 'rate' => $booking->service_fee, 'amount' => $booking->service_fee],
                ['description' => 'Tax (5%)',              'quantity' => 1, 'rate' => $booking->tax,         'amount' => $booking->tax],
            ],
            'subtotal' => $booking->venue_cost + $booking->service_fee,
            'tax'      => $booking->tax,
            'total'    => $booking->total_amount,
            'paid'     => $booking->totalPaid(),
            'balance'  => $booking->balance(),
        ]);
    }

    public function joinWaitlist(Request $request): JsonResponse
    {
        $data = $request->validate(['venueId' => 'required|exists:venues,id', 'date' => 'required|date', 'guestCount' => 'nullable|integer']);
        Waitlist::firstOrCreate(
            ['venue_id' => $data['venueId'], 'planner_id' => $request->user()->id, 'requested_date' => $data['date']],
            ['guest_count' => $data['guestCount'] ?? null]
        );
        return response()->json(['message' => 'Added to waitlist.']);
    }
}
