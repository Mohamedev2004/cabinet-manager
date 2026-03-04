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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->string('invoice_number')->unique();
            // Total amount of invoice
            $table->decimal('total_amount', 10, 2)->default(0);
            // Amount already paid
            $table->decimal('paid_amount', 10, 2)->default(0);
            // Remaining amount (total - paid)
            $table->decimal('remaining_amount', 10, 2)->default(0);
            // Updated status
            $table->enum('status', ['pending', 'partially_paid', 'paid'])->default('pending');
            $table->date('invoice_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
