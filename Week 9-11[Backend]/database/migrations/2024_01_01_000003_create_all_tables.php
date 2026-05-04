<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_ref')->unique();
            $table->foreignId('venue_id')->constrained()->onDelete('cascade');
            $table->foreignId('planner_id')->constrained('users')->onDelete('cascade');
            $table->string('event_name');
            $table->string('event_type');
            $table->date('event_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->unsignedInteger('guest_count');
            $table->string('contact_name');
            $table->string('contact_phone');
            $table->string('contact_email');
            $table->text('special_requirements')->nullable();
            $table->enum('status', ['pending','approved','rejected','completed','cancelled'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->unsignedBigInteger('venue_cost');
            $table->unsignedBigInteger('service_fee')->default(5000);
            $table->unsignedBigInteger('tax');
            $table->unsignedBigInteger('total_amount');
            $table->timestamps();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_ref')->unique();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('amount');
            $table->string('description');
            $table->string('method')->default('Bank Transfer');
            $table->enum('status', ['pending','paid','refunded','failed'])->default('pending');
            $table->string('stripe_session_id')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });

        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('category')->nullable();
            $table->enum('rsvp', ['pending','confirmed','declined'])->default('pending');
            $table->string('qr_code')->nullable()->unique();
            $table->boolean('qr_generated')->default(false);
            $table->enum('entry_status', ['not_entered','entered'])->default('not_entered');
            $table->timestamp('entry_time')->nullable();
            $table->timestamps();
        });

        Schema::create('budget_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->string('category');
            $table->unsignedBigInteger('planned');
            $table->unsignedBigInteger('actual')->default(0);
            $table->timestamps();
        });

        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('service');
            $table->string('contact');
            $table->enum('status', ['pending','confirmed'])->default('pending');
            $table->unsignedBigInteger('amount');
            $table->timestamps();
        });

        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venue_id')->constrained()->onDelete('cascade');
            $table->string('item');
            $table->unsignedInteger('quantity');
            $table->timestamps();
        });

        Schema::create('booking_resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('resource_id')->constrained()->onDelete('cascade');
            $table->unsignedInteger('assigned');
            $table->timestamps();
        });

        Schema::create('schedule_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->string('time');
            $table->unsignedInteger('duration');
            $table->string('activity');
            $table->string('responsible');
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
        });

        Schema::create('venue_blocked_dates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venue_id')->constrained()->onDelete('cascade');
            $table->date('blocked_date');
            $table->string('reason')->nullable();
            $table->timestamps();
            $table->unique(['venue_id', 'blocked_date']);
        });

        Schema::create('waitlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('venue_id')->constrained()->onDelete('cascade');
            $table->foreignId('planner_id')->constrained('users')->onDelete('cascade');
            $table->date('requested_date');
            $table->unsignedInteger('guest_count')->nullable();
            $table->timestamps();
        });

        Schema::create('disputes', function (Blueprint $table) {
            $table->id();
            $table->string('dispute_ref')->unique();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('raised_by')->constrained('users')->onDelete('cascade');
            $table->string('raised_against');
            $table->string('issue');
            $table->text('description');
            $table->unsignedBigInteger('booking_amount');
            $table->unsignedBigInteger('refund_requested')->default(0);
            $table->enum('status', ['open','in_review','resolved','rejected'])->default('open');
            $table->enum('priority', ['critical','high','medium','low'])->default('medium');
            $table->text('resolution_notes')->nullable();
            $table->unsignedBigInteger('approved_refund')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disputes');
        Schema::dropIfExists('waitlists');
        Schema::dropIfExists('venue_blocked_dates');
        Schema::dropIfExists('schedule_items');
        Schema::dropIfExists('booking_resources');
        Schema::dropIfExists('resources');
        Schema::dropIfExists('vendors');
        Schema::dropIfExists('budget_categories');
        Schema::dropIfExists('guests');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('bookings');
    }
};
