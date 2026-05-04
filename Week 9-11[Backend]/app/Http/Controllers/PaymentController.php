<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function index(Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);
        return response()->json($booking->payments()->orderBy('created_at')->get());
    }

    public function store(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);
        $data = $request->validate([
            'amount'      => 'required|integer|min:1',
            'description' => 'required|string',
            'method'      => 'required|in:Cash,Bank Transfer,Cheque,Online Transfer',
        ]);
        
        $totalPaid = $booking->payments()->where('status', 'paid')->sum('amount');
        $totalCost = $booking->total_amount ?? ($booking->venue_cost + $booking->service_fee + $booking->tax);
        $balance = $totalCost - $totalPaid;
        
        if ($data['amount'] > $balance) {
            return response()->json(['message' => "Payment amount cannot exceed the remaining balance of PKR $balance."], 422);
        }
        $payment = Payment::create([
            'payment_ref' => 'PAY-' . strtoupper(Str::random(6)),
            'booking_id'  => $booking->id,
            'amount'      => $data['amount'],
            'description' => $data['description'],
            'method'      => $data['method'],
            'status'      => 'paid',
            'paid_at'     => now(),
        ]);
        return response()->json($payment, 201);
    }

    public function createCheckout(Request $request): JsonResponse
    {
        $data = $request->validate(['bookingId' => 'required|exists:bookings,id', 'amount' => 'required|integer|min:1']);
        $booking = Booking::with('venue')->findOrFail($data['bookingId']);
        $this->authorize('view', $booking);

        if (!config('services.stripe.secret') || str_contains(config('services.stripe.secret'), 'YOUR')) {
            return response()->json(['message' => 'Stripe not configured yet.'], 503);
        }

        \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
        $session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency'     => 'pkr',
                    'unit_amount'  => $data['amount'],
                    'product_data' => ['name' => 'VenueSync Booking — ' . $booking->venue->name],
                ],
                'quantity' => 1,
            ]],
            'mode'        => 'payment',
            'metadata'    => ['booking_id' => $booking->id],
            'success_url' => config('app.frontend_url') . '/planner/payment/' . $booking->id . '?status=success&session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'  => config('app.frontend_url') . '/planner/payment/' . $booking->id . '?status=cancel',
        ]);

        return response()->json(['checkoutUrl' => $session->url]);
    }

    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $sig     = $request->header('Stripe-Signature');

        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sig, config('services.stripe.webhook_secret'));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $booking = Booking::find($session->metadata->booking_id);
            if ($booking) {
                Payment::create([
                    'payment_ref'       => 'PAY-' . strtoupper(Str::random(6)),
                    'booking_id'        => $booking->id,
                    'amount'            => $session->amount_total,
                    'description'       => 'Online Payment via Stripe',
                    'method'            => 'Stripe',
                    'status'            => 'paid',
                    'stripe_session_id' => $session->id,
                    'paid_at'           => now(),
                ]);
            }
        }

        return response()->json(['received' => true]);
    }
}
