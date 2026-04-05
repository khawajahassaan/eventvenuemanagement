<?php

namespace Database\Seeders;

use App\Models\{User, Venue, Booking, Payment, Guest, BudgetCategory, Resource, ScheduleItem};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create(['name' => 'Admin User', 'email' => 'admin@venuesync.pk', 'phone' => '+92 21 3456 7890', 'password' => Hash::make('password123'), 'role' => 'admin']);
        $owner = User::create(['name' => 'Venue Owner', 'email' => 'owner@venuesync.pk', 'phone' => '+92 300 1234567', 'password' => Hash::make('password123'), 'role' => 'owner']);
        $planner = User::create(['name' => 'Syed Rayyan Amir', 'email' => 'planner@venuesync.pk', 'phone' => '+92 321 9876543', 'password' => Hash::make('password123'), 'role' => 'planner']);

        $venue1 = Venue::create([
            'owner_id' => $owner->id, 'name' => 'Grand Palace Banquet Hall',
            'description' => 'A magnificent banquet hall perfect for weddings and large events.',
            'location' => 'Gulberg, Lahore', 'city' => 'Lahore', 'venue_type' => 'Banquet Hall',
            'capacity' => 500, 'price_per_day' => 180000,
            'amenities' => ['Parking', 'AC', 'Catering', 'Stage', 'Generator'],
            'images' => ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800'],
            'rating' => 4.8, 'review_count' => 47,
        ]);

        Venue::create([
            'owner_id' => $owner->id, 'name' => 'Sky View Convention Center',
            'description' => 'Modern convention center with breathtaking city views.',
            'location' => 'DHA Phase 5, Karachi', 'city' => 'Karachi', 'venue_type' => 'Convention Center',
            'capacity' => 800, 'price_per_day' => 250000,
            'amenities' => ['Parking', 'AC', 'WiFi', 'AV Equipment'],
            'images' => ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'],
            'rating' => 4.9, 'review_count' => 62,
        ]);

        $tableRes = Resource::create(['venue_id' => $venue1->id, 'item' => 'Round Tables (8-seater)', 'quantity' => 60]);
        $chairRes = Resource::create(['venue_id' => $venue1->id, 'item' => 'Chairs', 'quantity' => 520]);
        $stageRes = Resource::create(['venue_id' => $venue1->id, 'item' => 'Stage (12x20 ft)', 'quantity' => 1]);

        $booking = Booking::create([
            'booking_ref' => 'BK-2401', 'venue_id' => $venue1->id, 'planner_id' => $planner->id,
            'event_name' => 'Hassan & Ayesha Wedding Reception', 'event_type' => 'Wedding',
            'event_date' => now()->addDays(60)->toDateString(),
            'start_time' => '18:00', 'end_time' => '23:59', 'guest_count' => 400,
            'contact_name' => 'Syed Rayyan Amir', 'contact_phone' => '+92 321 9876543',
            'contact_email' => 'planner@venuesync.pk', 'status' => 'approved',
            'venue_cost' => 180000, 'service_fee' => 5000, 'tax' => 9250, 'total_amount' => 194250,
        ]);

        $booking->resources()->attach([$tableRes->id => ['assigned' => 50], $chairRes->id => ['assigned' => 400], $stageRes->id => ['assigned' => 1]]);

        Payment::create(['payment_ref' => 'PAY-001', 'booking_id' => $booking->id, 'amount' => 58275, 'description' => 'Deposit Payment (30%)', 'method' => 'Bank Transfer', 'status' => 'paid', 'paid_at' => now()->subDays(10)]);

        BudgetCategory::insert([
            ['booking_id' => $booking->id, 'category' => 'Catering',    'planned' => 80000, 'actual' => 75000, 'created_at' => now(), 'updated_at' => now()],
            ['booking_id' => $booking->id, 'category' => 'Decoration',  'planned' => 45000, 'actual' => 48000, 'created_at' => now(), 'updated_at' => now()],
            ['booking_id' => $booking->id, 'category' => 'Photography', 'planned' => 35000, 'actual' => 35000, 'created_at' => now(), 'updated_at' => now()],
            ['booking_id' => $booking->id, 'category' => 'Music/DJ',    'planned' => 20000, 'actual' => 0,     'created_at' => now(), 'updated_at' => now()],
        ]);

        foreach ([['Ali Hassan','ali@example.com','Family'],['Sara Khan','sara@example.com','Friends'],['Ahmed Raza','ahmed@example.com','VIP']] as [$name,$email,$cat]) {
            Guest::create(['booking_id' => $booking->id, 'name' => $name, 'email' => $email, 'category' => $cat, 'rsvp' => 'confirmed', 'qr_code' => Str::uuid()->toString(), 'qr_generated' => true]);
        }

        foreach ([['18:00',30,'Guest Arrival & Registration','Event Staff',1],['18:30',45,'Nikah Ceremony','Religious Officiant',2],['19:15',60,'Photography Session','Photography Team',3],['20:15',90,'Dinner & Reception','Catering Team',4],['21:45',60,'Cake Cutting & Speeches','Event Coordinator',5],['22:45',75,'Music & Dance','DJ Team',6]] as [$time,$dur,$act,$resp,$ord]) {
            ScheduleItem::create(['booking_id' => $booking->id, 'time' => $time, 'duration' => $dur, 'activity' => $act, 'responsible' => $resp, 'order' => $ord]);
        }

        $this->command->info('✅ Demo data seeded!');
        $this->command->table(['Role','Email','Password'],[['Admin','admin@venuesync.pk','password123'],['Owner','owner@venuesync.pk','password123'],['Planner','planner@venuesync.pk','password123']]);
    }
}
