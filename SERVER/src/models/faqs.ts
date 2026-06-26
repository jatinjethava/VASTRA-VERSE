import mongoose, { Document } from "mongoose";
import { FAQ_CATEGORY } from "../common";

export interface FaqDocument extends Document {
    question: String,
    answer: String,
    category: typeof FAQ_CATEGORY[keyof typeof FAQ_CATEGORY],
    isPublished: Boolean,
    isDeleted: Boolean,
    isActive: Boolean,
    createdAt: Date,
    updatedAt: Date,
}

const faqSchema = new mongoose.Schema<FaqDocument>({
    category: { type: String, enum: Object.values(FAQ_CATEGORY), required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});

export const FaqsModel = mongoose.model<FaqDocument>("Faq", faqSchema);