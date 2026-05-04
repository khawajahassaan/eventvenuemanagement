<?php
namespace App\Http\Controllers;
use App\Models\{Booking, Vendor};
use Illuminate\Http\{Request, JsonResponse};

class VendorController extends Controller
{
    public function index(Booking $booking): JsonResponse {
        $this->authorize('view', $booking);
        return response()->json($booking->vendors()->get());
    }
    public function store(Request $request, Booking $booking): JsonResponse {
        $this->authorize('view', $booking);
        $data = $request->validate(['name' => 'required|string', 'service' => 'required|string', 'contact' => 'required|string', 'amount' => 'required|integer|min:0', 'status' => 'nullable|in:pending,confirmed']);
        return response()->json(Vendor::create(['booking_id' => $booking->id, ...$data]), 201);
    }
    public function update(Request $request, Booking $booking, Vendor $vendor): JsonResponse {
        $this->authorize('view', $booking);
        $vendor->update($request->validate(['name' => 'sometimes|string', 'service' => 'sometimes|string', 'contact' => 'sometimes|string', 'amount' => 'sometimes|integer', 'status' => 'sometimes|in:pending,confirmed']));
        return response()->json($vendor);
    }
    public function destroy(Booking $booking, Vendor $vendor): JsonResponse {
        $this->authorize('view', $booking);
        $vendor->delete();
        return response()->json(['message' => 'Vendor removed.']);
    }
}
