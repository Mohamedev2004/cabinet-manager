<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Invoice;
use App\Models\Notification;
use Carbon\Carbon;

class NotifyUpcomingInvoices extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'invoices:notify-upcoming';

    /**
     * The console command description.
     */
    protected $description = 'Create warning notifications for unpaid invoices due tomorrow';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $tomorrow = Carbon::tomorrow()->toDateString();

        // Get unpaid invoices for tomorrow that haven't been reminded yet
        $invoices = Invoice::whereIn('status', ['pending', 'partially_paid'])
            ->whereDate('invoice_date', $tomorrow)
            ->where('reminder_sent', false)
            ->with('patient') // eager load patient
            ->get();

        foreach ($invoices as $invoice) {
            $clientName = $invoice->patient
                ? $invoice->patient->first_name . ' ' . $invoice->patient->last_name
                : 'Client inconnu';

            // Create notification
            Notification::create([
                'title' => 'Facture à échéance demain',
                'message' => "La facture #{$invoice->invoice_number} pour {$clientName} est prévue pour demain. Veuillez la vérifier.",
                'type' => 'warning',
            ]);

            // Mark as reminded
            $invoice->update(['reminder_sent' => true]);
        }

        $this->info("Notifications created for " . $invoices->count() . " invoices.");

        return 0;
    }
}