import { NextResponse } from 'next/server';
import logger from './logger';

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 400,
        public details?: any
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export function handleApiError(error: any) {
    logger.error('API Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        details: error.details
    });

    if (error instanceof AppError) {
        return NextResponse.json(
            { message: error.message, details: error.details },
            { status: error.statusCode }
        );
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
        return NextResponse.json(
            { message: 'Validation Error', details: error.errors },
            { status: 400 }
        );
    }

    // Default error
    return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
    );
}

export function apiSuccess(data: any, message: string = 'Success', status: number = 200) {
    return NextResponse.json(
        { message, data },
        { status }
    );
}
