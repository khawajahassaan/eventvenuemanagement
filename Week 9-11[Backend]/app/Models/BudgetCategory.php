<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class BudgetCategory extends Model {
    protected $fillable = ['booking_id','category','planned','actual'];
    public function booking() { return $this->belongsTo(Booking::class); }
}
