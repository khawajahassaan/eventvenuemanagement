<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create('venues', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('location');
            $table->string('city');
            $table->string('venue_type')->default('Banquet Hall');
            $table->unsignedInteger('capacity');
            $table->unsignedBigInteger('price_per_day');
            $table->json('amenities')->nullable();
            $table->json('images')->nullable();
            $table->enum('status', ['active', 'inactive', 'maintenance'])->default('active');
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->unsignedInteger('review_count')->default(0);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('venues'); }
};
