import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Setting from '@/models/setting.model';
import { handleApiError, apiSuccess } from '@/utils/errorHandler';
import { verifyAdmin } from '@/utils/authHelper';
import { settingsFallbackDb, DEFAULT_SETTINGS } from '@/utils/settingsFallbackDb';

export async function GET(request: NextRequest) {
    try {
        try {
            await dbConnect();
            let setting = await Setting.findOne({});
            if (!setting) {
                setting = await Setting.create(DEFAULT_SETTINGS);
            }
            return apiSuccess(setting);
        } catch (dbErr) {
            console.warn('Database offline, serving persistent fallback settings JSON:', dbErr);
            const setting = settingsFallbackDb.get();
            return apiSuccess(setting);
        }
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(request: NextRequest) {
    try {
        verifyAdmin(request);
        const body = await request.json();

        try {
            await dbConnect();
            let setting = await Setting.findOne({});
            if (setting) {
                setting = await Setting.findByIdAndUpdate(setting._id, body, { new: true });
            } else {
                setting = await Setting.create(body);
            }
            // Sync with fallback DB
            settingsFallbackDb.update(body);
            return apiSuccess(setting, 'Settings updated successfully');
        } catch (dbErr) {
            console.warn('Database offline, storing settings in fallback JSON database:', dbErr);
            const setting = settingsFallbackDb.update(body);
            return apiSuccess(setting, 'Settings updated successfully in fallback database');
        }
    } catch (error) {
        return handleApiError(error);
    }
}
