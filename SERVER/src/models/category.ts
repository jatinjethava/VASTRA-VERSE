import { NextFunction } from "express";
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    banner?: string;

    parentCategory?: Types.ObjectId;
    level: number;

    path: string[];

    seoTitle?: string;
    seoDescription?: string;

    sortOrder: number;
    isDeleted: boolean;

    createdAt: Date;
    updatedAt: Date;
}

interface CategoryModel extends Model<ICategory> { }

const categorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80, },
        slug: { type: String, required: true, trim: true, lowercase: true, },
        description: { type: String, trim: true, maxlength: 500, },
        banner: { type: String, default: "", },

        parentCategory: { type: Schema.Types.ObjectId, ref: "Category", default: null, },
        level: { type: Number, min: 0, default: 0, },
        path: [{ type: String, trim: true, lowercase: true, }],
        seoTitle: { type: String, trim: true, maxlength: 80, },
        seoDescription: { type: String, trim: true, maxlength: 160, },
        sortOrder: { type: Number, default: 0, },
        isDeleted: { type: Boolean, default: false, },
    },
    {
        timestamps: true,
    }
);

categorySchema.index({ slug: 1 });

categorySchema.index({ parentCategory: 1 });

categorySchema.index({ name: "text", description: "text" });

categorySchema.pre("save", async function () {
    if (!this.parentCategory) {
        this.level = 0;
        this.path = [this.slug];
        return;
    }
    const parent = await mongoose
        .model<ICategory>("Category")
        .findById(this.parentCategory);

    if (!parent) {
        throw new Error("Parent category not found");
    }
    this.level = parent.level + 1;
    this.path = [...parent.path, this.slug];
});


export const CategoryModel = mongoose.models.Category || mongoose.model<ICategory, CategoryModel>("Category", categorySchema);
