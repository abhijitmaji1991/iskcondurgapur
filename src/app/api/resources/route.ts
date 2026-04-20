import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Resource from '@/models/resource.model';
import { handleApiError, apiSuccess, AppError } from '@/utils/errorHandler';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const resources = await Resource.find({}).sort({ createdAt: -1 });
        return apiSuccess(resources);
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
        const resource = await Resource.create(body);
        return apiSuccess(resource, 'Resource created successfully', 201);
    } catch (error) {
        return handleApiError(error);
    }
}
