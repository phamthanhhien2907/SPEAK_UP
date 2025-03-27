import mongoose, { Document, Schema } from "mongoose";

export interface IExerciseVocabulary extends Document {
    exerciseId: mongoose.Schema.Types.ObjectId;
    vocabularyId: mongoose.Schema.Types.ObjectId;
}

const ExerciseVocabularySchema = new Schema<IExerciseVocabulary>({
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    vocabularyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vocabulary', required: true },
}, {
    timestamps: true
});

export default mongoose.model<IExerciseVocabulary>("ExerciseVocabulary", ExerciseVocabularySchema);
