<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Event extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'events';

    protected $fillable = [
        'title',
        'description',
        'date',
        'location',
        'category',
        'image',
        'organizer',
        'registrationLink',
        'isFeatured',
    ];

    protected $casts = [
        'date' => 'datetime',
        'isFeatured' => 'boolean',
    ];
}
