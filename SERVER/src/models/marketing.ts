import mongoose, { Schema, model, Document, Types } from "mongoose";
import { DISCOUNTTYPE } from "../common";

export const TARGETTYPE = {
    ALL: "all",
    CATEGORY: "category",
    PRODUCT: "product"
}

export interface ICampaign extends Document {
    name: string;
    image: string;
    description: string;
    discountType: typeof DISCOUNTTYPE[keyof typeof DISCOUNTTYPE];
    discountValue: number;
    target: typeof TARGETTYPE[keyof typeof TARGETTYPE];
    targetIds: Types.ObjectId[];
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    isDeleted: boolean;
}

export interface FlashSales extends Document {
    name: string;
    image: string;
    description: string;
    discountType: typeof DISCOUNTTYPE[keyof typeof DISCOUNTTYPE];
    discountValue: number;
    target: typeof TARGETTYPE[keyof typeof TARGETTYPE];
    targetIds: Types.ObjectId[];
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    isDeleted: boolean;
}

export interface Banner extends Document {
    title: string;
    description: string;
    bgImage: string;
    isDeleted: boolean;
}

const campaignSchema = new Schema({
    name: String,
    image: String,
    description: String,
    discountType: { type: String, enum: DISCOUNTTYPE },
    discountValue: Number,
    target: { type: String, enum: TARGETTYPE },
    targetIds: [Types.ObjectId],
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

const flashSalesSchema = new Schema({
    name: String,
    image: String,
    description: String,
    discountType: { type: String, enum: DISCOUNTTYPE },
    discountValue: Number,
    target: { type: String, enum: TARGETTYPE },
    targetIds: [Types.ObjectId],
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

const bannerSchema = new Schema({
    title: String,
    description: String,
    bgImage: String,
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export const CampaignModel = model<ICampaign>("Campaign", campaignSchema);
export const FlashSalesModel = model<FlashSales>("FlashSales", flashSalesSchema);
export const BannerModel = model<Banner>("Banner", bannerSchema);