import mongoose from 'mongoose';

const BhajanSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    preview: { type: String },
    audioUrl: { type: String },
    lyrics: [{
        devanagari: [{ type: String }],
        roman: [{ type: String }],
        translation: [{ type: String }]
    }],
    isPublished: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

BhajanSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.models.Bhajan || mongoose.model('Bhajan', BhajanSchema);
