<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\LaravelPdf\Facades\Pdf;

class ReportController extends Controller
{
    public function create(Patient $patient)
    {
        return Inertia::render('user/create-patient-report', [
            'patient' => $patient,
        ]);
    }

    public function store(Request $request, Patient $patient)
    {
        // 1️⃣ Validate input
        $validated = $request->validate([
            'gestational_age_weeks' => 'required|integer|min:0',
            'weight' => 'required|numeric|min:0',
            'blood_pressure' => 'required|string|max:255',
            'fetal_heart_rate' => 'required|integer|min:0',
            'last_menstrual_period' => 'nullable|date',
            'expected_delivery_date' => 'nullable|date',
            'uterine_height' => 'nullable|integer|min:0',
            'symptoms' => 'nullable|string',
            'clinical_observations' => 'nullable|string',
            'prescription' => 'nullable|string',
            'recommendations' => 'nullable|string',
            'next_visit_date' => 'nullable|date',
        ]);

        // 2️⃣ Create the report
        $patient->reports()->create($validated);

        // 3️⃣ Redirect back
        return redirect()
            ->route('patients.show', $patient->id)
            ->with('success', 'Rapport créé avec succès.');
    }

    public function show(Patient $patient, Report $report)
    {
        // Security: ensure report belongs to patient
        if ($report->patient_id !== $patient->id) {
            abort(404);
        }

        // Calculate the report sequence number for this patient
        $reportNumber = $patient->reports()
            ->where('created_at', '<=', $report->created_at)
            ->where('id', '<=', $report->id)
            ->count();

        return Inertia::render('user/patient-report', [
            'patient' => $patient,
            'report' => $report,
            'reportNumber' => $reportNumber,
        ]);
    }
}
