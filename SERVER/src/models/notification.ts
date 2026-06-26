import mongoose, { Document, Types } from "mongoose";
import { FOR, NOTIFICATION_TYPE } from "../common";

export interface notificationDocument extends Document {
    userId?: Types.ObjectId;
    title: string;
    message: string;
    type: keyof typeof NOTIFICATION_TYPE;
    isRead: boolean;
    actionUrl?: string;
    for: keyof typeof FOR;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new mongoose.Schema<notificationDocument>(
    {
        userId: { type: Types.ObjectId, ref: "user" },
        title: { type: String, required: true },
        message: { type: String, required: true },
        type: { type: String, enum: Object.values(NOTIFICATION_TYPE), required: true },
        isRead: { type: Boolean, default: false },
        actionUrl: { type: String },
        for: { type: String, enum: Object.values(FOR), required: true },
    },
    { timestamps: true }
)

export const notificationModel = mongoose.model<notificationDocument>("notification", notificationSchema);