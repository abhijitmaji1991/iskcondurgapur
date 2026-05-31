import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Course from '@/models/course.model';
import { handleApiError, apiSuccess } from '@/utils/errorHandler';
import { verifyAdmin } from '@/utils/authHelper';
import { coursesFallbackDb } from '@/utils/coursesFallbackDb';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        try {
            await dbConnect();
            const course = await Course.findById(params.id);
            if (!course) throw new Error('Course not found');
            return apiSuccess(course);
        } catch (dbErr) {
            console.warn('Database offline, using fallback for course:', dbErr);
            const course = coursesFallbackDb.getById(params.id);
            if (!course) throw new Error('Course not found');
            return apiSuccess(course);
        }
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        verifyAdmin(request);
        const body = await request.json();
        
        try {
            await dbConnect();
            const course = await Course.findByIdAndUpdate(params.id, body, { new: true });
            if (!course) throw new Error('Course not found');
            return apiSuccess(course, 'Course updated successfully');
        } catch (dbErr) {
            console.warn('Database offline, updating fallback course:', dbErr);
            const course = coursesFallbackDb.update(params.id, body);
            if (!course) throw new Error('Course not found');
            return apiSuccess(course, 'Course updated successfully in fallback database');
        }
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        verifyAdmin(request);
        
        try {
            await dbConnect();
            const course = await Course.findByIdAndDelete(params.id);
            if (!course) throw new Error('Course not found');
            return apiSuccess(null, 'Course deleted successfully');
        } catch (dbErr) {
            console.warn('Database offline, deleting fallback course:', dbErr);
            const success = coursesFallbackDb.delete(params.id);
            if (!success) throw new Error('Course not found');
            return apiSuccess(null, 'Course deleted successfully from fallback database');
        }
    } catch (error) {
        return handleApiError(error);
    }
}
