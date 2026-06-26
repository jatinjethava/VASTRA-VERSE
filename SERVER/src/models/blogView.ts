import mongoose, { Document } from "mongoose";

export interface BlogViewDocument extends Document {
    blogId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    viewedAt: Date;
}

const blogViewSchema = new mongoose.Schema<BlogViewDocument>({
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const blogViewModel = mongoose.model<BlogViewDocument>("BlogView", blogViewSchema);