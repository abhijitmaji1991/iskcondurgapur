<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Temple;
use App\Models\Event;
use App\Models\Resource;
use App\Models\User;
use App\Models\Course;
use App\Models\CourseRegistration;
use App\Models\Donation;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        try {
            $stats = [
                // Core counts
                'temples' => Temple::count(),
                'events' => Event::count(),
                'resources' => Resource::count(),
                'users' => User::count(),
                'courses' => Course::count(),
                'registrations' => CourseRegistration::count(),

                // Donations
                'donations_total' => Donation::successful()->count(),
                'donations_amount' => Donation::successful()->sum('amount'),

                // Contact
                'unread_messages' => ContactMessage::unread()->count(),

                // breakdowns
                'events_upcoming' => Event::where('date', '>=', new \DateTime())->count(),
                'courses_upcoming' => Course::where('status', 'upcoming')->count(),
                'courses_ongoing' => Course::where('status', 'ongoing')->count(),
                'courses_completed' => Course::where('status', 'completed')->count(),
            ];

            // Recent activity
            $activity = [
                'recent_events' => Event::orderBy('created_at', 'desc')->take(5)->get(['title', 'date', 'category']),
                'recent_registrations' => CourseRegistration::orderBy('registered_at', 'desc')->take(5)->get(['name', 'course_title', 'registered_at', 'status']),
                'recent_donations' => Donation::successful()->orderBy('donated_at', 'desc')->take(5)->get(['name', 'amount', 'purpose', 'donated_at']),
                'recent_messages' => ContactMessage::orderBy('created_at', 'desc')->take(5)->get(['name', 'subject', 'is_read', 'created_at']),
            ];

            return response()->json([
                'status' => 'success',
                'data' => array_merge($stats, ['activity' => $activity]),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch statistics',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
