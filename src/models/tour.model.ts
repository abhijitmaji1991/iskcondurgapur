import mongoose from 'mongoose';

const ItineraryDaySchema = new mongoose.Schema({
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    activities: [{ type: String }]
});

const TourSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 5.0 },
    groupSize: { type: String, required: true },
    dates: [{ type: String }],
    category: { type: String, required: true },
    features: [{ type: String }],
    highlights: [{ type: String }],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    gallery: [{ type: String }],
    itinerary: [ItineraryDaySchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

TourSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.models.Tour || mongoose.model('Tour', TourSchema);
