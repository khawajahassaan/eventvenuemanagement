<?php
namespace App\Http\Controllers;
use App\Models\{Booking, Dispute};
use Illuminate\Http\{Request, JsonResponse};
use Illuminate\Support\Str;

class DisputeController extends Controller
{
    public function index(Request $request): JsonResponse {
        $user  = $request->user();
        $query = Dispute::with('booking:id,booking_ref,event_name', 'raisedBy:id,name');
        if ($user->role !== 'admin') $query->where('raised_by', $user->id);
        return response()->json($query->orderBy('created_at', 'desc')->get());
    }
    public function store(Request $request): JsonResponse {
        $data = $request->validate(['bookingId' => 'required|exists:bookings,id', 'raisedAgainst' => 'required|string', 'issue' => 'required|string', 'description' => 'required|string', 'refundRequested' => 'nullable|integer|min:0', 'priority' => 'nullable|in:critical,high,medium,low']);
        $booking = Booking::findOrFail($data['bookingId']);
        $dispute = Dispute::create(['dispute_ref' => 'DSP-' . strtoupper(Str::random(5)), 'booking_id' => $booking->id, 'raised_by' => $request->user()->id, 'raised_against' => $data['raisedAgainst'], 'issue' => $data['issue'], 'description' => $data['description'], 'booking_amount' => $booking->total_amount, 'refund_requested' => $data['refundRequested'] ?? 0, 'priority' => $data['priority'] ?? 'medium']);
        return response()->json($dispute, 201);
    }
    public function update(Request $request, Dispute $dispute): JsonResponse {
        abort_unless($request->user()->role === 'admin', 403, 'Admin only.');
        $data = $request->validate(['status' => 'required|in:in_review,resolved,rejected', 'resolutionNotes' => 'nullable|string', 'approvedRefund' => 'nullable|integer|min:0']);
        $dispute->update(['status' => $data['status'], 'resolution_notes' => $data['resolutionNotes'] ?? null, 'approved_refund' => $data['approvedRefund'] ?? null]);
        return response()->json($dispute);
    }
}