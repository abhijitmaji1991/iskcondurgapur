import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Event from '@/models/event.model';
import { handleApiError, apiSuccess, AppError } from '@/utils/errorHandler';
import { verifyAdmin } from '@/utils/authHelper';
import { eventsFallbackDb } from '@/utils/eventsFallbackDb';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        try {
            await dbConnect();
            const event = await Event.findById(params.id);
            if (!event) {
                throw new AppError('Event not found', 404);
            }
            return apiSuccess(event);
        } catch (dbErr) {
            console.warn('Database offline, retrieving event from fallback JSON database');
            const event = eventsFallbackDb.getById(params.id);
            if (!event) {
                throw new AppError('Event not found in fallback database', 404);
            }
            return apiSuccess(event);
        }
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        verifyAdmin(request);
        const body = await request.json();

        try {
            await dbConnect();
            const event = await Event.findByIdAndUpdate(params.id, body, { new: true });
            if (!event) {
                throw new AppError('Event not found', 404);
            }
            return apiSuccess(event, 'Event updated successfully');
        } catch (dbErr) {
            console.warn('Database offline, updating event in fallback JSON database');
            const event = eventsFallbackDb.update(params.id, body);
            if (!event) {
                throw new AppError('Event not found in fallback database', 404);
            }
            return apiSuccess(event, 'Event updated successfully in fallback database');
        }
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        verifyAdmin(request);

        try {
            await dbConnect();
            const event = await Event.findByIdAndDelete(params.id);
            if (!event) {
                throw new AppError('Event not found', 404);
            }
            return apiSuccess(null, 'Event deleted successfully');
        } catch (dbErr) {
            console.warn('Database offline, deleting event from fallback JSON database');
            const success = eventsFallbackDb.delete(params.id);
            if (!success) {
                throw new AppError('Event not found in fallback database', 404);
            }
            return apiSuccess(null, 'Event deleted successfully from fallback database');
        }
    } catch (error) {
        return handleApiError(error);
    }
}
