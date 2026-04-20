<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    /** GET /courses — public listing with filters & pagination */
    public function index(Request $request)
    {
        $query = Course::query();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
        if ($request->filled('level')) {
            $query->where('level', $request->level);
        }
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $perPage = (int) $request->get('per_page', 12);
        $courses = $query->orderBy('start_date', 'asc')->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $courses->items(),
            'meta' => [
                'total' => $courses->total(),
                'per_page' => $courses->perPage(),
                'current_page' => $courses->currentPage(),
                'last_page' => $courses->lastPage(),
            ],
        ]);
    }

    /** GET /courses/featured */
    public function featured()
    {
        $courses = Course::where('featured', true)
            ->where('status', '!=', 'completed')
            ->orderBy('start_date', 'asc')
            ->get();

        return response()->json(['status' => 'success', 'data' => $courses]);
    }

    /** GET /courses/{id} */
    public function show(string $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['status' => 'error', 'message' => 'Course not found'], 404);
        }

        return response()->json(['status' => 'success', 'data' => $course]);
    }

    /** POST /courses — admin only */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'instructor' => 'required|string',
            'category' => 'required|string',
            'status' => 'required|in:upcoming,ongoing,completed',
            'start_date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->all();
        if (isset($data['start_date']))
            $data['start_date'] = new \DateTime($data['start_date']);
        if (isset($data['end_date']))
            $data['end_date'] = new \DateTime($data['end_date']);
        if (!isset($data['enrolled_count']))
            $data['enrolled_count'] = 0;

        $course = Course::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Course created successfully',
            'data' => $course,
        ], 201);
    }

    /** PUT /courses/{id} — admin only */
    public function update(Request $request, string $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['status' => 'error', 'message' => 'Course not found'], 404);
        }

        $data = $request->all();
        if (isset($data['start_date']))
            $data['start_date'] = new \DateTime($data['start_date']);
        if (isset($data['end_date']))
            $data['end_date'] = new \DateTime($data['end_date']);

        $course->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Course updated successfully',
            'data' => $course,
        ]);
    }

    /** DELETE /courses/{id} — admin only */
    public function destroy(string $id)
    {
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['status' => 'error', 'message' => 'Course not found'], 404);
        }

        $course->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Course deleted successfully',
        ]);
    }
}
