<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = ['name','email','phone','password','role','status'];
    protected $hidden   = ['password','remember_token'];
    protected $casts    = ['email_verified_at' => 'datetime', 'password' => 'hashed'];

    public function getJWTIdentifier() { return $this->getKey(); }
    public function getJWTCustomClaims() { return ['role' => $this->role]; }

    public function venues()   { return $this->hasMany(Venue::class, 'owner_id'); }
    public function bookings() { return $this->hasMany(Booking::class, 'planner_id'); }
    public function disputes() { return $this->hasMany(Dispute::class, 'raised_by'); }
}
