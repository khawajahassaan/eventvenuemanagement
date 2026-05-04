<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Resource extends Model {
    protected $fillable = ['venue_id','item','quantity'];
    public function venue()    { return $this->belongsTo(Venue::class); }
    public function bookings() { return $this->belongsToMany(Booking::class, 'booking_resources')->withPivot('assigned'); }
}
