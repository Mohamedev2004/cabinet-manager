<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Patient;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf as DomPdf;
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
        $perPage = in_array((int) $request->input('perPage'), [5, 10, 20, 30, 40, 50, 60])
            ? (int) $request->input('perPage')
            : 10;

        $query = Invoice::query()
            ->with(['patient:id,first_name,last_name', 'items.service:id,name,price']);

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where('invoice_number', 'like', '%'.$search.'%');
        }

        $invoices = $query
            ->orderBy($sortBy, $sortDir)
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
            $total = collect($validated['items'])->sum(fn ($i) => (float) $i['unit_price']);

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

            // Generate PDF using DomPDF
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
            $total = collect($validated['items'])->sum(fn ($i) => (float) $i['unit_price']);
            $paidAmount = $invoice->paid_amount;
            $remaining = max($total - $paidAmount, 0);

            if ($paidAmount <= 0) {
                $status = 'pending';
            } elseif ($paidAmount < $total) {
                $status = 'partially_paid';
            } else {
                $status = 'paid';
            }

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

            // Regenerate PDF using DomPDF
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

        $paidAmount = $invoice->paid_amount;

        if ($validated['status'] === 'paid') {
            $paidAmount = $invoice->total_amount;
        } elseif ($validated['status'] === 'pending') {
            $paidAmount = 0;
        } elseif ($validated['status'] === 'partially_paid') {
            if (! isset($validated['paid_amount'])) {
                return back()->withErrors([
                    'paid_amount' => 'Le montant payé est requis pour un paiement partiel.',
                ]);
            }
            $paidAmount = min($validated['paid_amount'], $invoice->total_amount);
        }

        $remaining = max($invoice->total_amount - $paidAmount, 0);

        if ($paidAmount <= 0) {
            $status = 'pending';
        } elseif ($paidAmount < $invoice->total_amount) {
            $status = 'partially_paid';
        } else {
            $status = 'paid';
        }

        $invoice->update([
            'paid_amount' => $paidAmount,
            'remaining_amount' => $remaining,
            'status' => $status,
        ]);

        // Regenerate PDF using DomPDF
        $this->generatePdf($invoice->fresh(['patient', 'items.service']));

        return back()->with('success', 'Statut de la facture mis à jour et PDF régénéré.');
    }

    private function generatePdf(Invoice $invoice): string
    {
        $pdfFileName = Str::uuid().'.pdf';
        $pdfRelativePath = 'invoices/'.$pdfFileName;

        Storage::disk('public')->makeDirectory('invoices');

        // Delete old PDF if exists
        if ($invoice->pdf_path && Storage::disk('public')->exists($invoice->pdf_path)) {
            Storage::disk('public')->delete($invoice->pdf_path);
        }

        // Generate PDF using DomPDF
        DomPdf::loadView('invoices.pdf', [
            'invoice' => $invoice->load(['patient', 'items.service']),
        ])->save(Storage::disk('public')->path($pdfRelativePath));

        $invoice->update([
            'pdf_path' => $pdfRelativePath,
        ]);

        return $pdfRelativePath;
    }

    public function downloadPdf(Invoice $invoice)
    {
        if (! $invoice->pdf_path || ! Storage::disk('public')->exists($invoice->pdf_path)) {
            $this->generatePdf($invoice->load(['patient', 'items.service']));
        }

        return Response::download(
            Storage::disk('public')->path($invoice->pdf_path),
            'facture-'.$invoice->invoice_number.'.pdf'
        );
    }

    private function generateInvoiceNumber(): string
    {
        $prefix = 'INV-'.now()->format('Ymd');
        $last = Invoice::where('invoice_number', 'like', $prefix.'%')
            ->orderByDesc('id')
            ->value('invoice_number');

        $nextSeq = 1;
        if ($last && preg_match('/-(\d+)$/', $last, $matches)) {
            $nextSeq = ((int) $matches[1]) + 1;
        }

        return $prefix.'-'.str_pad((string) $nextSeq, 4, '0', STR_PAD_LEFT);
    }

    // Optional: batch status updates (pending / paid)
    public function setSelectedStatus(Request $request, string $status)
    {
        $request->validate([
            'invoice_ids' => 'required|array',
            'invoice_ids.*' => 'exists:invoices,id',
        ]);

        $invoices = Invoice::whereIn('id', $request->invoice_ids)->get();

        foreach ($invoices as $invoice) {
            $paidAmount = $invoice->paid_amount;
            if ($status === 'paid') $paidAmount = $invoice->total_amount;
            elseif ($status === 'pending') $paidAmount = 0;

            $invoice->update([
                'status' => $status,
                'paid_amount' => $paidAmount,
                'remaining_amount' => max($invoice->total_amount - $paidAmount, 0),
            ]);

            $this->generatePdf($invoice->fresh(['patient', 'items.service']));
        }

        return back()->with('success', 'Factures sélectionnées mises à jour et PDFs régénérés');
    }

    public function setSelectedPending(Request $request) { return $this->setSelectedStatus($request, 'pending'); }
    public function setSelectedPaid(Request $request) { return $this->setSelectedStatus($request, 'paid'); }
}