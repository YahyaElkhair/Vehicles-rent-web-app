<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained('agencies')->onDelete('cascade');
            $table->foreignId('vehicle_id')->unique()->constrained('vehicles')->onDelete('cascade');
            
            // Post details
            $table->string('title');
            $table->text('description');
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            
            
            // delevry options
            $table->json('delivery_options')->default(json_encode(['agency pickup']));
            
            // Requirements
            $table->unsignedInteger('min_driver_age')->default(21);
            $table->unsignedInteger('min_license_years')->default(2);

            // Statistics
            $table->unsignedInteger('view_count')->default(0);
            $table->unsignedInteger('rental_count')->default(0);
            // Rating columns in your migration
            $table->decimal('average_rating', 3, 1)->default(0.0)->comment('1.0 to 5.0 with 0.5 increments');
            $table->unsignedInteger('five_star_count')->default(0);
            $table->unsignedInteger('four_star_count')->default(0);
            $table->unsignedInteger('three_star_count')->default(0);
            $table->unsignedInteger('two_star_count')->default(0);
            $table->unsignedInteger('one_star_count')->default(0);
            $table->unsignedInteger('total_reviews')->default(0);

            // SEO
            $table->string('slug')->unique();
            $table->text('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('tags')->nullable();

            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['agency_id', 'status']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
