import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/utils/db';
import Temple from '@/models/temple.model';
import Event from '@/models/event.model';
import Resource from '@/models/resource.model';
import Alert from '@/models/alert.model';
import User from '@/models/user.model';
import Bhajan from '@/models/bhajan.model';
import Tour from '@/models/tour.model';
import { handleApiError, apiSuccess, AppError } from '@/utils/errorHandler';
import { templesFallbackDb } from '@/utils/templesFallbackDb';
import { eventsFallbackDb } from '@/utils/eventsFallbackDb';
import { resourcesFallbackDb } from '@/utils/resourcesFallbackDb';
import { bhajansFallbackDb } from '@/utils/bhajansFallbackDb';
import { toursFallbackDb } from '@/utils/toursFallbackDb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ─── Simple in-memory cache (avoids hammering DB on every dashboard load) ───
const CACHE_TTL_MS = 30_000; // 30 seconds
let cachedStats: Record<string, number> | null = null;
let cacheExpiresAt = 0;

export async function GET(request: NextRequest) {
    try {
        const authToken = request.cookies.get('iskcon_admin_token')?.value
            || request.headers.get('Authorization')?.split(' ')[1];
        if (!authToken) {
            throw new AppError('Unauthorized', 401);
        }

        // Verify the JWT token
        try {
            verify(authToken, JWT_SECRET);
        } catch (jwtErr) {
            throw new AppError('Unauthorized: Invalid token signature', 401);
        }

        // Return cached stats if still fresh
        if (cachedStats && Date.now() < cacheExpiresAt) {
            return apiSuccess(cachedStats, 'ok', 200);
        }

        let templeCount = 1;
        let eventCount = 4;
        let resourceCount = 12;
        let alertCount = 0;
        let userCount = 2;
        let bhajanCount = 4;
        let tourCount = 6;

        try {
            await dbConnect();

            const [tCount, eCount, rCount, aCount, uCount, bCount, toCount] = await Promise.all([
                Temple.countDocuments(),
                Event.countDocuments(),
                Resource.countDocuments(),
                Alert.countDocuments({ resolved: false }),
                User.countDocuments(),
                Bhajan.countDocuments(),
                Tour.countDocuments()
            ]);

            templeCount = tCount;
            eventCount = eCount;
            resourceCount = rCount;
            alertCount = aCount;
            userCount = uCount;
            bhajanCount = bCount;
            tourCount = toCount;
        } catch (err) {
            console.warn('Database offline, serving fallback statistics:', err);
            templeCount = templesFallbackDb.getAll().length;
            eventCount = eventsFallbackDb.getAll().length;
            resourceCount = resourcesFallbackDb.getAll().length;
            bhajanCount = bhajansFallbackDb.getAll().length;
            tourCount = toursFallbackDb.getAll().length;
            alertCount = 0;
            userCount = 1; // Default offline count
        }

        const stats = {
            temples: templeCount,
            events: eventCount,
            resources: resourceCount,
            alerts: alertCount,
            users: userCount,
            bhajans: bhajanCount,
            tours: tourCount
        };

        // Store in cache
        cachedStats = stats;
        cacheExpiresAt = Date.now() + CACHE_TTL_MS;

        const res = apiSuccess(stats);
        return res;
    } catch (error) {
        return handleApiError(error);
    }
}
