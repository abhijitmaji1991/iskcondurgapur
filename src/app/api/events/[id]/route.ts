import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Event from '@/models/event.model';
import { handleApiError, apiSuccess, AppError } from '@/utils/errorHandler';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const event = await Event.findById(params.id);
        if (!event) {
            throw new AppError('Event not found', 404);
        }
        return apiSuccess(event);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authToken = request.cookies.get('iskcon_admin_token');
        if (!authToken) {
            throw new AppError('Unauthorized', 401);
        }

        await dbConnect();
        const body = await request.json();
        const event = await Event.findByIdAndUpdate(params.id, body, { new: true });
        if (!event) {
            throw new AppError('Event not found', 404);
        }
        return apiSuccess(event, 'Event updated successfully');
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authToken = request.cookies.get('iskcon_admin_token');
        if (!authToken) {
            throw new AppError('Unauthorized', 401);
        }

        await dbConnect();
        const event = await Event.findByIdAndDelete(params.id);
        if (!event) {
            throw new AppError('Event not found', 404);
        }
        return apiSuccess(null, 'Event deleted successfully');
    } catch (error) {
        return handleApiError(error);
    }
}
