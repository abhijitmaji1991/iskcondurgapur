import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Temple from '@/models/temple.model';
import { handleApiError, apiSuccess, AppError } from '@/utils/errorHandler';
import { verifyAdmin } from '@/utils/authHelper';
import { templesFallbackDb } from '@/utils/templesFallbackDb';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        try {
            await dbConnect();
            const temple = await Temple.findById(params.id);
            if (!temple) {
                throw new AppError('Temple not found', 404);
            }
            return apiSuccess(temple);
        } catch (dbErr) {
            console.warn('Database offline, retrieving temple from fallback JSON database');
            const temple = templesFallbackDb.getById(params.id);
            if (!temple) {
                throw new AppError('Temple not found in fallback database', 404);
            }
            return apiSuccess(temple);
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
            const temple = await Temple.findByIdAndUpdate(params.id, body, { new: true });
            if (!temple) {
                throw new AppError('Temple not found', 404);
            }
            return apiSuccess(temple, 'Temple updated successfully');
        } catch (dbErr) {
            console.warn('Database offline, updating temple in fallback JSON database');
            const temple = templesFallbackDb.update(params.id, body);
            if (!temple) {
                throw new AppError('Temple not found in fallback database', 404);
            }
            return apiSuccess(temple, 'Temple updated successfully in fallback database');
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
            const temple = await Temple.findByIdAndDelete(params.id);
            if (!temple) {
                throw new AppError('Temple not found', 404);
            }
            return apiSuccess(null, 'Temple deleted successfully');
        } catch (dbErr) {
            console.warn('Database offline, deleting temple from fallback JSON database');
            const success = templesFallbackDb.delete(params.id);
            if (!success) {
                throw new AppError('Temple not found in fallback database', 404);
            }
            return apiSuccess(null, 'Temple deleted successfully from fallback database');
        }
    } catch (error) {
        return handleApiError(error);
    }
}
