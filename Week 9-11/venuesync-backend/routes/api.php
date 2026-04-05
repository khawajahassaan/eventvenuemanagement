<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{AuthController,VenueController,BookingController,PaymentController,GuestController,BudgetController,VendorController,ScheduleController,ResourceController,DisputeController,AdminController};

// ─── Public ──────────────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

Route::post('payments/webhook', [PaymentController::class, 'webhook']);
Route::get('venues',                      [VenueController::class, 'index']);
Route::get('venues/{venue}',              [VenueController::class, 'show']);
Route::get('venues/{venue}/availability', [VenueController::class, 'availability']);
Route::get('venues/{venue}/resources',    [ResourceController::class, 'index']);

// ─── Protected ───────────────────────────────────────────────────────────────
Route::middleware('jwt.auth')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me',      [AuthController::class, 'me']);

    Route::post('venues',                     [VenueController::class, 'store']);
    Route::put('venues/{venue}',              [VenueController::class, 'update']);
    Route::delete('venues/{venue}',           [VenueController::class, 'destroy']);
    Route::post('venues/{venue}/images',      [VenueController::class, 'uploadImages']);
    Route::post('venues/{venue}/block-dates', [VenueController::class, 'blockDates']);
    Route::get('venues/owner/my-venues',      [VenueController::class, 'myVenues']);

    Route::get('bookings',                    [BookingController::class, 'index']);
    Route::post('bookings',                   [BookingController::class, 'store']);
    Route::get('bookings/{booking}',          [BookingController::class, 'show']);
    Route::patch('bookings/{booking}/status', [BookingController::class, 'updateStatus']);
    Route::delete('bookings/{booking}',       [BookingController::class, 'destroy']);
    Route::get('bookings/{booking}/invoice',  [BookingController::class, 'invoice']);
    Route::post('bookings/waitlist',          [BookingController::class, 'joinWaitlist']);

    Route::get('bookings/{booking}/payments',  [PaymentController::class, 'index']);
    Route::post('bookings/{booking}/payments', [PaymentController::class, 'store']);
    Route::post('payments/checkout',           [PaymentController::class, 'createCheckout']);

    Route::get('bookings/{booking}/guests',              [GuestController::class, 'index']);
    Route::post('bookings/{booking}/guests',             [GuestController::class, 'store']);
    Route::put('bookings/{booking}/guests/{guest}',      [GuestController::class, 'update']);
    Route::delete('bookings/{booking}/guests/{guest}',   [GuestController::class, 'destroy']);
    Route::post('bookings/{booking}/guests/generate-qr', [GuestController::class, 'generateAllQR']);
    Route::post('qr/validate',                           [GuestController::class, 'validateQR']);

    Route::get('bookings/{booking}/budget',               [BudgetController::class, 'index']);
    Route::post('bookings/{booking}/budget',              [BudgetController::class, 'store']);
    Route::put('bookings/{booking}/budget/{category}',    [BudgetController::class, 'update']);
    Route::delete('bookings/{booking}/budget/{category}', [BudgetController::class, 'destroy']);

    Route::get('bookings/{booking}/vendors',              [VendorController::class, 'index']);
    Route::post('bookings/{booking}/vendors',             [VendorController::class, 'store']);
    Route::put('bookings/{booking}/vendors/{vendor}',     [VendorController::class, 'update']);
    Route::delete('bookings/{booking}/vendors/{vendor}',  [VendorController::class, 'destroy']);

    Route::put('bookings/{booking}/resources',            [ResourceController::class, 'assign']);

    Route::get('bookings/{booking}/schedule',             [ScheduleController::class, 'index']);
    Route::post('bookings/{booking}/schedule',            [ScheduleController::class, 'store']);
    Route::put('bookings/{booking}/schedule/{item}',      [ScheduleController::class, 'update']);
    Route::delete('bookings/{booking}/schedule/{item}',   [ScheduleController::class, 'destroy']);

    Route::get('disputes',            [DisputeController::class, 'index']);
    Route::post('disputes',           [DisputeController::class, 'store']);
    Route::patch('disputes/{dispute}',[DisputeController::class, 'update']);

    Route::prefix('admin')->group(function () {
        Route::get('stats',                 [AdminController::class, 'stats']);
        Route::get('users',                 [AdminController::class, 'users']);
        Route::patch('users/{user}/status', [AdminController::class, 'updateUserStatus']);
    });
});
