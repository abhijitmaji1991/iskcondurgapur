import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Bhajan from '@/models/bhajan.model';
import { handleApiError, apiSuccess, AppError } from '@/utils/errorHandler';
import { bhajansFallbackDb } from '@/utils/bhajansFallbackDb';
import { verifyAdmin } from '@/utils/authHelper';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        try {
            await dbConnect();
            const bhajan = await Bhajan.findById(params.id);
            if (!bhajan) {
                throw new AppError('Bhajan not found', 404);
            }
            return apiSuccess(bhajan);
        } catch (dbErr) {
            console.warn('Database offline, returning fallback persistent bhajan detail:', dbErr);
            const bhajan = bhajansFallbackDb.getById(params.id);
            if (!bhajan) {
                throw new AppError('Bhajan not found', 404);
            }
            return apiSuccess(bhajan);
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

        try {
            await dbConnect();
            const body = await request.json();
            const bhajan = await Bhajan.findByIdAndUpdate(params.id, body, { new: true });
            if (!bhajan) {
                throw new AppError('Bhajan not found', 404);
            }
            return apiSuccess(bhajan, 'Bhajan updated successfully');
        } catch (dbErr) {
            console.warn('Database offline, updating persistent fallback JSON database:', dbErr);
            const body = await request.json();
            const bhajan = bhajansFallbackDb.update(params.id, body);
            if (!bhajan) {
                throw new AppError('Bhajan not found', 404);
            }
            return apiSuccess(bhajan, 'Bhajan updated successfully (Local Storage Mode)');
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
            const bhajan = await Bhajan.findByIdAndDelete(params.id);
            if (!bhajan) {
                throw new AppError('Bhajan not found', 404);
            }
            return apiSuccess(null, 'Bhajan deleted successfully');
        } catch (dbErr) {
            console.warn('Database offline, deleting from persistent fallback JSON database:', dbErr);
            const deleted = bhajansFallbackDb.delete(params.id);
            if (!deleted) {
                throw new AppError('Bhajan not found', 404);
            }
            return apiSuccess(null, 'Bhajan deleted successfully (Local Storage Mode)');
        }
    } catch (error) {
        return handleApiError(error);
    }
}
