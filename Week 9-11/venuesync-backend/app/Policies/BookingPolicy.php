<?php
namespace App\Policies;
use App\Models\{Booking, User};

class BookingPolicy
{
    public function view(User $user, Booking $booking): bool {
        return $user->id === $booking->planner_id
            || $user->id === $booking->venue->owner_id
            || $user->role === 'admin';
    }
    public function updateStatus(User $user, Booking $booking): bool {
        return $user->id === $booking->venue->owner_id;
    }
    public function cancel(User $user, Booking $booking): bool {
        return $user->id === $booking->planner_id && in_array($booking->status, ['pending','approved']);
    }
}