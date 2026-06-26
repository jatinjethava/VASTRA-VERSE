import mongoose, { Document } from "mongoose";

export interface ILike extends Document {
    userId: mongoose.Types.ObjectId;
    reviewId: mongoose.Types.ObjectId;
    isDeleted: boolean;
}

const likeSchema = new mongoose.Schema<ILike>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
        reviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Review", required: true, },
        isDeleted: { type: Boolean, default: false, }
    },
    { timestamps: true }
)

export const LikeModel = mongoose.model<ILike>("Like", likeSchema);