import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Resource from '@/models/resource.model';
import { handleApiError, apiSuccess } from '@/utils/errorHandler';
import { verifyAdmin } from '@/utils/authHelper';
import { resourcesFallbackDb } from '@/utils/resourcesFallbackDb';

export async function GET(request: NextRequest) {
    try {
        try {
            await dbConnect();
            const resources = await Resource.find({}).sort({ createdAt: -1 });
            return apiSuccess(resources);
        } catch (dbErr) {
            console.warn('Database offline, serving persistent fallback JSON database for resources:', dbErr);
            const resources = resourcesFallbackDb.getAll();
            return apiSuccess(resources);
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
            const resource = await Resource.create(body);
            return apiSuccess(resource, 'Resource created successfully', 201);
        } catch (dbErr) {
            console.warn('Database offline, storing resource in fallback JSON database:', dbErr);
            const resource = resourcesFallbackDb.create(body);
            return apiSuccess(resource, 'Resource created successfully in fallback database', 201);
        }
    } catch (error) {
        return handleApiError(error);
    }
}
