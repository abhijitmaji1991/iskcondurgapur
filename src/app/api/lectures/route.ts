import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Lecture from '@/models/lecture.model';
import { handleApiError, apiSuccess } from '@/utils/errorHandler';
import { verifyAdmin } from '@/utils/authHelper';
import { lecturesFallbackDb } from '@/utils/lecturesFallbackDb';

export async function GET(request: NextRequest) {
    try {
        try {
            await dbConnect();
            const lectures = await Lecture.find({ isPublished: true }).sort({ code: -1 });
            return apiSuccess(lectures);
        } catch (dbErr) {
            console.warn('Database offline, serving persistent fallback JSON database for lectures:', dbErr);
            const lectures = lecturesFallbackDb.getAll().filter(l => l.isPublished !== false);
            return apiSuccess(lectures);
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
            const lecture = await Lecture.create(body);
            return apiSuccess(lecture, 'Lecture created successfully', 201);
        } catch (dbErr) {
            console.warn('Database offline, storing lecture in fallback JSON database:', dbErr);
            const lecture = lecturesFallbackDb.create(body);
            return apiSuccess(lecture, 'Lecture created successfully in fallback database', 201);
        }
    } catch (error) {
        return handleApiError(error);
    }
}
