import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Course from '@/models/course.model';
import { handleApiError, apiSuccess } from '@/utils/errorHandler';
import { verifyAdmin } from '@/utils/authHelper';
import { coursesFallbackDb } from '@/utils/coursesFallbackDb';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const level = searchParams.get('level');
        const status = searchParams.get('status');
        
        try {
            await dbConnect();
            
            let query: any = {};
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
            if (level && level !== 'All') {
                query.level = level;
            }
            if (status && status !== 'All') {
                query.status = status;
            }
            
            const courses = await Course.find(query).sort({ createdAt: -1 });
            return apiSuccess(courses);
        } catch (dbErr) {
            console.warn('Database offline, serving persistent fallback JSON database for courses:', dbErr);
            let courses = coursesFallbackDb.getAll();
            
            if (search) {
                courses = courses.filter((c: any) => 
                    (c.title && c.title.toLowerCase().includes(search.toLowerCase())) ||
                    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
                );
            }
            if (level && level !== 'All') {
                courses = courses.filter((c: any) => c.level === level);
            }
            if (status && status !== 'All') {
                courses = courses.filter((c: any) => c.status === status);
            }
            
            return apiSuccess(courses);
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
            const course = await Course.create(body);
            return apiSuccess(course, 'Course created successfully', 201);
        } catch (dbErr) {
            console.warn('Database offline, storing course in fallback JSON database:', dbErr);
            const course = coursesFallbackDb.create(body);
            return apiSuccess(course, 'Course created successfully in fallback database', 201);
        }
    } catch (error) {
        return handleApiError(error);
    }
}
