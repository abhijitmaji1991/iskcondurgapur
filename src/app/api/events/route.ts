import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Event from '@/models/event.model';
import { handleApiError, apiSuccess } from '@/utils/errorHandler';
import { verifyAdmin } from '@/utils/authHelper';
import { eventsFallbackDb } from '@/utils/eventsFallbackDb';

export async function GET(request: NextRequest) {
    try {
        try {
            await dbConnect();
            const events = await Event.find({}).sort({ date: 1 });
            return apiSuccess(events);
        } catch (dbErr) {
            console.warn('Database offline, serving persistent fallback JSON database for events:', dbErr);
            const events = eventsFallbackDb.getAll();
            return apiSuccess(events);
        }
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        verifyAdmin(request);
        const body = await request.json();
        
        try {
            await dbConnect();
            const event = await Event.create(body);
            return apiSuccess(event, 'Event created successfully', 201);
        } catch (dbErr) {
            console.warn('Database offline, storing event in fallback JSON database:', dbErr);
            const event = eventsFallbackDb.create(body);
            return apiSuccess(event, 'Event created successfully in fallback database', 201);
        }
    } catch (error) {
        return handleApiError(error);
    }
}
