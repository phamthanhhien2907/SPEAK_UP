import mongoose, { Document, Schema } from "mongoose";

export interface ILesson extends Document {
    courseId: mongoose.Schema.Types.ObjectId;
    title: string;
    content?: string;
    type: "listening" | "speaking" | "vocabulary";
}

const LessonSchema = new Schema<ILesson>({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    content: String,
    type: { type: String, enum: ['listening', 'speaking', 'vocabulary'], required: true },
}, {
    timestamps: true
});

export default mongoose.model<ILesson>("Lesson", LessonSchema);
