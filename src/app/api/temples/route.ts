import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Temple from '@/models/temple.model';
import { handleApiError, apiSuccess, AppError } from '@/utils/errorHandler';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const temples = await Temple.find({}).sort({ createdAt: -1 });
        return apiSuccess(temples);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check authentication (simplified)
        const authToken = request.cookies.get('iskcon_admin_token');
        if (!authToken) {
            throw new AppError('Unauthorized', 401);
        }

        await dbConnect();
        const body = await request.json();
        const temple = await Temple.create(body);
        return apiSuccess(temple, 'Temple created successfully', 201);
    } catch (error) {
        return handleApiError(error);
    }
}
