<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Temple;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TempleController extends Controller
{
    /** GET /temples — with search/country filter */
    public function index(Request $request)
    {
        $query = Temple::query();

        if ($request->filled('country')) {
            $query->where('country', $request->country);
        }
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $temples = $query->orderBy('name', 'asc')->get();

        return response()->json(['status' => 'success', 'data' => $temples]);
    }

    /** GET /temples/{id} */
    public function show(string $id)
    {
        $temple = Temple::find($id);

        if (!$temple) {
            return response()->json(['status' => 'error', 'message' => 'Temple not found'], 404);
        }

        return response()->json(['status' => 'success', 'data' => $temple]);
    }

    /** POST /temples — admin only */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'location' => 'required|string',
            'country' => 'required|string',
            'description' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $temple = Temple::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Temple created successfully',
            'data' => $temple,
        ], 201);
    }

    /** PUT /temples/{id} — admin only */
    public function update(Request $request, string $id)
    {
        $temple = Temple::find($id);

        if (!$temple) {
            return response()->json(['status' => 'error', 'message' => 'Temple not found'], 404);
        }

        $temple->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Temple updated successfully',
            'data' => $temple,
        ]);
    }

    /** DELETE /temples/{id} — admin only */
    public function destroy(string $id)
    {
        $temple = Temple::find($id);

        if (!$temple) {
            return response()->json(['status' => 'error', 'message' => 'Temple not found'], 404);
        }

        $temple->delete();

        return response()->json(['status' => 'success', 'message' => 'Temple deleted successfully']);
    }
}
