import mongoose, { Document, Schema } from "mongoose";

export interface IExerciseVocabulary extends Document {
    exerciseId: mongoose.Types.ObjectId;
    vocabularyId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ExerciseVocabularySchema = new Schema<IExerciseVocabulary>({
    exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    vocabularyId: { type: Schema.Types.ObjectId, ref: 'Vocabulary', required: true },
}, {
    timestamps: true
});

export default mongoose.model<IExerciseVocabulary>("ExerciseVocabulary", ExerciseVocabularySchema);
