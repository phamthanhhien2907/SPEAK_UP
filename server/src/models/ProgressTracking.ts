import mongoose, { Document, Schema } from "mongoose";

export interface IProgressTracking extends Document {
    userId: mongoose.Types.ObjectId;
    completedLessons: number;
    totalScore: number;
}

const ProgressTrackingSchema = new Schema<IProgressTracking>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    completedLessons: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
}, {
    timestamps: true
});

export default mongoose.model<IProgressTracking>("ProgressTracking", ProgressTrackingSchema);
