import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
    contactPhone: string;
    contactEmail: string;
    contactAddress: string;
    whatsappNumber: string;
    facebookUrl: string;
    youtubeUrl: string;
    twitterUrl: string;
    instagramUrl: string;
    noticeBannerText: string;
    noticeBannerEnabled: boolean;
}

const SettingSchema: Schema = new Schema({
    contactPhone: { type: String, default: '+1 (310) 836-2676' },
    contactEmail: { type: String, default: 'info.iskcondurgapur@gmail.com' },
    contactAddress: { type: String, default: 'ISKCON Durgapur, Netaji Subhas Chandra Bose Road, A-Zone, Durgapur, West Bengal, India 713204' },
    whatsappNumber: { type: String, default: '919563786224' },
    facebookUrl: { type: String, default: 'https://www.facebook.com/profile.php?id=61571919518223' },
    youtubeUrl: { type: String, default: 'https://www.youtube.com/@iskcondurgapurofficial957' },
    twitterUrl: { type: String, default: 'https://twitter.com/iskcon' },
    instagramUrl: { type: String, default: 'https://instagram.com/iskcon' },
    noticeBannerText: { type: String, default: 'Welcome to ISKCON Durgapur!' },
    noticeBannerEnabled: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);
