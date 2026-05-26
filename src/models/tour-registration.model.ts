import mongoose, { Schema, Document } from 'mongoose';

export interface ITourRegistration extends Document {
    tourId: string;
    tourName: string;
    name: string;
    email: string;
    phone: string;
    seats: number;
    date: string;
    notes?: string;
    status: 'pending' | 'approved' | 'cancelled';
    totalCost: number;
    createdAt: Date;
    updatedAt: Date;
}

const TourRegistrationSchema: Schema = new Schema({
    tourId: { type: String, required: true },
    tourName: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    seats: { type: Number, required: true },
    date: { type: String, required: true },
    notes: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'cancelled'], default: 'pending' },
    totalCost: { type: Number, required: true }
}, {
    timestamps: true
});

export default mongoose.models.TourRegistration || mongoose.model<ITourRegistration>('TourRegistration', TourRegistrationSchema);
