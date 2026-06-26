import mongoose from "mongoose";

export interface ISession extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId;
    token: string;
    device: string;
    browser: string;
    os: string;
    ipAddress: string;
    lastActive: Date;
    isActive: boolean;
}

const sessionSchema = new mongoose.Schema<ISession>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },

    device: { type: String, },
    browser: { type: String, },
    os: { type: String, },
    ipAddress: { type: String, },

    lastActive: { type: Date, default: Date.now },

    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});

export const sessionModel = mongoose.model<ISession>("Session", sessionSchema);