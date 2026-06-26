import mongoose, { Document, Types } from "mongoose";

export interface QA_Document extends Document {
    productId: Types.ObjectId,
    userId: Types.ObjectId,
    user: {
        name: string;
        email: string;
    }
    question: String,
    answer: String,
    answeredBy: String,
    isAnswered: Boolean,
    helpfulCount: Number,
    isDeleted: Boolean,
}

const productQuestionSchema = new mongoose.Schema<QA_Document>(
    {
        productId: { type: Types.ObjectId, ref: "TShirt", required: true, },
        userId: { type: Types.ObjectId, ref: "User", required: true, },
        user: {
            name: { type: String, required: true },
            email: { type: String, required: true },
        },
        question: { type: String, required: true, trim: true, lowercase: true },
        answer: { type: String, default: "", },
        answeredBy: { type: String, default: "admin" },
        isAnswered: { type: Boolean, default: false, },
        helpfulCount: { type: Number, default: 0, },
        isDeleted: { type: Boolean, default: false, },
    },
    { timestamps: true }
);

export const ProductQuestionModel = mongoose.model<QA_Document>("ProductQuestion", productQuestionSchema);