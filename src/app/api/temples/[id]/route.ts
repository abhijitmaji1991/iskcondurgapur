import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Temple from '@/models/temple.model';
import { handleApiError, apiSuccess, AppError } from '@/utils/errorHandler';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const temple = await Temple.findById(params.id);
        if (!temple) {
            throw new AppError('Temple not found', 404);
        }
        return apiSuccess(temple);
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
        const temple = await Temple.findByIdAndUpdate(params.id, body, { new: true });
        if (!temple) {
            throw new AppError('Temple not found', 404);
        }
        return apiSuccess(temple, 'Temple updated successfully');
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
        const temple = await Temple.findByIdAndDelete(params.id);
        if (!temple) {
            throw new AppError('Temple not found', 404);
        }
        return apiSuccess(null, 'Temple deleted successfully');
    } catch (error) {
        return handleApiError(error);
    }
}
