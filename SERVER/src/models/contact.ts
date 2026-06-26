import mongoose, { Document } from "mongoose";

export interface ContactDocument extends Document {
    name: String,
    email: String,
    message: String,
    isRead: Boolean,
    isDeleted: Boolean,
    createdAt: Date,
    updatedAt: Date
}

const contactSchema = new mongoose.Schema<ContactDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
});

export const ContactModel = mongoose.model<ContactDocument>("Contact", contactSchema);