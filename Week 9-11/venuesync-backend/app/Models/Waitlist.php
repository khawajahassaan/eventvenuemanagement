<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Waitlist extends Model {
    protected $fillable = ['venue_id','planner_id','requested_date','guest_count'];
    protected $casts    = ['requested_date' => 'date'];
    public function venue()   { return $this->belongsTo(Venue::class); }
    public function planner() { return $this->belongsTo(User::class, 'planner_id'); }
}
