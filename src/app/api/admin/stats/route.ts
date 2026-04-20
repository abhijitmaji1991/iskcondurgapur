import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Temple from '@/models/temple.model';
import Event from '@/models/event.model';
import Resource from '@/models/resource.model';
import Alert from '@/models/alert.model';
import User from '@/models/user.model';
import { handleApiError, apiSuccess, AppError } from '@/utils/errorHandler';

export async function GET(request: NextRequest) {
    try {
        const authToken = request.cookies.get('iskcon_admin_token') || request.headers.get('Authorization')?.split(' ')[1];
        if (!authToken) {
            throw new AppError('Unauthorized', 401);
        }

        await dbConnect();

        const [templeCount, eventCount, resourceCount, alertCount, userCount] = await Promise.all([
            Temple.countDocuments(),
            Event.countDocuments(),
            Resource.countDocuments(),
            Alert.countDocuments({ resolved: false }),
            User.countDocuments()
        ]);

        return apiSuccess({
            temples: templeCount,
            events: eventCount,
            resources: resourceCount,
            alerts: alertCount,
            users: userCount
        });
    } catch (error) {
        return handleApiError(error);
    }
}
