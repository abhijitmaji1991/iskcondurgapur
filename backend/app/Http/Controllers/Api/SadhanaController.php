<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SadhanaLog;
use Illuminate\Http\Request;

class SadhanaController extends Controller
{
    /** POST /sadhana/log — protected by auth:sanctum */
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'rounds_chanted' => 'integer|min:0',
            'reading_time_minutes' => 'integer|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        $userId = $request->user()->id;

        $log = SadhanaLog::updateOrCreate(
            ['user_id' => $userId, 'date' => $request->date],
            [
                'rounds_chanted' => $request->rounds_chanted ?? 0,
                'reading_time_minutes' => $request->reading_time_minutes ?? 0,
                'notes' => $request->notes,
            ]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Sadhana logged successfully',
            'data' => $log,
        ]);
    }

    /** GET /sadhana/history — protected by auth:sanctum */
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $days = min((int) $request->get('days', 7), 90); // max 90 days

        $logs = SadhanaLog::where('user_id', $userId)
            ->orderBy('date', 'desc')
            ->take($days)
            ->get();

        $totalRounds = $logs->sum('rounds_chanted');
        $totalReading = $logs->sum('reading_time_minutes');

        return response()->json([
            'status' => 'success',
            'data' => $logs,
            'stats' => [
                'total_rounds' => $totalRounds,
                'total_reading_minutes' => $totalReading,
                'days_logged' => $logs->count(),
            ],
        ]);
    }
}
