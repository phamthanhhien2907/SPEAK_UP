import mongoose, { Document, Schema } from "mongoose";

export interface IFeedback extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    lessonId: mongoose.Schema.Types.ObjectId;
    comment: string;
    rating: number;
}
const FeedbackSchema = new Schema<IFeedback>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
}, {
    timestamps: true
});

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema);
