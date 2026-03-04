<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Patient;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class InvoiceFactory extends Factory
{
    protected $model = Invoice::class;

    public function definition(): array
    {
        return [
            'patient_id' => Patient::inRandomOrder()->first()?->id ?? Patient::factory(),
            'invoice_number' => 'INV-' . strtoupper(Str::random(6)),
            'total_amount' => 0, // will be updated after items
            'status' => $this->faker->randomElement(['pending', 'paid']),
            'invoice_date' => now(),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Invoice $invoice) {

            // Get random services (1 to 3 services per invoice)
            $services = Service::inRandomOrder()->take(rand(1, 3))->get();

            $total = 0;

            foreach ($services as $service) {
                $invoice->items()->create([
                    'service_id' => $service->id,
                    'unit_price' => $service->price ?? 0,
                ]);

                $total += $service->price ?? 0;
            }

            // Update total amount
            $invoice->update([
                'total_amount' => $total
            ]);
        });
    }
}