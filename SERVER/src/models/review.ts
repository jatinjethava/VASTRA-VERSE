import mongoose from "mongoose";

export interface IReview {
    userId: mongoose.ObjectId;
    productId: mongoose.ObjectId;
    rating: number;
    title: string;
    comment: string;

    images: string[];
    user: {
        name: string;
        email: string;
        phone: string;
    }

    recommended: boolean;
    isVerifiedPurchase: boolean;

    helpfulCount: number;
    likes: number;

    reported: boolean;
    adminReply: string;

    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}

const reviewSchema = new mongoose.Schema<IReview>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
    images: { type: [String], default: [] },
    user: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
    },
    recommended: { type: Boolean, default: false },
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    reported: { type: Boolean, default: false },
    adminReply: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const ReviewModel = mongoose.model<IReview>("Review", reviewSchema);