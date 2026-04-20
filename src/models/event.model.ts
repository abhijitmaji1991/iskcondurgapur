import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String },
    category: { type: String, enum: ['Festival', 'Program', 'Lecture', 'Kirtan', 'Other'], default: 'Festival' },
    image: { type: String },
    organizer: { type: String },
    registrationLink: { type: String },
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

EventSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
