<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class GuestController extends Controller
{
    public function index(Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);
        return response()->json($booking->guests()->orderBy('name')->get());
    }

    public function store(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);
        $data = $request->validate(['name' => 'required|string', 'email' => 'required|email', 'phone' => 'nullable|string', 'category' => 'nullable|string']);
        $guest = Guest::create(['booking_id' => $booking->id, ...$data, 'rsvp' => 'pending']);
        return response()->json($guest, 201);
    }

    public function update(Request $request, Booking $booking, Guest $guest): JsonResponse
    {
        $this->authorize('view', $booking);
        $guest->update($request->validate(['name' => 'sometimes|string', 'email' => 'sometimes|email', 'phone' => 'nullable|string', 'category' => 'nullable|string', 'rsvp' => 'sometimes|in:pending,confirmed,declined']));
        return response()->json($guest);
    }

    public function destroy(Booking $booking, Guest $guest): JsonResponse
    {
        $this->authorize('view', $booking);
        $guest->delete();
        return response()->json(['message' => 'Guest removed.']);
    }

    public function generateAllQR(Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);
        $guests = $booking->guests()->where('qr_generated', false)->get();

        foreach ($guests as $guest) {
            $token = Str::uuid()->toString();
            // Generate QR using endroid/qr-code
            $qrCode = \Endroid\QrCode\QrCode::create($token);
            $writer = new \Endroid\QrCode\Writer\PngWriter();
            $result = $writer->write($qrCode);
            $path   = "qrcodes/{$booking->id}/{$guest->id}.png";
            Storage::disk('public')->put($path, $result->getString());
            $guest->update(['qr_code' => $token, 'qr_generated' => true]);
        }

        return response()->json(['message' => $guests->count() . ' QR code(s) generated.', 'generated' => $guests->count()]);
    }

    public function validateQR(Request $request): JsonResponse
    {
        $request->validate(['qrCode' => 'required|string']);
        $guest = Guest::where('qr_code', $request->qrCode)->first();

        if (!$guest) {
            return response()->json(['status' => 'invalid', 'message' => 'QR code not found.'], 404);
        }
        if ($guest->entry_status === 'entered') {
            return response()->json(['status' => 'already_entered', 'guestName' => $guest->name, 'ticketId' => $guest->qr_code, 'entryTime' => $guest->entry_time, 'message' => 'This guest has already entered.']);
        }

        $guest->update(['entry_status' => 'entered', 'entry_time' => now()]);
        return response()->json(['status' => 'valid', 'guestName' => $guest->name, 'ticketId' => $guest->qr_code, 'entryTime' => $guest->entry_time, 'message' => 'Entry granted. Welcome!']);
    }
}
