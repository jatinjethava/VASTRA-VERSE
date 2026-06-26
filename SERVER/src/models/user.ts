import mongoose, { Document, Types } from "mongoose";
import { USER_ROLE } from "../common";
import { subscribe } from "diagnostics_channel";

export interface UserDocument extends Document {
    name: String,
    email: String,
    mobileNumber: number;
    password: String,
    role: "user" | "admin",
    otp: Number,
    otpExpireTime: Date,
    isEmailVerified: Boolean,
    profileImage: String,
    recentlyViewed: [Types.ObjectId],
    walletBalance: Number,
    isBlocked: Boolean,
    isDeleted: Boolean,
}

export interface walletRechargeDocument extends Document {
    userId: Types.ObjectId,
    amount: Number,
    currency: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: "success" | "failed" | "pending",
    isDeleted: Boolean,
}

export interface walletTransactionDocument extends Document {
    user: Types.ObjectId,
    type: "credit" | "debit",
    amount: Number,
    reason: String,
    order: Types.ObjectId,
    balanceAfter: Number,
    isDeleted: Boolean,
}

export interface subscribeDocument extends Document {
    email: String,
    isDeleted: Boolean,
}

const userSchema = new mongoose.Schema<UserDocument>({
    name: { type: String, required: true, minLength: 3, maxLength: 30 },
    email: { type: String, required: true, trim: true },
    mobileNumber: { type: Number, required: true, trim: true },
    password: { type: String, required: true, trim: true, minLength: 6, },
    role: { type: String, enum: USER_ROLE, default: USER_ROLE.USER },
    otp: { type: Number, trim: true, default: null },
    otpExpireTime: { type: Date, trim: true, default: null },
    isEmailVerified: { type: Boolean, default: false, trim: true, },
    profileImage: { type: String },
    recentlyViewed: { type: [{ type: Types.ObjectId, ref: "TShirt" }], default: [] },
    walletBalance: { type: Number, trim: true, default: null },
    isBlocked: { type: Boolean, default: false, trim: true, },
    isDeleted: { type: Boolean, default: false, trim: true, },
}, { timestamps: true });

const walletRechargeSchema = new mongoose.Schema<walletRechargeDocument>({
    userId: { type: Types.ObjectId, ref: "User" },
    amount: { type: Number, trim: true, default: 0 },
    currency: { type: String, trim: true, default: "INR" },
    razorpayOrderId: { type: String, trim: true, default: null },
    razorpayPaymentId: { type: String, trim: true, default: null },
    razorpaySignature: { type: String, trim: true, default: null },
    status: { type: String, enum: ["success", "failed", "pending"], default: "pending" },
    isDeleted: { type: Boolean, default: false, trim: true, },
}, { timestamps: true });

const walletTransactionSchema = new mongoose.Schema<walletTransactionDocument>({
    user: { type: Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["credit", "debit"] },
    amount: { type: Number, trim: true, default: 0 },
    reason: { type: String },
    order: { type: Types.ObjectId, ref: "Order" },
    balanceAfter: { type: Number },
    isDeleted: { type: Boolean, default: false, trim: true, },
}, { timestamps: true });

const subscribeSchema = new mongoose.Schema<subscribeDocument>({
    email: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false, trim: true, },
}, { timestamps: true });

export const userModel = mongoose.model<UserDocument>("User", userSchema);
export const subscribeModel = mongoose.model<subscribeDocument>("Subscribe", subscribeSchema);
export const walletRechargeModel = mongoose.model<walletRechargeDocument>("WalletRecharge", walletRechargeSchema);
export const walletTransactionModel = mongoose.model<walletTransactionDocument>("WalletTransaction", walletTransactionSchema);

