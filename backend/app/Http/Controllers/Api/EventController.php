<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    /** GET /events — public, with search/filter/pagination */
    public function index(Request $request)
    {
        $query = Event::query();

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }
        if ($request->boolean('upcoming')) {
            $query->where('date', '>=', new \DateTime());
        }
        if ($request->boolean('featured')) {
            $query->where('isFeatured', true);
        }

        $perPage = (int) $request->get('per_page', 15);
        $events = $query->orderBy('date', 'asc')->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $events->items(),
            'meta' => [
                'total' => $events->total(),
                'per_page' => $events->perPage(),
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
            ],
        ]);
    }

    /** GET /events/{id} */
    public function show(string $id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['status' => 'error', 'message' => 'Event not found'], 404);
        }

        return response()->json(['status' => 'success', 'data' => $event]);
    }

    /** POST /events — admin only */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'date' => 'required',
            'category' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->all();
        if (isset($data['date']))
            $data['date'] = new \DateTime($data['date']);

        $event = Event::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Event created successfully',
            'data' => $event,
        ], 201);
    }

    /** PUT /events/{id} — admin only */
    public function update(Request $request, string $id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['status' => 'error', 'message' => 'Event not found'], 404);
        }

        $data = $request->all();
        if (isset($data['date']))
            $data['date'] = new \DateTime($data['date']);

        $event->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Event updated successfully',
            'data' => $event,
        ]);
    }

    /** DELETE /events/{id} — admin only */
    public function destroy(string $id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['status' => 'error', 'message' => 'Event not found'], 404);
        }

        $event->delete();

        return response()->json(['status' => 'success', 'message' => 'Event deleted successfully']);
    }
}
