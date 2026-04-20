import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
    type: 'high' | 'medium' | 'low';
    message: string;
    details: any;
    timestamp: Date;
    ip?: string;
    resolved: boolean;
}

const AlertSchema: Schema = new Schema({
    type: { type: String, enum: ['high', 'medium', 'low'], required: true, index: true },
    message: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now, index: true },
    ip: { type: String },
    resolved: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema);
