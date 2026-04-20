<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Course extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'courses';

    protected $fillable = [
        'title',
        'tagline',
        'description',
        'long_description',
        'image',
        'banner_color',
        'duration',
        'schedule',
        'start_date',
        'end_date',
        'instructor',
        'instructor_title',
        'instructor_bio',
        'instructor_image',
        'level',           // Beginner | Intermediate | Advanced
        'category',
        'rating',
        'enrolled_count',
        'max_seats',
        'featured',
        'price',           // number or 'Free'
        'original_price',
        'language',
        'location',
        'mode',            // Online | Offline | Hybrid
        'certificate',
        'prerequisites',   // array
        'outcomes',        // array
        'curriculum',      // array of modules
        'faqs',            // array of {q, a}
        'status',          // upcoming | ongoing | completed
    ];

    protected $casts = [
        'start_date'    => 'datetime',
        'end_date'      => 'datetime',
        'featured'      => 'boolean',
        'certificate'   => 'boolean',
        'prerequisites' => 'array',
        'outcomes'      => 'array',
        'curriculum'    => 'array',
        'faqs'          => 'array',
        'rating'        => 'float',
        'enrolled_count'=> 'integer',
        'max_seats'     => 'integer',
    ];
}
