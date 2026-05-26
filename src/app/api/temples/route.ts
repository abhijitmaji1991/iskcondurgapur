import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Temple from '@/models/temple.model';
import { handleApiError, apiSuccess } from '@/utils/errorHandler';
import { verifyAdmin } from '@/utils/authHelper';
import { templesFallbackDb } from '@/utils/templesFallbackDb';

export async function GET(request: NextRequest) {
    try {
        try {
            await dbConnect();
            const temples = await Temple.find({}).sort({ createdAt: -1 });
            return apiSuccess(temples);
        } catch (dbErr) {
            console.warn('Database offline, serving persistent fallback JSON database:', dbErr);
            const temples = templesFallbackDb.getAll();
            return apiSuccess(temples);
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
            const temple = await Temple.create(body);
            return apiSuccess(temple, 'Temple created successfully', 201);
        } catch (dbErr) {
            console.warn('Database offline, storing temple in fallback JSON database:', dbErr);
            const temple = templesFallbackDb.create(body);
            return apiSuccess(temple, 'Temple created successfully in fallback database', 201);
        }
    } catch (error) {
        return handleApiError(error);
    }
}
