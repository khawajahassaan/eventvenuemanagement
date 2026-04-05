<?php

namespace App\Http\Controllers;

use App\Models\{User, Venue, Booking, Payment};
use Illuminate\Http\{Request, JsonResponse};

class AdminController extends Controller
{
    public function __construct() {
        $this->middleware(function ($request, $next) {
            abort_unless($request->user()?->role === 'admin', 403, 'Admins only.');
            return $next($request);
        });
    }

    public function stats(): JsonResponse
    {
        $monthlyRevenue = Payment::where('status', 'paid')
            ->where('paid_at', '>=', now()->subMonths(6))
            ->selectRaw("DATE_FORMAT(paid_at, '%b') as month, SUM(amount) as revenue")
            ->groupBy('month')->orderBy('paid_at')->get();

        $bookingsByStatus = Booking::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')->pluck('count', 'status');

        $topVenues = Venue::withCount(['bookings' => fn($q) => $q->whereIn('status', ['approved','completed'])])
            ->withSum(['bookings as revenue' => fn($q) => $q->whereIn('status', ['approved','completed'])], 'total_amount')
            ->orderByDesc('bookings_count')->take(5)->get(['id','name','city','bookings_count','revenue']);

        $recentActivity = Booking::with('venue:id,name', 'planner:id,name')->latest()->take(10)->get()
            ->map(fn($b) => ['type' => 'booking', 'message' => "{$b->planner->name} booked {$b->venue->name}", 'status' => $b->status, 'time' => $b->created_at->diffForHumans()]);

        return response()->json([
            'totalUsers'       => User::count(),
            'totalVenues'      => Venue::count(),
            'totalBookings'    => Booking::count(),
            'totalRevenue'     => Payment::where('status', 'paid')->sum('amount'),
            'monthlyRevenue'   => $monthlyRevenue,
            'bookingsByStatus' => $bookingsByStatus,
            'topVenues'        => $topVenues,
            'recentActivity'   => $recentActivity,
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        $users = User::query()
            ->when($request->role,   fn($q) => $q->where('role', $request->role))
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%")->orWhere('email', 'like', "%{$request->search}%"))
            ->orderBy('created_at', 'desc')->paginate(20);
        return response()->json($users);
    }

    public function updateUserStatus(Request $request, User $user): JsonResponse
    {
        $request->validate(['status' => 'required|in:active,suspended']);
        $user->update(['status' => $request->status]);
        return response()->json(['message' => "User {$request->status}."]);
    }
}
