import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
    contactPhone: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    contactAddress: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' },
    instagramUrl: { type: String, default: '' },
    noticeBannerText: { type: String, default: '' },
    noticeBannerEnabled: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now }
});

SettingsSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
