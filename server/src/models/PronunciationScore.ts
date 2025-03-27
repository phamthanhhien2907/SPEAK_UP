import mongoose, { Document, Schema } from "mongoose";

export interface IPronunciationScore extends Document {
    userId: mongoose.Types.ObjectId;
    exerciseId: mongoose.Types.ObjectId;
    phonetic?: string
    userAudioUrl?: string;
    score: number;
}

const PronunciationScoreSchema = new Schema<IPronunciationScore>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    exerciseId: { type: Schema.Types.ObjectId, ref: "Exercise", required: true },
    phonetic: { type: String },
    userAudioUrl: { type: String },
    score: { type: Number, min: 0, max: 100, required: true },
}, {
    timestamps: true
});

export default mongoose.model<IPronunciationScore>("PronunciationScore", PronunciationScoreSchema);
