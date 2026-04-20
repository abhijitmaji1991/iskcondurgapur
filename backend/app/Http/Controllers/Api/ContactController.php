<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /** POST /contact — public */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|email',
            'subject' => 'required|string|max:200',
            'message' => 'required|string|max:2000',
            'phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $msg = ContactMessage::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone ?? null,
            'subject' => $request->subject,
            'message' => $request->message,
            'is_read' => false,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Your message has been received. We will respond within 24 hours.',
            'data' => ['id' => $msg->id],
        ], 201);
    }

    /** GET /contact — admin only, list all messages */
    public function index(Request $request)
    {
        $query = ContactMessage::query();

        if ($request->boolean('unread')) {
            $query->unread();
        }

        $perPage = (int) $request->get('per_page', 20);
        $messages = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $messages->items(),
            'meta' => [
                'total' => $messages->total(),
                'unread_count' => ContactMessage::unread()->count(),
                'per_page' => $messages->perPage(),
                'current_page' => $messages->currentPage(),
                'last_page' => $messages->lastPage(),
            ],
        ]);
    }

    /** PATCH /contact/{id}/read — admin only */
    public function markRead(string $id)
    {
        $msg = ContactMessage::find($id);

        if (!$msg) {
            return response()->json(['status' => 'error', 'message' => 'Message not found'], 404);
        }

        $msg->update(['is_read' => true]);

        return response()->json(['status' => 'success', 'message' => 'Marked as read']);
    }

    /** DELETE /contact/{id} — admin only */
    public function destroy(string $id)
    {
        $msg = ContactMessage::find($id);

        if (!$msg) {
            return response()->json(['status' => 'error', 'message' => 'Message not found'], 404);
        }

        $msg->delete();

        return response()->json(['status' => 'success', 'message' => 'Message deleted']);
    }
}
