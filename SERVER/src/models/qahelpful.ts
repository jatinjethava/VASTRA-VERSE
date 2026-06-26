import mongoose, { Document, Schema } from "mongoose";

export interface QaHelpfulDocument extends Document {
    questionId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    isDeleted: boolean;
}

const QaHelpfulSchema = new Schema<QaHelpfulDocument>(
    {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "ProductQuestion", },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
        isDeleted: { type: Boolean, default: false },
    }
)

export const QaHelpfulModel = mongoose.model<QaHelpfulDocument>("QaHelpful", QaHelpfulSchema);