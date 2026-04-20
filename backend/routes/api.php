<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TempleController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ResourceController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SadhanaController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\CourseRegistrationController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DonationController;

/*
|--------------------------------------------------------------------------
| API Routes — ISKCON Durgapur
|--------------------------------------------------------------------------
*/

// ── Authentication ─────────────────────────────────────────────────────────
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// ── Public Reads ───────────────────────────────────────────────────────────
Route::get('/temples', [TempleController::class, 'index']);
Route::get('/temples/{id}', [TempleController::class, 'show']);

Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);

Route::get('/resources', [ResourceController::class, 'index']);
Route::get('/resources/{id}', [ResourceController::class, 'show']);

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/featured', [CourseController::class, 'featured']);
Route::get('/courses/{id}', [CourseController::class, 'show']);

// ── Public Writes (form submissions) ──────────────────────────────────────
Route::post('/courses/{id}/register', [CourseRegistrationController::class, 'store']);
Route::post('/contact', [ContactController::class, 'store']);
Route::post('/donations', [DonationController::class, 'store']);

// ── Protected Routes (require Sanctum token) ──────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Sadhana (now properly protected)
    Route::post('/sadhana/log', [SadhanaController::class, 'store']);
    Route::get('/sadhana/history', [SadhanaController::class, 'index']);

    // Temple CRUD
    Route::post('/temples', [TempleController::class, 'store']);
    Route::put('/temples/{id}', [TempleController::class, 'update']);
    Route::delete('/temples/{id}', [TempleController::class, 'destroy']);

    // Event CRUD
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);

    // Resource CRUD
    Route::post('/resources', [ResourceController::class, 'store']);
    Route::put('/resources/{id}', [ResourceController::class, 'update']);
    Route::delete('/resources/{id}', [ResourceController::class, 'destroy']);

    // Course CRUD
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

    // Course Registrations (admin)
    Route::get('/registrations', [CourseRegistrationController::class, 'index']);
    Route::patch('/registrations/{id}/status', [CourseRegistrationController::class, 'updateStatus']);

    // Contact Messages (admin)
    Route::get('/contact', [ContactController::class, 'index']);
    Route::patch('/contact/{id}/read', [ContactController::class, 'markRead']);
    Route::delete('/contact/{id}', [ContactController::class, 'destroy']);

    // Donations (admin)
    Route::get('/donations', [DonationController::class, 'index']);
    Route::get('/donations/stats', [DonationController::class, 'stats']);
});
