<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class VenueBlockedDate extends Model {
    protected $table    = 'venue_blocked_dates';
    protected $fillable = ['venue_id','blocked_date','reason'];
    protected $casts    = ['blocked_date' => 'date'];
    public function venue() { return $this->belongsTo(Venue::class); }
}
