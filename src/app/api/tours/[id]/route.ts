import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Tour from '@/models/tour.model';
import { handleApiError, apiSuccess, AppError } from '@/utils/errorHandler';
import { verifyAdmin } from '@/utils/authHelper';
import { toursFallbackDb } from '@/utils/toursFallbackDb';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        try {
            await dbConnect();
            const tour = await Tour.findById(params.id);
            if (!tour) {
                throw new AppError('Tour not found', 404);
            }
            return apiSuccess(tour);
        } catch (dbErr) {
            console.warn('Database offline, retrieving tour from fallback JSON database');
            const tour = toursFallbackDb.getById(params.id);
            if (!tour) {
                throw new AppError('Tour not found in fallback database', 404);
            }
            return apiSuccess(tour);
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
            const tour = await Tour.findByIdAndUpdate(params.id, body, { new: true });
            if (!tour) {
                throw new AppError('Tour not found', 404);
            }
            return apiSuccess(tour, 'Tour updated successfully');
        } catch (dbErr) {
            console.warn('Database offline, updating tour in fallback JSON database');
            const tour = toursFallbackDb.update(params.id, body);
            if (!tour) {
                throw new AppError('Tour not found in fallback database', 404);
            }
            return apiSuccess(tour, 'Tour updated successfully in fallback database');
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
            const tour = await Tour.findByIdAndDelete(params.id);
            if (!tour) {
                throw new AppError('Tour not found', 404);
            }
            return apiSuccess(null, 'Tour deleted successfully');
        } catch (dbErr) {
            console.warn('Database offline, deleting tour from fallback JSON database');
            const success = toursFallbackDb.delete(params.id);
            if (!success) {
                throw new AppError('Tour not found in fallback database', 404);
            }
            return apiSuccess(null, 'Tour deleted successfully from fallback database');
        }
    } catch (error) {
        return handleApiError(error);
    }
}
