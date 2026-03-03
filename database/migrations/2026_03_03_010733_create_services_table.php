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
        Schema::create('services', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->text('description')->nullable();

            $table->decimal('price', 10, 2)->nullable();
            $table->boolean('is_price_visible')->default(true);

            $table->boolean('is_active')->default(true);
            $table->integer('duration')->nullable();

            // 🖼 Images
            $table->string('cover_image')->nullable();
            $table->string('image_one')->nullable();
            $table->string('image_two')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
