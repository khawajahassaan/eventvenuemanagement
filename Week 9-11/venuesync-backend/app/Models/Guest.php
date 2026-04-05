<?php namespace App\Models;
use Illuminate\Database\Eloquent\Model;

// Save as app/Models/Guest.php
class Guest extends Model {
    protected $fillable = ['booking_id','name','email','phone','category','rsvp','qr_code','qr_generated','entry_status','entry_time'];
    protected $casts    = ['qr_generated' => 'boolean', 'entry_time' => 'datetime'];
    public function booking() { return $this->belongsTo(Booking::class); }
}
