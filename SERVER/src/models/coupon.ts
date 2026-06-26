import mongoose from "mongoose";
import { DISCOUNTTYPE } from "../common";

export interface i_coupon {
    code: string,
    description: string,
    discountType: keyof typeof DISCOUNTTYPE,
    discountValue: number,
    minimumOrderAmount: number,
    maximumDiscount: number,
    usageLimit: number,
    usedCount?: number,
    startDate: Date,
    expiryDate: Date,
    usedBy: [mongoose.Schema.Types.ObjectId],
    isActive: boolean
    isDeleted?: boolean
}

const couponSchema = new mongoose.Schema<i_coupon>({
    code: { type: String, required: true, uppercase: true, unique: true },
    description: String,
    discountType: { type: String, enum: [DISCOUNTTYPE.PERCENTAGE, DISCOUNTTYPE.FIXED], required: true },
    discountValue: { type: Number, required: true },
    minimumOrderAmount: { type: Number, default: 0 },
    maximumDiscount: { type: Number, default: 0 },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    startDate: Date,
    expiryDate: Date,
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export const couponModel = mongoose.model<i_coupon>("Coupon", couponSchema);