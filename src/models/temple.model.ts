import mongoose from 'mongoose';

const TempleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    country: { type: String, default: 'India' },
    image: { type: String },
    description: { type: String },
    address: { type: String },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    contact: {
        email: { type: String },
        phone: { type: String },
        website: { type: String }
    },
    timings: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

TempleSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.models.Temple || mongoose.model('Temple', TempleSchema);
