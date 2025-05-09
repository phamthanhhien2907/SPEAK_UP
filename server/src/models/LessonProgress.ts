import mongoose, { Document, Schema } from "mongoose";

export interface ILessonProgress extends Document {
    lessonId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    score: number;
    isCompleted: boolean;
}

const LessonProgressSchema = new Schema<ILessonProgress>({
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, default: 0.0 },
    isCompleted: { type: Boolean, default: false },
}, {
    timestamps: true
});

export default mongoose.model<ILessonProgress>("LessonProgress", LessonProgressSchema);
