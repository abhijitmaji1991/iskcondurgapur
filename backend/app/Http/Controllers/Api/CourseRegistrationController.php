<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseRegistration;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseRegistrationController extends Controller
{
    /** POST /courses/{id}/register — public */
    public function store(Request $request, string $courseId)
    {
        $course = Course::find($courseId);

        if (!$course) {
            return response()->json(['status' => 'error', 'message' => 'Course not found'], 404);
        }

        if ($course->status === 'completed') {
            return response()->json(['status' => 'error', 'message' => 'Registrations closed for completed courses'], 400);
        }

        $maxSeats = $course->max_seats ?? 0;
        $enrolled = $course->enrolled_count ?? 0;
        if ($maxSeats > 0 && $enrolled >= $maxSeats) {
            return response()->json(['status' => 'error', 'message' => 'No seats available'], 400);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|email',
            'phone' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Prevent duplicate registration
        $existing = CourseRegistration::where('course_id', $courseId)
            ->where('email', $request->email)
            ->first();

        if ($existing) {
            return response()->json([
                'status' => 'error',
                'message' => 'You have already registered for this course',
            ], 409);
        }

        $registration = CourseRegistration::create([
            'course_id' => $courseId,
            'course_title' => $course->title,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'message' => $request->message ?? null,
            'status' => 'pending',
            'registered_at' => new \DateTime(),
        ]);

        // Increment enrolled_count on the course
        $course->increment('enrolled_count');

        return response()->json([
            'status' => 'success',
            'message' => 'Registration submitted successfully. We will contact you shortly.',
            'data' => $registration,
        ], 201);
    }

    /** GET /registrations — admin only */
    public function index(Request $request)
    {
        $query = CourseRegistration::query();

        if ($request->filled('course_id')) {
            $query->where('course_id', $request->course_id);
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $perPage = (int) $request->get('per_page', 20);
        $registrations = $query->orderBy('registered_at', 'desc')->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $registrations->items(),
            'meta' => [
                'total' => $registrations->total(),
                'per_page' => $registrations->perPage(),
                'current_page' => $registrations->currentPage(),
                'last_page' => $registrations->lastPage(),
            ],
        ]);
    }

    /** PATCH /registrations/{id}/status — admin only */
    public function updateStatus(Request $request, string $id)
    {
        $registration = CourseRegistration::find($id);

        if (!$registration) {
            return response()->json(['status' => 'error', 'message' => 'Registration not found'], 404);
        }

        $request->validate(['status' => 'required|in:pending,confirmed,cancelled']);
        $registration->update(['status' => $request->status]);

        return response()->json([
            'status' => 'success',
            'message' => 'Registration status updated',
            'data' => $registration,
        ]);
    }
}
