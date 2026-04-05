<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model {
    protected $fillable = ['payment_ref','booking_id','amount','description','method','status','stripe_session_id','paid_at'];
    protected $casts    = ['paid_at' => 'datetime'];
    public function booking() { return $this->belongsTo(Booking::class); }
}
