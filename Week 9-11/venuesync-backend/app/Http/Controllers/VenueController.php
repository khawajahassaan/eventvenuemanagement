<?php

namespace App\Http\Controllers;

use App\Models\Venue;
use App\Models\VenueBlockedDate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class VenueController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Venue::with('owner:id,name,phone')->where('status', 'active');

        if ($loc = $request->location) {
            $query->where(function ($q) use ($loc) {
                $q->where('location', 'like', "%$loc%")
                  ->orWhere('city', 'like', "%$loc%")
                  ->orWhere('name', 'like', "%$loc%");
            });
        }
        if ($request->minPrice) $query->where('price_per_day', '>=', $request->minPrice);
        if ($request->maxPrice) $query->where('price_per_day', '<=', $request->maxPrice);
        if ($request->capacity) $query->where('capacity', '>=', $request->capacity);
        if ($request->amenities) {
            foreach (explode(',', $request->amenities) as $amenity) {
                $query->whereJsonContains('amenities', trim($amenity));
            }
        }

        $limit  = min($request->limit ?? 12, 50);
        $venues = $query->paginate($limit);

        return response()->json([
            'data' => $venues->items(), 'total' => $venues->total(),
            'page' => $venues->currentPage(), 'limit' => $limit, 'totalPages' => $venues->lastPage(),
        ]);
    }

    public function show(Venue $venue): JsonResponse
    {
        $venue->load('owner:id,name,phone');
        return response()->json($venue);
    }

    public function availability(Request $request, Venue $venue): JsonResponse
    {
        $month = (int) ($request->month ?? date('n'));
        $year  = (int) ($request->year  ?? date('Y'));

        $bookedDates  = $venue->bookedDays($month, $year);
        $blockedDates = VenueBlockedDate::where('venue_id', $venue->id)
            ->whereMonth('blocked_date', $month)->whereYear('blocked_date', $year)
            ->pluck('blocked_date')->map(fn($d) => (int) date('j', strtotime($d)))->toArray();

        return response()->json([
            'venueId' => $venue->id, 'month' => $month, 'year' => $year,
            'bookedDates' => array_values(array_unique($bookedDates)),
            'unavailableDates' => array_values(array_unique($blockedDates)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Venue::class);
        $data  = $request->validate([
            'name' => 'required|string|max:255', 'description' => 'nullable|string',
            'location' => 'required|string', 'city' => 'required|string',
            'venue_type' => 'nullable|string', 'capacity' => 'required|integer|min:1',
            'price_per_day' => 'required|integer|min:1', 'amenities' => 'nullable|array',
        ]);
        $venue = Venue::create([...$data, 'owner_id' => $request->user()->id, 'amenities' => $data['amenities'] ?? [], 'images' => []]);
        return response()->json($venue, 201);
    }

    public function uploadImages(Request $request, Venue $venue): JsonResponse
    {
        $this->authorize('update', $venue);
        $request->validate(['images' => 'required|array|min:1', 'images.*' => 'image|mimes:jpeg,png,webp|max:10240']);

        $uploaded = [];
        foreach ($request->file('images') as $file) {
            $path       = $file->store("venues/{$venue->id}", 'public');
            $uploaded[] = Storage::url($path);
        }
        $venue->update(['images' => array_merge($venue->images ?? [], $uploaded)]);
        return response()->json(['images' => $venue->fresh()->images]);
    }

    public function update(Request $request, Venue $venue): JsonResponse
    {
        $this->authorize('update', $venue);
        $data = $request->validate([
            'name' => 'sometimes|string|max:255', 'description' => 'nullable|string',
            'location' => 'sometimes|string', 'city' => 'sometimes|string',
            'venue_type' => 'nullable|string', 'capacity' => 'sometimes|integer|min:1',
            'price_per_day' => 'sometimes|integer|min:1', 'amenities' => 'nullable|array',
            'status' => 'sometimes|in:active,inactive,maintenance',
        ]);
        $venue->update($data);
        return response()->json($venue);
    }

    public function destroy(Venue $venue): JsonResponse
    {
        $this->authorize('delete', $venue);
        $venue->delete();
        return response()->json(['message' => 'Venue deleted.']);
    }

    public function myVenues(Request $request): JsonResponse
    {
        $venues = Venue::where('owner_id', $request->user()->id)->withCount('bookings')->get();
        return response()->json($venues);
    }

    public function blockDates(Request $request, Venue $venue): JsonResponse
    {
        $this->authorize('update', $venue);
        $request->validate(['dates' => 'required|array', 'dates.*' => 'date']);
        foreach ($request->dates as $date) {
            VenueBlockedDate::firstOrCreate(['venue_id' => $venue->id, 'blocked_date' => $date]);
        }
        return response()->json(['message' => 'Dates blocked.']);
    }
}
