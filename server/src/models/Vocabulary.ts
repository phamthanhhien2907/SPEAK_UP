import mongoose, { Document, Schema } from "mongoose";

export interface IVocabulary extends Document {
    word: string;
    phonetic?: string;
    meaning: string;
    exampleSentence?: string;
    audioUrl?: string;
}

const VocabularySchema = new Schema<IVocabulary>({
    word: { type: String, required: true, unique: true },
    phonetic: { type: String },
    meaning: { type: String, required: true },
    exampleSentence: { type: String },
    audioUrl: { type: String },
},
    {
        timestamps: true
    });

export default mongoose.model<IVocabulary>("Vocabulary", VocabularySchema);
