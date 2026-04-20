<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DonationController extends Controller
{
    /** POST /donations — public: record a donation */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required_unless:anonymous,true|string|max:100',
            'email' => 'required|email',
            'amount' => 'required|numeric|min:1',
            'purpose' => 'required|string|max:200',
            'razorpay_order_id' => 'nullable|string',
            'razorpay_payment_id' => 'nullable|string',
            'razorpay_signature' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $status = 'pending';
        // If Razorpay payment ID received, mark as success
        if ($request->filled('razorpay_payment_id')) {
            $status = 'success';
        }

        $donation = Donation::create([
            'name' => $request->boolean('anonymous') ? 'Anonymous' : $request->name,
            'email' => $request->email,
            'phone' => $request->phone ?? null,
            'amount' => $request->amount,
            'currency' => $request->get('currency', 'INR'),
            'purpose' => $request->purpose,
            'razorpay_order_id' => $request->razorpay_order_id ?? null,
            'razorpay_payment_id' => $request->razorpay_payment_id ?? null,
            'razorpay_signature' => $request->razorpay_signature ?? null,
            'status' => $status,
            'anonymous' => $request->boolean('anonymous'),
            'notes' => $request->notes ?? null,
            'donated_at' => new \DateTime(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => $status === 'success'
                ? 'Thank you for your donation! Hare Krishna!'
                : 'Donation recorded. Awaiting payment confirmation.',
            'data' => ['id' => $donation->id, 'status' => $status],
        ], 201);
    }

    /** GET /donations — admin only */
    public function index(Request $request)
    {
        $query = Donation::query();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('purpose')) {
            $query->where('purpose', $request->purpose);
        }

        $perPage = (int) $request->get('per_page', 20);
        $donations = $query->orderBy('donated_at', 'desc')->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $donations->items(),
            'meta' => [
                'total' => $donations->total(),
                'per_page' => $donations->perPage(),
                'current_page' => $donations->currentPage(),
                'last_page' => $donations->lastPage(),
            ],
        ]);
    }

    /** GET /donations/stats — admin only */
    public function stats()
    {
        $successful = Donation::successful()->get();

        $totalAmount = $successful->sum('amount');

        $byPurpose = $successful
            ->groupBy('purpose')
            ->map(fn($group) => [
                'count' => $group->count(),
                'amount' => $group->sum('amount'),
            ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_amount' => $totalAmount,
                'total_donations' => $successful->count(),
                'by_purpose' => $byPurpose,
                'pending_count' => Donation::where('status', 'pending')->count(),
            ],
        ]);
    }
}
