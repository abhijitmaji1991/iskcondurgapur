import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import TourRegistration from '@/models/tour-registration.model';
import { tourRegistrationsFallbackDb } from '@/utils/tourRegistrationsFallbackDb';
import { handleApiError, apiSuccess } from '@/utils/errorHandler';
import { verifyAdmin } from '@/utils/authHelper';

export async function GET(request: NextRequest) {
    try {
        verifyAdmin(request);
        try {
            await dbConnect();
            const list = await TourRegistration.find({}).sort({ createdAt: -1 });
            return apiSuccess(list);
        } catch (dbErr) {
            console.warn('Database offline, loading registrations from fallback JSON:', dbErr);
            const list = tourRegistrationsFallbackDb.getAll().sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            return apiSuccess(list);
        }
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(request: NextRequest) {
    try {
        verifyAdmin(request);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Missing ID' }, { status: 400 });
        }

        const body = await request.json();
        const { status } = body;

        if (!status || !['pending', 'approved', 'cancelled'].includes(status)) {
            return NextResponse.json({ message: 'Invalid or missing status' }, { status: 400 });
        }

        try {
            await dbConnect();
            const updated = await TourRegistration.findByIdAndUpdate(id, { status }, { new: true });
            if (!updated) {
                return NextResponse.json({ message: 'Registration not found' }, { status: 404 });
            }
            // Update fallback db too
            tourRegistrationsFallbackDb.update(id, { status });
            return apiSuccess(updated, 'Status updated successfully');
        } catch (dbErr) {
            console.warn('Database offline, updating registration status in fallback JSON:', dbErr);
            const updated = tourRegistrationsFallbackDb.update(id, { status });
            if (!updated) {
                return NextResponse.json({ message: 'Registration not found' }, { status: 404 });
            }
            return apiSuccess(updated, 'Status updated successfully in fallback database');
        }
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(request: NextRequest) {
    try {
        verifyAdmin(request);
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ message: 'Missing ID' }, { status: 400 });
        }

        try {
            await dbConnect();
            const deleted = await TourRegistration.findByIdAndDelete(id);
            if (!deleted) {
                return NextResponse.json({ message: 'Registration not found' }, { status: 404 });
            }
            tourRegistrationsFallbackDb.delete(id);
            return apiSuccess(deleted, 'Registration deleted successfully');
        } catch (dbErr) {
            console.warn('Database offline, deleting registration in fallback JSON:', dbErr);
            const deleted = tourRegistrationsFallbackDb.delete(id);
            if (!deleted) {
                return NextResponse.json({ message: 'Registration not found' }, { status: 404 });
            }
            return apiSuccess({ id }, 'Registration deleted successfully from fallback database');
        }
    } catch (error) {
        return handleApiError(error);
    }
}
