import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['Article', 'Video', 'Audio', 'Book', 'Other'], required: true },
    category: { type: String },
    description: { type: String },
    content: { type: String },
    link: { type: String },
    author: { type: String },
    thumbnail: { type: String },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

ResourceSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
