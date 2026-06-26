import mongoose, { Document, Types } from "mongoose";

export interface IChatRoom extends Document {
    customer: Types.ObjectId;
    status: "open" | "closed";
    lastMessage: string;
    createdAt: Date;
    updatedAt: Date;
}

const chatRoomSchema = new mongoose.Schema<IChatRoom>(
    {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
        status: { type: String, enum: ["open", "closed"], default: "open", },
        lastMessage: String,
    },
    { timestamps: true, }
);

export interface IChatMessage extends Document {
    roomId: Types.ObjectId;
    sender?: Types.ObjectId;
    senderType: "customer" | "admin";
    message: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new mongoose.Schema<IChatMessage>(
    {
        roomId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom", required: true, },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: function (this: any) { return this.senderType === "customer"; } },
        senderType: { type: String, enum: ["customer", "admin"], required: true, },
        message: { type: String, required: true, },
        isRead: { type: Boolean, default: false, },
    },
    { timestamps: true, }
);

export const ChatRoomModel = mongoose.model<IChatRoom>("ChatRoom", chatRoomSchema);
export const ChatMessageModel = mongoose.model<IChatMessage>("ChatMessage", messageSchema);
