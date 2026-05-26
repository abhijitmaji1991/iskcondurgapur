import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Tour from '@/models/tour.model';
import { handleApiError, apiSuccess } from '@/utils/errorHandler';
import { verifyAdmin } from '@/utils/authHelper';
import { toursFallbackDb } from '@/utils/toursFallbackDb';

export async function GET(request: NextRequest) {
    try {
        try {
            await dbConnect();
            const tours = await Tour.find({}).sort({ createdAt: -1 });
            return apiSuccess(tours);
        } catch (dbErr) {
            console.warn('Database offline, serving persistent fallback JSON database:', dbErr);
            const tours = toursFallbackDb.getAll();
            return apiSuccess(tours);
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
            const tour = await Tour.create(body);
            return apiSuccess(tour, 'Tour created successfully', 201);
        } catch (dbErr) {
            console.warn('Database offline, storing tour in fallback JSON database:', dbErr);
            const tour = toursFallbackDb.create(body);
            return apiSuccess(tour, 'Tour created successfully in fallback database', 201);
        }
    } catch (error) {
        return handleApiError(error);
    }
}
