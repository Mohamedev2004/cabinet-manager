<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Patient;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\LaravelPdf\Facades\Pdf;
use Illuminate\Support\Facades\Response;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $sortable = ['id', 'invoice_number', 'invoice_date', 'total_amount', 'status', 'patient_id', 'created_at'];

        $status = $request->input('status');
        $search = $request->input('search');

        $status = $status === 'all' ? null : $status;

        $sortBy = in_array($request->input('sortBy'), $sortable) ? $request->input('sortBy') : 'created_at';
        $sortDir = $request->input('sortDir') === 'asc' ? 'asc' : 'desc';
        $perPage = in_array((int)$request->input('perPage'), [5, 10, 20, 30, 40, 50, 60])
            ? (int)$request->input('perPage')
            : 10;

        $query = Invoice::query()->with(['patient:id,first_name,last_name', 'items.service:id,name,price']);

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where('invoice_number', 'like', '%' . $search . '%');
        }

        $invoices = $query->orderBy($sortBy, $sortDir)
            ->paginate($perPage)
            ->appends($request->query());

        $patients = Patient::select('id', 'first_name', 'last_name')->get();
        $services = Service::select('id', 'name', 'price')->where('is_active', true)->get();

        return Inertia::render('user/invoices', [
            'invoices' => $invoices,
            'patients' => $patients,
            'services' => $services,
            'filters' => [
                'status' => $request->input('status') ?? 'all',
                'search' => $search,
                'sortBy' => $sortBy,
                'sortDir' => $sortDir,
                'perPage' => $perPage,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'invoice_date' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.service_id' => 'required|exists:services,id',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated) {
            $total = collect($validated['items'])->sum(fn($i) => (float)$i['unit_price']);

            $invoice = Invoice::create([
                'patient_id' => $validated['patient_id'],
                'invoice_number' => $this->generateInvoiceNumber(),
                'total_amount' => $total,
                'paid_amount' => 0,
                'remaining_amount' => $total,
                'status' => 'pending',
                'invoice_date' => $validated['invoice_date'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                $invoice->items()->create([
                    'service_id' => $item['service_id'],
                    'unit_price' => $item['unit_price'],
                ]);
            }

            $this->generatePdf($invoice);

            return back()->with('success', 'Facture créée avec succès et PDF généré.');
        });
    }

    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'invoice_date' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.service_id' => 'required|exists:services,id',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($invoice, $validated) {
            $total = collect($validated['items'])->sum(fn($i) => (float)$i['unit_price']);

            $paidAmount = $invoice->paid_amount;
            $remaining = max($total - $paidAmount, 0);

            $status = match (true) {
                $paidAmount <= 0 => 'pending',
                $paidAmount < $total => 'partially_paid',
                default => 'paid',
            };

            $invoice->update([
                'patient_id' => $validated['patient_id'],
                'invoice_date' => $validated['invoice_date'] ?? null,
                'status' => $status,
                'total_amount' => $total,
                'remaining_amount' => $remaining,
            ]);

            $invoice->items()->delete();

            foreach ($validated['items'] as $item) {
                $invoice->items()->create([
                    'service_id' => $item['service_id'],
                    'unit_price' => $item['unit_price'],
                ]);
            }

            $this->generatePdf($invoice->fresh(['patient', 'items.service']));

            return back()->with('success', 'Facture mise à jour avec succès et PDF régénéré.');
        });
    }

    public function updateStatus(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,partially_paid,paid',
            'paid_amount' => 'nullable|numeric|min:0',
        ]);

        $paidAmount = match ($validated['status']) {
            'paid' => $invoice->total_amount,
            'pending' => 0,
            'partially_paid' => $validated['paid_amount'] ?? 0,
        };

        $paidAmount = min($paidAmount, $invoice->total_amount);
        $remaining = max($invoice->total_amount - $paidAmount, 0);

        $status = match (true) {
            $paidAmount <= 0 => 'pending',
            $paidAmount < $invoice->total_amount => 'partially_paid',
            default => 'paid',
        };

        $invoice->update([
            'paid_amount' => $paidAmount,
            'remaining_amount' => $remaining,
            'status' => $status,
        ]);

        $this->generatePdf($invoice->fresh(['patient', 'items.service']));

        return back()->with('success', 'Statut de la facture mis à jour et PDF régénéré.');
    }

    public function setSelectedPending(Request $request)
    {
        return $this->setSelectedStatus($request, 'pending');
    }

    public function setSelectedPaid(Request $request)
    {
        return $this->setSelectedStatus($request, 'paid');
    }

    private function setSelectedStatus(Request $request, string $status)
    {
        $request->validate([
            'invoice_ids' => 'required|array',
            'invoice_ids.*' => 'exists:invoices,id',
        ]);

        $invoices = Invoice::whereIn('id', $request->invoice_ids)->get();

        foreach ($invoices as $invoice) {
            $paidAmount = $status === 'paid' ? $invoice->total_amount : 0;

            $invoice->update([
                'status' => $status,
                'paid_amount' => $paidAmount,
                'remaining_amount' => max($invoice->total_amount - $paidAmount, 0),
            ]);

            $this->generatePdf($invoice->fresh(['patient', 'items.service']));
        }

        return back()->with('success', 'Factures sélectionnées mises à jour et PDFs régénérés');
    }

    private function generatePdf(Invoice $invoice): string
    {
        $pdfFileName = Str::uuid() . '.pdf';
        $pdfRelativePath = 'invoices/' . $pdfFileName;

        $invoice = $invoice->load(['patient', 'items.service']);

        try {
            // Spatie Laravel PDF uses ->content() to get the raw binary string
            $pdfContent = Pdf::view('invoices.pdf', ['invoice' => $invoice])
                ->content(); 

            // Upload directly to your Laravel Cloud Bucket
            Storage::disk('public')->put($pdfRelativePath, $pdfContent);

            // Delete old PDF if it exists
            if (!empty($invoice->pdf_path)) {
                Storage::disk('public')->delete($invoice->pdf_path);
            }

            $invoice->update(['pdf_path' => $pdfRelativePath]);

            return $pdfRelativePath;
        } catch (\Exception $e) {
            Log::error('PDF generation failed for invoice ID ' . $invoice->id . ': ' . $e->getMessage());
            return '';
        }
    }

    /**
     * Download PDF
     */
    public function downloadPdf(Invoice $invoice)
    {
        // If path is missing or file doesn't exist in bucket, generate it
        if (empty($invoice->pdf_path) || !Storage::disk('public')->exists($invoice->pdf_path)) {
            $newPath = $this->generatePdf($invoice);
            
            // If generation failed, stop here
            if (empty($newPath)) {
                abort(500, 'Erreur lors de la génération du PDF.');
            }
            
            $invoice->refresh();
        }

        try {
            return Storage::disk('public')->download(
                $invoice->pdf_path, 
                'facture-' . $invoice->invoice_number . '.pdf'
            );
        } catch (\Exception $e) {
            Log::error("Failed to download PDF: " . $e->getMessage());
            abort(404, 'Le fichier PDF est introuvable sur le serveur.');
        }
    }


    private function generateInvoiceNumber(): string
    {
        $prefix = 'INV-' . now()->format('Ymd');
        $last = Invoice::where('invoice_number', 'like', $prefix . '%')
            ->orderByDesc('id')
            ->value('invoice_number');

        $nextSeq = 1;
        if ($last && preg_match('/-(\d+)$/', $last, $matches)) {
            $nextSeq = ((int)$matches[1]) + 1;
        }

        return $prefix . '-' . str_pad((string)$nextSeq, 4, '0', STR_PAD_LEFT);
    }
}