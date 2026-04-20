<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Temple extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'temples';

    protected $fillable = [
        'name',
        'location',
        'country',
        'image',
        'description',
        'contact',
        'timings',
    ];

    protected $casts = [
        'contact' => 'array',
    ];
}
