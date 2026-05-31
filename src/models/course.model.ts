import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    tagline: { type: String },
    description: { type: String },
    image: { type: String },
    banner_color: { type: String },
    duration: { type: String },
    schedule: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    instructor: { type: String },
    instructor_title: { type: String },
    level: { type: String },
    category: { type: String },
    rating: { type: Number, default: 0 },
    enrolled_count: { type: Number, default: 0 },
    max_seats: { type: Number },
    featured: { type: Boolean, default: false },
    price: { type: mongoose.Schema.Types.Mixed }, // Can be Number or String like 'Free'
    language: { type: String },
    location: { type: String },
    mode: { type: String },
    certificate: { type: Boolean, default: false },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
    outcomes: [{ type: String }],
    prerequisites: [{ type: String }],
    curriculum: [{ type: mongoose.Schema.Types.Mixed }], // Simple array of objects
    faqs: [{
        q: { type: String },
        a: { type: String }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

CourseSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
