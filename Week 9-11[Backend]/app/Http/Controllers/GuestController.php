<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class GuestController extends Controller
{
    public function index(Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);
        $guests = $booking->guests()->orderBy('name')->get()->map(function ($g) {
            $g->qr_url = $g->qr_generated
                ? 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' . urlencode($g->qr_code)
                : null;
            return $g;
        });
        return response()->json($guests);
    }

    public function store(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);
        $data  = $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email',
            'phone'    => 'nullable|string',
            'category' => 'nullable|string',
        ]);
        $guest = Guest::create(['booking_id' => $booking->id, ...$data, 'rsvp' => 'pending']);
        return response()->json($guest, 201);
    }

    public function update(Request $request, Booking $booking, Guest $guest): JsonResponse
    {
        $this->authorize('view', $booking);
        $guest->update($request->validate([
            'name'     => 'sometimes|string',
            'email'    => 'sometimes|email',
            'phone'    => 'nullable|string',
            'category' => 'nullable|string',
            'rsvp'     => 'sometimes|in:pending,confirmed,declined',
        ]));
        return response()->json($guest);
    }

    public function destroy(Booking $booking, Guest $guest): JsonResponse
    {
        $this->authorize('view', $booking);
        $guest->delete();
        return response()->json(['message' => 'Guest removed.']);
    }

    /**
     * Generate QR codes for all guests that do not have one yet.
     * Uses a UUID token + the free api.qrserver.com service — no local package needed.
     */
    public function generateAllQR(Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);

        $ungenerated = $booking->guests()->where('qr_generated', false)->get();

        foreach ($ungenerated as $guest) {
            $token = Str::uuid()->toString();
            $guest->update(['qr_code' => $token, 'qr_generated' => true]);
        }

        // Return all guests with their qr_url so the frontend can update immediately
        $allGuests = $booking->guests()->orderBy('name')->get()->map(function ($g) {
            $g->qr_url = $g->qr_generated
                ? 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' . urlencode($g->qr_code)
                : null;
            return $g;
        });

        return response()->json([
            'message'   => $ungenerated->count() . ' QR code(s) generated.',
            'generated' => $ungenerated->count(),
            'guests'    => $allGuests,
        ]);
    }

    /**
     * Validate a QR code scan at the entry point.
     */
    public function validateQR(Request $request): JsonResponse
    {
        $request->validate(['qrCode' => 'required|string']);
        $guest = Guest::where('qr_code', $request->qrCode)->first();

        if (!$guest) {
            return response()->json(['status' => 'invalid', 'message' => 'QR code not found.'], 404);
        }

        if ($guest->entry_status === 'entered') {
            return response()->json([
                'status'    => 'already_entered',
                'guestName' => $guest->name,
                'ticketId'  => $guest->qr_code,
                'entryTime' => $guest->entry_time,
                'message'   => 'This guest has already entered.',
            ]);
        }

        $guest->update(['entry_status' => 'entered', 'entry_time' => now()]);
        return response()->json([
            'status'    => 'valid',
            'guestName' => $guest->name,
            'ticketId'  => $guest->qr_code,
            'entryTime' => $guest->entry_time,
            'message'   => 'Entry granted. Welcome!',
        ]);
    }
}
