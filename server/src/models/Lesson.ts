import mongoose, { Document, Schema } from "mongoose";

export interface ILesson extends Document {
    courseId: mongoose.Schema.Types.ObjectId;
    title: string;
    content?: string;
    type: "listening" | "speaking" | "vocabulary" | "pronunciation";
    parentLessonId?: mongoose.Schema.Types.ObjectId;
    thumbnail?: string;
    level?: number;
}

const LessonSchema = new Schema<ILesson>({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    type: { type: String, enum: ["listening", "speaking", "vocabulary", "pronunciation"], required: true },
    parentLessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: false },
    thumbnail: { type: String, default: "" },
    level: { type: Number, default: 1 },
}, {
    timestamps: true
});

export default mongoose.model<ILesson>("Lesson", LessonSchema);
