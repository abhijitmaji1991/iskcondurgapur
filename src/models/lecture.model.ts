import mongoose, { Schema, Document } from 'mongoose';

export interface ILecture extends Document {
    code: string;
    title: string;
    date: string;
    location: string;
    year: string;
    type: 'Lecture' | 'Conversation' | 'Morning Walk' | 'Bhajan';
    scripture?: string;
    verses?: string;
    sanskrit?: string;
    translation?: string;
    duration: string;
    audioUrl: string;
    summary: string;
    transcript: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const LectureSchema: Schema = new Schema({
    code: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    year: { type: String, required: true },
    type: { type: String, enum: ['Lecture', 'Conversation', 'Morning Walk', 'Bhajan'], required: true },
    scripture: { type: String },
    verses: { type: String },
    sanskrit: { type: String },
    translation: { type: String },
    duration: { type: String, required: true },
    audioUrl: { type: String, required: true },
    summary: { type: String, required: true },
    transcript: { type: String, required: true },
    isPublished: { type: Boolean, default: true }
}, {
    timestamps: true
});

// Avoid re-compiling the model in development (Next.js HMR)
export default mongoose.models.Lecture || mongoose.model<ILecture>('Lecture', LectureSchema);
