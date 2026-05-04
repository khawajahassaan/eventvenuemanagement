<?php
namespace App\Policies;
use App\Models\{User, Venue};

class VenuePolicy
{
    public function create(User $user): bool  { return $user->role === 'owner'; }
    public function update(User $user, Venue $venue): bool { return $user->id === $venue->owner_id; }
    public function delete(User $user, Venue $venue): bool { return $user->id === $venue->owner_id; }
}