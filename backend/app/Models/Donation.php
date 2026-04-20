<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Donation extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'donations';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'amount',
        'currency',
        'purpose',
        'razorpay_order_id',
        'razorpay_payment_id',
        'razorpay_signature',
        'status',       // pending | success | failed
        'anonymous',
        'notes',
        'donated_at',
    ];

    protected $casts = [
        'amount' => 'float',
        'anonymous' => 'boolean',
        'donated_at' => 'datetime',
    ];

    // Scope: successful donations only
    public function scopeSuccessful($query)
    {
        return $query->where('status', 'success');
    }
}
