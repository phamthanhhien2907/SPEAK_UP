import mongoose, { Document, Schema } from "mongoose";

export interface ILesson extends Document {
    courseId: mongoose.Types.ObjectId;
    title: string;
    content?: string;
    type: "listening" | "speaking" | "vocabulary" | "pronunciation";
    parentLessonId?: mongoose.Types.ObjectId;
    thumbnail?: string;
    aiImg?: string;
    name?: string;
    category: "basics" | "intermediate" | "professional"
    level?: number;
    createdAt: Date;
    updatedAt: Date;
}

// Interface mới cho dữ liệu đầu vào (plain object)
export interface ILessonInput {
    courseId: mongoose.Types.ObjectId;
    parentLessonId?: mongoose.Types.ObjectId;
    title: string;
    content?: string;
    type: "listening" | "speaking" | "vocabulary" | "pronunciation";
    thumbnail?: string;
    aiImg?: string;
    name?: string;
    category?: "Basics" | "Intermediate" | "Professional";
    level?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const LessonSchema = new Schema<ILesson>({
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    type: { type: String, enum: ["listening", "speaking", "vocabulary", "pronunciation"], required: true },
    parentLessonId: { type: Schema.Types.ObjectId, ref: "Lesson", default: null },
    thumbnail: { type: String, default: "" },
    aiImg: { type: String, default: "" },
    name: { type: String, default: "" },
    category: { type: String, enum: ["Basics", "Intermediate", "Professional"], required: true },
    level: { type: Number, default: 1 },
}, {
    timestamps: true
});

export default mongoose.model<ILesson>("Lesson", LessonSchema);