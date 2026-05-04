<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Vendor extends Model {
    protected $fillable = ['booking_id','name','service','contact','status','amount'];
    public function booking() { return $this->belongsTo(Booking::class); }
}
