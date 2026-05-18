import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/db';
import Temple from '@/models/temple.model';
import Event from '@/models/event.model';
import Resource from '@/models/resource.model';
import Alert from '@/models/alert.model';
import User from '@/models/user.model';
import Bhajan from '@/models/bhajan.model';
import { handleApiError, apiSuccess, AppError } from '@/utils/errorHandler';

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

        try {
            await dbConnect();

            const [tCount, eCount, rCount, aCount, uCount, bCount] = await Promise.all([
                Temple.countDocuments(),
                Event.countDocuments(),
                Resource.countDocuments(),
                Alert.countDocuments({ resolved: false }),
                User.countDocuments(),
                Bhajan.countDocuments()
            ]);

            templeCount = tCount;
            eventCount = eCount;
            resourceCount = rCount;
            alertCount = aCount;
            userCount = uCount;
            bhajanCount = bCount;
        } catch (err) {
            console.warn('Database offline, serving fallback statistics:', err);
        }

        const stats = {
            temples: templeCount,
            events: eventCount,
            resources: resourceCount,
            alerts: alertCount,
            users: userCount,
            bhajans: bhajanCount
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
