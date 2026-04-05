<?php
namespace App\Http\Controllers;
use App\Models\{Booking, BudgetCategory};
use Illuminate\Http\{Request, JsonResponse};

class BudgetController extends Controller
{
    public function index(Booking $booking): JsonResponse {
        $this->authorize('view', $booking);
        return response()->json($booking->budgetCategories()->get());
    }
    public function store(Request $request, Booking $booking): JsonResponse {
        $this->authorize('view', $booking);
        $data = $request->validate(['category' => 'required|string', 'planned' => 'required|integer|min:0', 'actual' => 'nullable|integer|min:0']);
        return response()->json(BudgetCategory::create(['booking_id' => $booking->id, ...$data]), 201);
    }
    public function update(Request $request, Booking $booking, BudgetCategory $category): JsonResponse {
        $this->authorize('view', $booking);
        $category->update($request->validate(['planned' => 'sometimes|integer|min:0', 'actual' => 'sometimes|integer|min:0']));
        return response()->json($category);
    }
    public function destroy(Booking $booking, BudgetCategory $category): JsonResponse {
        $this->authorize('view', $booking);
        $category->delete();
        return response()->json(['message' => 'Category removed.']);
    }
}