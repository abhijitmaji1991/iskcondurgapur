<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class SadhanaLog extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'sadhana_logs';

    protected $fillable = [
        'user_id',
        'date',
        'rounds_chanted',
        'reading_time_minutes',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'rounds_chanted' => 'integer',
        'reading_time_minutes' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
