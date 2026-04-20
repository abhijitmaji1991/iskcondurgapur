import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Resource from '@/models/resource.model';
import { handleApiError, apiSuccess, AppError } from '@/utils/errorHandler';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const resource = await Resource.findById(params.id);
        if (!resource) {
            throw new AppError('Resource not found', 404);
        }
        return apiSuccess(resource);
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
        const resource = await Resource.findByIdAndUpdate(params.id, body, { new: true });
        if (!resource) {
            throw new AppError('Resource not found', 404);
        }
        return apiSuccess(resource, 'Resource updated successfully');
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
        const resource = await Resource.findByIdAndDelete(params.id);
        if (!resource) {
            throw new AppError('Resource not found', 404);
        }
        return apiSuccess(null, 'Resource deleted successfully');
    } catch (error) {
        return handleApiError(error);
    }
}
