<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\Patient;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\LaravelPdf\Facades\Pdf;
use Spatie\Browsershot\Browsershot;

class InvoiceFactory extends Factory
{
    protected $model = Invoice::class;

    public function definition(): array
    {
        return [
            'patient_id' => Patient::inRandomOrder()->first()?->id ?? Patient::factory(),
            'invoice_number' => 'INV-' . strtoupper(Str::random(6)),
            'total_amount' => 0,
            'paid_amount' => 0,
            'remaining_amount' => 0,
            'status' => $this->faker->randomElement(['pending', 'partially_paid', 'paid']),
            'invoice_date' => now(),
        ];
    }

    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
        ]);
    }

    public function partiallyPaid(?float $amount = null): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'partially_paid',
            'paid_amount' => $amount ?? 50,
        ]);
    }

    public function configure()
    {
        return $this->afterCreating(function (Invoice $invoice) {

            // Get random services (1–3 services)
            $services = Service::inRandomOrder()->take(rand(1, 3))->get();

            if ($services->isEmpty()) {
                $services = Service::factory()->count(1)->create();
            }

            $total = 0;

            foreach ($services as $service) {

                $unitPrice = $service->price ?? rand(100, 500);

                $invoice->items()->create([
                    'service_id' => $service->id,
                    'unit_price' => $unitPrice,
                ]);

                $total += $unitPrice;
            }

            $paidAmount = 0;
            $status = $invoice->status;

            if ($status === 'paid') {
                $paidAmount = $total;
            } elseif ($status === 'partially_paid') {

                $paidAmount = $invoice->paid_amount > 0 && $invoice->paid_amount < $total
                    ? $invoice->paid_amount
                    : rand(1, max(1, $total - 1));

            } else {
                $paidAmount = 0;
                $status = 'pending';
            }

            $remaining = max($total - $paidAmount, 0);

            if ($paidAmount <= 0) {
                $status = 'pending';
            } elseif ($paidAmount < $total) {
                $status = 'partially_paid';
            } else {
                $status = 'paid';
            }

            $invoice->update([
                'total_amount' => $total,
                'paid_amount' => $paidAmount,
                'remaining_amount' => $remaining,
                'status' => $status,
            ]);

            // 📄 GENERATE PDF
            $pdfFileName = Str::uuid() . '.pdf';
            $pdfRelativePath = 'invoices/' . $pdfFileName;

            Storage::disk('public')->makeDirectory('invoices');

            Pdf::view('invoices.pdf', [
                'invoice' => $invoice->load(['patient', 'items.service']),
            ])
            ->withBrowsershot(function (Browsershot $browsershot) {
                $browsershot->noSandbox();
            })
            ->save(
                Storage::disk('public')->path($pdfRelativePath)
            );

            $invoice->update([
                'pdf_path' => $pdfRelativePath,
            ]);
        });
    }
}