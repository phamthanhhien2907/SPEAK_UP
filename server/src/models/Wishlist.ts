import mongoose, { Document, Schema } from "mongoose";

export interface IWishlist extends Document {
    userId: mongoose.Types.ObjectId;
    lessonId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IWishlist>("Wishlist", WishlistSchema);