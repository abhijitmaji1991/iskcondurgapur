import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Event from '@/models/event.model';
import { handleApiError, apiSuccess, AppError } from '@/utils/errorHandler';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const events = await Event.find({}).sort({ date: 1 });
        return apiSuccess(events);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const authToken = request.cookies.get('iskcon_admin_token');
        if (!authToken) {
            throw new AppError('Unauthorized', 401);
        }

        await dbConnect();
        const body = await request.json();
        const event = await Event.create(body);
        return apiSuccess(event, 'Event created successfully', 201);
    } catch (error) {
        return handleApiError(error);
    }
}
