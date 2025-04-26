import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
    title: string;
    description?: string;
    level: "beginner" | "intermediate" | "advanced";
    thumbnail: string;
}

const CourseSchema = new Schema<ICourse>({
    title: { type: String, required: true },
    description: String,
    level: { type: String, required: true },
    thumbnail: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.model<ICourse>("Course", CourseSchema);
