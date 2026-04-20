<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class CourseRegistration extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'course_registrations';

    protected $fillable = [
        'course_id',
        'course_title',
        'name',
        'email',
        'phone',
        'message',
        'status',         // pending | confirmed | cancelled
        'registered_at',
    ];

    protected $casts = [
        'registered_at' => 'datetime',
    ];
}
