import mongoose, { Document, Schema } from "mongoose";

export interface IExercise extends Document {
    lessonId: mongoose.Types.ObjectId;
    type: "repeat_sentence" | "fill_in_blank" | "pronunciation" | "listening"
    prompt: string;
    correctPronunciation: string;
    difficultyLevel: string
    createdAt: Date;
    updatedAt: Date;
}
const ExerciseSchema = new Schema<IExercise>({
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
    type: { type: String, enum: ["repeat_sentence", "fill_in_blank", "pronunciation", "listening"], required: true },
    prompt: { type: String, required: true },
    correctPronunciation: { type: String },
    difficultyLevel: { type: String, enum: ["easy", "medium", "hard"], required: true }
}, {
    timestamps: true
});

export default mongoose.model<IExercise>("Exercise", ExerciseSchema);
