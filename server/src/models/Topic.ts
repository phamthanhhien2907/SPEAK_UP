import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["speaking", "pronunciation", "vocabulary", "listening"], required: true },
    section: { type: String, enum: ["lesson", "topic", "ai-conversation"], required: true },
    level: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    totalLessons: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});

const Topic = mongoose.model("Topic", TopicSchema);
export default Topic;