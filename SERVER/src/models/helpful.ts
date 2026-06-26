import mongoose, { Document } from "mongoose";

export interface IHelpful extends Document {
    userId: mongoose.Types.ObjectId;
    reviewId: mongoose.Types.ObjectId;
    isDeleted: boolean;
}

const helpfulSchema = new mongoose.Schema<IHelpful>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
        reviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Review", required: true, },
        isDeleted: { type: Boolean, default: false, }
    },
    { timestamps: true }
)

export const HelpfulModel = mongoose.model<IHelpful>("Helpful", helpfulSchema);