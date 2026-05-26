import { NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import TourRegistration from '@/models/tour-registration.model';
import { tourRegistrationsFallbackDb } from '@/utils/tourRegistrationsFallbackDb';
import { handleApiError, apiSuccess } from '@/utils/errorHandler';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { tourId, tourName, name, email, phone, seats, date, notes, totalCost } = body;

        if (!tourId || !tourName || !name || !email || !phone || !seats || !date || totalCost === undefined) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        try {
            await dbConnect();
            const newRegistration = await TourRegistration.create({
                tourId,
                tourName,
                name,
                email,
                phone,
                seats: Number(seats),
                date,
                notes: notes || '',
                status: 'pending',
                totalCost: Number(totalCost)
            });
            // Also sync/mirror with fallback DB
            tourRegistrationsFallbackDb.create({
                _id: newRegistration._id.toString(),
                id: newRegistration._id.toString(),
                tourId,
                tourName,
                name,
                email,
                phone,
                seats: Number(seats),
                date,
                notes: notes || '',
                status: 'pending',
                totalCost: Number(totalCost),
                createdAt: newRegistration.createdAt.toISOString(),
                updatedAt: newRegistration.updatedAt.toISOString()
            });
            return apiSuccess(newRegistration, 'Registration submitted successfully');
        } catch (dbErr) {
            console.warn('Database offline, saving tour registration to local fallback JSON:', dbErr);
            const fallbackReg = tourRegistrationsFallbackDb.create({
                tourId,
                tourName,
                name,
                email,
                phone,
                seats: Number(seats),
                date,
                notes: notes || '',
                status: 'pending',
                totalCost: Number(totalCost)
            });
            return apiSuccess(fallbackReg, 'Registration submitted successfully (offline database)');
        }
    } catch (error) {
        return handleApiError(error);
    }
}
