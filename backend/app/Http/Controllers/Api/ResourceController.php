<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ResourceController extends Controller
{
    /** GET /resources — with type/category/search filters & pagination */
    public function index(Request $request)
    {
        $query = Resource::query();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $perPage = (int) $request->get('per_page', 15);
        $resources = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $resources->items(),
            'meta' => [
                'total' => $resources->total(),
                'per_page' => $resources->perPage(),
                'current_page' => $resources->currentPage(),
                'last_page' => $resources->lastPage(),
            ],
        ]);
    }

    /** GET /resources/{id} */
    public function show(string $id)
    {
        $resource = Resource::find($id);

        if (!$resource) {
            return response()->json(['status' => 'error', 'message' => 'Resource not found'], 404);
        }

        return response()->json(['status' => 'success', 'data' => $resource]);
    }

    /** POST /resources — admin only */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'type' => 'required|string',
            'category' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $resource = Resource::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Resource created successfully',
            'data' => $resource,
        ], 201);
    }

    /** PUT /resources/{id} — admin only */
    public function update(Request $request, string $id)
    {
        $resource = Resource::find($id);

        if (!$resource) {
            return response()->json(['status' => 'error', 'message' => 'Resource not found'], 404);
        }

        $resource->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Resource updated successfully',
            'data' => $resource,
        ]);
    }

    /** DELETE /resources/{id} — admin only */
    public function destroy(string $id)
    {
        $resource = Resource::find($id);

        if (!$resource) {
            return response()->json(['status' => 'error', 'message' => 'Resource not found'], 404);
        }

        $resource->delete();

        return response()->json(['status' => 'success', 'message' => 'Resource deleted successfully']);
    }
}
