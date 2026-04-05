<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Booking;
use App\Models\Venue;
use App\Policies\BookingPolicy;
use App\Policies\VenuePolicy;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        $this->app->booted(function () {
            Gate::policy(Booking::class, BookingPolicy::class);
            Gate::policy(Venue::class, VenuePolicy::class);
        });
    }
}