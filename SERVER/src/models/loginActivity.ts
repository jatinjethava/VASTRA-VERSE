import mongoose, { Document, Types } from "mongoose";

export interface ILoginActivity extends Document {
    userId: Types.ObjectId;
    device: String,
    browser: String,
    os: String,
    ipAddress: String,
    loginAt: Date,
}

const loginActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    device: { type: String, },
    browser: { type: String, },
    os: { type: String, },
    ipAddress: { type: String, },
    loginAt: { type: Date, default: Date.now }
});

export const loginActivityModel = mongoose.model<ILoginActivity>("LoginActivity", loginActivitySchema);