<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'booking_ref','venue_id','planner_id','event_name','event_type',
        'event_date','start_time','end_time','guest_count',
        'contact_name','contact_phone','contact_email','special_requirements',
        'status','rejection_reason','venue_cost','service_fee','tax','total_amount'
    ];

    public function venue()            { return $this->belongsTo(Venue::class); }
    public function planner()          { return $this->belongsTo(User::class, 'planner_id'); }
    public function payments()         { return $this->hasMany(Payment::class); }
    public function guests()           { return $this->hasMany(Guest::class); }
    public function budgetCategories() { return $this->hasMany(BudgetCategory::class); }
    public function vendors()          { return $this->hasMany(Vendor::class); }
    public function scheduleItems()    { return $this->hasMany(ScheduleItem::class)->orderBy('order'); }
    public function resources()        { return $this->belongsToMany(Resource::class, 'booking_resources')->withPivot('assigned')->withTimestamps(); }
    public function disputes()         { return $this->hasMany(Dispute::class); }

    public function totalPaid(): int   { return (int) $this->payments()->where('status','paid')->sum('amount'); }
    public function balance(): int     { return $this->total_amount - $this->totalPaid(); }
}
