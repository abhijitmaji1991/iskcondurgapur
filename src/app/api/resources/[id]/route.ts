import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Resource from '@/models/resource.model';
import { handleApiError, apiSuccess, AppError } from '@/utils/errorHandler';
import { verifyAdmin } from '@/utils/authHelper';
import { resourcesFallbackDb } from '@/utils/resourcesFallbackDb';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        try {
            await dbConnect();
            const resource = await Resource.findById(params.id);
            if (!resource) {
                throw new AppError('Resource not found', 404);
            }
            return apiSuccess(resource);
        } catch (dbErr) {
            console.warn('Database offline, retrieving resource from fallback JSON database');
            const resource = resourcesFallbackDb.getById(params.id);
            if (!resource) {
                throw new AppError('Resource not found in fallback database', 404);
            }
            return apiSuccess(resource);
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
            const resource = await Resource.findByIdAndUpdate(params.id, body, { new: true });
            if (!resource) {
                throw new AppError('Resource not found', 404);
            }
            return apiSuccess(resource, 'Resource updated successfully');
        } catch (dbErr) {
            console.warn('Database offline, updating resource in fallback JSON database');
            const resource = resourcesFallbackDb.update(params.id, body);
            if (!resource) {
                throw new AppError('Resource not found in fallback database', 404);
            }
            return apiSuccess(resource, 'Resource updated successfully in fallback database');
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
            const resource = await Resource.findByIdAndDelete(params.id);
            if (!resource) {
                throw new AppError('Resource not found', 404);
            }
            return apiSuccess(null, 'Resource deleted successfully');
        } catch (dbErr) {
            console.warn('Database offline, deleting resource from fallback JSON database');
            const success = resourcesFallbackDb.delete(params.id);
            if (!success) {
                throw new AppError('Resource not found in fallback database', 404);
            }
            return apiSuccess(null, 'Resource deleted successfully from fallback database');
        }
    } catch (error) {
        return handleApiError(error);
    }
}
