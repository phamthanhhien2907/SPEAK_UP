import mongoose, { Document, Schema } from "mongoose";

export interface IEnrollment extends Document {
    courseId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    progress: number;
    status: "in_progress" | "completed" | "dropped";
}

const EnrollmentSchema = new Schema<IEnrollment>({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    progress: { type: Number, default: 0.0 },
    status: { type: String, enum: ['in_progress', 'completed', 'dropped'], default: 'in_progress' },
}, {
    timestamps: true
});

export default mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);
