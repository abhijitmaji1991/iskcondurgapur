import { NextRequest } from 'next/server';
import dbConnect from '@/utils/db';
import Settings from '@/models/settings.model';
import { handleApiError, apiSuccess } from '@/utils/errorHandler';
import { verifyAdmin } from '@/utils/authHelper';
import fs from 'fs';
import path from 'path';

// Minimal JSON fallback for settings
const SETTINGS_FALLBACK_FILE = path.join(process.cwd(), 'data', 'settings.json');
const getFallbackSettings = () => {
    try {
        if (fs.existsSync(SETTINGS_FALLBACK_FILE)) {
            return JSON.parse(fs.readFileSync(SETTINGS_FALLBACK_FILE, 'utf8'));
        }
    } catch (e) {}
    return {
        contactPhone: '', contactEmail: '', contactAddress: '',
        whatsappNumber: '', facebookUrl: '', youtubeUrl: '',
        twitterUrl: '', instagramUrl: '', noticeBannerText: '',
        noticeBannerEnabled: false
    };
};

const saveFallbackSettings = (data: any) => {
    try {
        const dir = path.dirname(SETTINGS_FALLBACK_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(SETTINGS_FALLBACK_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error('Failed to save fallback settings', e);
    }
};

export async function GET(request: NextRequest) {
    try {
        try {
            await dbConnect();
            let settings = await Settings.findOne();
            if (!settings) {
                // Return default empty settings if none exist
                settings = new Settings({});
            }
            return apiSuccess(settings);
        } catch (dbErr) {
            console.warn('Database offline, using fallback settings:', dbErr);
            return apiSuccess(getFallbackSettings());
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
            // There should only be one settings document
            let settings = await Settings.findOne();
            if (settings) {
                settings = await Settings.findByIdAndUpdate(settings._id, body, { new: true });
            } else {
                settings = await Settings.create(body);
            }
            return apiSuccess(settings, 'Settings updated successfully');
        } catch (dbErr) {
            console.warn('Database offline, updating fallback settings:', dbErr);
            const current = getFallbackSettings();
            const updated = { ...current, ...body };
            saveFallbackSettings(updated);
            return apiSuccess(updated, 'Settings updated successfully in fallback database');
        }
    } catch (error) {
        return handleApiError(error);
    }
}
