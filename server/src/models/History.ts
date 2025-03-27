import mongoose, { Document, Schema } from "mongoose";

export interface IHistory extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    lessonId: mongoose.Schema.Types.ObjectId;
    exerciseId: mongoose.Schema.Types.ObjectId;
    attempts: number;
    lastAttemptAt: Date;
}

const HistorySchema = new Schema<IHistory>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    attempts: { type: Number, default: 1 },
    lastAttemptAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export default mongoose.model<IHistory>("History", HistorySchema);
