<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Task;
use App\Models\Invoice;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function index()
    {
        $cacheTTL = 300; // 5 minutes

        $stats = Cache::tags(['dashboard'])->remember('stats', $cacheTTL, function () {
            $now = Carbon::now();

            $startOfMonth = $now->copy()->startOfMonth();
            $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
            $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

            $percentage = fn($current, $last) => $last == 0 ? 100 : round((($current - $last) / $last) * 100, 2);

            return [
                'patients' => [
                    'value' => Patient::count(),
                    'change' => $percentage(
                        Patient::where('created_at', '>=', $startOfMonth)->count(),
                        Patient::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count()
                    ),
                ],
                'appointments' => [
                    'value' => Appointment::whereIn('status', ['pending', 'confirmed'])->count(),
                    'change' => $percentage(
                        Appointment::whereIn('status', ['pending', 'confirmed'])->where('created_at', '>=', $startOfMonth)->count(),
                        Appointment::whereIn('status', ['pending', 'confirmed'])->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count()
                    ),
                ],
                'tasks' => [
                    'value' => Task::whereIn('status', ['pending', 'in_progress'])->count(),
                    'change' => $percentage(
                        Task::whereIn('status', ['pending', 'in_progress'])->where('created_at', '>=', $startOfMonth)->count(),
                        Task::whereIn('status', ['pending', 'in_progress'])->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count()
                    ),
                ],
                'revenue' => [
                    'value' => Invoice::sum('paid_amount'),
                    'change' => $percentage(
                        Invoice::where('created_at', '>=', $startOfMonth)->sum('paid_amount') ?? 0,
                        Invoice::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->sum('paid_amount') ?? 0
                    ),
                ],
            ];
        });

        return Inertia::render('user/dashboard', ['stats' => $stats]);
    }
}