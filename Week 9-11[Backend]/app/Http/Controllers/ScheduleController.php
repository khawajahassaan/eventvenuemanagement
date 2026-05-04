<?php
namespace App\Http\Controllers;
use App\Models\{Booking, ScheduleItem};
use Illuminate\Http\{Request, JsonResponse};

class ScheduleController extends Controller
{
    public function index(Booking $booking): JsonResponse {
        $this->authorize('view', $booking);
        return response()->json($booking->scheduleItems()->orderBy('order')->get());
    }
    public function store(Request $request, Booking $booking): JsonResponse {
        $this->authorize('view', $booking);
        $data = $request->validate(['time' => 'required|string', 'duration' => 'required|integer|min:1', 'activity' => 'required|string', 'responsible' => 'required|string']);
        $maxOrder = $booking->scheduleItems()->max('order') ?? 0;
        return response()->json(ScheduleItem::create(['booking_id' => $booking->id, 'order' => $maxOrder + 1, ...$data]), 201);
    }
    public function update(Request $request, Booking $booking, ScheduleItem $item): JsonResponse {
        $this->authorize('view', $booking);
        $item->update($request->validate(['time' => 'sometimes|string', 'duration' => 'sometimes|integer', 'activity' => 'sometimes|string', 'responsible' => 'sometimes|string', 'order' => 'sometimes|integer']));
        return response()->json($item);
    }
    public function destroy(Booking $booking, ScheduleItem $item): JsonResponse {
        $this->authorize('view', $booking);
        $item->delete();
        return response()->json(['message' => 'Schedule item removed.']);
    }
}