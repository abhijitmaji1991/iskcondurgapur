<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Resource extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'resources';

    protected $fillable = [
        'title',
        'type',
        'category',
        'description',
        'content',
        'link',
        'author',
        'thumbnail',
        'tags',
        'isPublished',
    ];

    protected $casts = [
        'tags' => 'array',
        'isPublished' => 'boolean',
    ];
}
