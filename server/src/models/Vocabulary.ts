import mongoose, { Document, Schema } from "mongoose";

export interface IVocabulary extends Document {
    lessonId: mongoose.Types.ObjectId;
    word: string;
    phonetic?: string;
    meaning: string;
    exampleSentence?: string;
    audioUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const VocabularySchema = new Schema<IVocabulary>({
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    // word: { type: String, required: true, unique: true },
    word: { type: String, required: true },
    phonetic: { type: String },
    meaning: { type: String, required: true },
    exampleSentence: { type: String },
    audioUrl: { type: String },
},
    {
        timestamps: true
    });

export default mongoose.model<IVocabulary>("Vocabulary", VocabularySchema);
