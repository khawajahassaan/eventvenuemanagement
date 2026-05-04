<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class ScheduleItem extends Model {
    protected $fillable = ['booking_id','time','duration','activity','responsible','order'];
    public function booking() { return $this->belongsTo(Booking::class); }
}
