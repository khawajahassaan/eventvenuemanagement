<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    protected $fillable = ['owner_id','name','description','location','city','venue_type','capacity','price_per_day','amenities','images','status','rating','review_count'];
    protected $casts    = ['amenities' => 'array', 'images' => 'array'];

    public function owner()        { return $this->belongsTo(User::class, 'owner_id'); }
    public function bookings()     { return $this->hasMany(Booking::class); }
    public function resources()    { return $this->hasMany(Resource::class); }
    public function blockedDates() { return $this->hasMany(VenueBlockedDate::class); }
    public function waitlists()    { return $this->hasMany(Waitlist::class); }

    public function bookedDays(int $month, int $year): array {
        return $this->bookings()
            ->whereIn('status', ['approved','completed'])
            ->whereMonth('event_date', $month)
            ->whereYear('event_date', $year)
            ->pluck('event_date')
            ->map(fn($d) => (int) date('j', strtotime($d)))
            ->toArray();
    }
}
