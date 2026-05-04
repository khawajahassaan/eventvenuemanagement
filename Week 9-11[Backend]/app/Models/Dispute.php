<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Dispute extends Model {
    protected $fillable = ['dispute_ref','booking_id','raised_by','raised_against','issue','description','booking_amount','refund_requested','status','priority','resolution_notes','approved_refund'];
    public function booking()  { return $this->belongsTo(Booking::class); }
    public function raisedBy() { return $this->belongsTo(User::class, 'raised_by'); }
}
