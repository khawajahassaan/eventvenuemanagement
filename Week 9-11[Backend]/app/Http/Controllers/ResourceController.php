<?php
namespace App\Http\Controllers;
use App\Models\{Booking, Venue};
use Illuminate\Http\{Request, JsonResponse};

class ResourceController extends Controller
{
    public function index(Venue $venue): JsonResponse {
        return response()->json($venue->resources()->get());
    }
    public function assign(Request $request, Booking $booking): JsonResponse {
        $this->authorize('view', $booking);
        $data = $request->validate(['resources' => 'required|array', 'resources.*.resourceId' => 'required|exists:resources,id', 'resources.*.assigned' => 'required|integer|min:0']);
        $sync = collect($data['resources'])->mapWithKeys(fn($r) => [$r['resourceId'] => ['assigned' => $r['assigned']]]);
        $booking->resources()->sync($sync);
        return response()->json(['message' => 'Resources assigned.']);
    }
}