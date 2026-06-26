import mongoose from "mongoose";
import { AUTHOR_TYPE, BLOG_CATEGORY, BLOG_STATUS } from "../common";

export interface blogDocument extends mongoose.Document {
    userId?: mongoose.Schema.Types.ObjectId,
    author: keyof typeof AUTHOR_TYPE,
    title: string,
    description: string,
    subTitle: string,
    subDescription: string,
    content: string[],

    featuredImage: string;
    images: string[];

    category: keyof typeof BLOG_CATEGORY;

    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];

    status: keyof typeof BLOG_STATUS;

    views: number;
    isDeleted: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const blogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    author: { type: String, required: true, enum: [AUTHOR_TYPE.ADMIN, AUTHOR_TYPE.USER], default: AUTHOR_TYPE.ADMIN },
    title: { type: String, required: true },
    description: { type: String, required: true },
    subTitle: { type: String, required: true },
    subDescription: { type: String, required: true },
    content: { type: [String], required: true },

    featuredImage: { type: String, required: true },
    images: { type: [String], required: true },
    category: { type: String, enum: [BLOG_CATEGORY.FASHION_TRENDS, BLOG_CATEGORY.STYLING_GUIDES, BLOG_CATEGORY.BUYING_GUIDES, BLOG_CATEGORY.MEN_FASHION, BLOG_CATEGORY.WOMEN_FASHION, BLOG_CATEGORY.KIDS_FASHION, BLOG_CATEGORY.SEASONAL_COLLECTIONS, BLOG_CATEGORY.STREETWEAR, BLOG_CATEGORY.FABRIC_GUIDES, BLOG_CATEGORY.CLOTHING_CARE, BLOG_CATEGORY.NEW_ARRIVALS, BLOG_CATEGORY.BRAND_STORIES], required: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: [String] },
    status: { type: String, enum: [BLOG_STATUS.DRAFT, BLOG_STATUS.PUBLISHED, BLOG_STATUS.REJECTED], default: BLOG_STATUS.DRAFT },
    views: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

export const blogModel = mongoose.model<blogDocument>("blog", blogSchema);