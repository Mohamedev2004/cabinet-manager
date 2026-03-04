<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Patient;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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
                'status' => 'pending',
                'invoice_date' => $validated['invoice_date'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                $invoice->items()->create([
                    'service_id' => $item['service_id'],
                    'unit_price' => $item['unit_price'],
                ]);
            }

            return back()->with('success', 'Facture créée avec succès');
        });
    }

    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'invoice_date' => 'nullable|date',
            'status' => 'required|in:pending,paid',
            'items' => 'required|array|min:1',
            'items.*.service_id' => 'required|exists:services,id',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($invoice, $validated) {
            $total = collect($validated['items'])->sum(fn ($i) => (float) $i['unit_price']);

            $invoice->update([
                'patient_id' => $validated['patient_id'],
                'invoice_date' => $validated['invoice_date'] ?? null,
                'status' => $validated['status'],
                'total_amount' => $total,
            ]);

            $invoice->items()->delete();

            foreach ($validated['items'] as $item) {
                $invoice->items()->create([
                    'service_id' => $item['service_id'],
                    'unit_price' => $item['unit_price'],
                ]);
            }

            return back()->with('success', 'Facture mise à jour avec succès');
        });
    }

    public function updateStatus(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,paid',
        ]);

        $invoice->update(['status' => $validated['status']]);

        return back()->with('success', 'Statut de la facture mis à jour');
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

        Invoice::whereIn('id', $request->invoice_ids)->update(['status' => $status]);

        return back()->with('success', 'Factures sélectionnées mises à jour');
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
}
