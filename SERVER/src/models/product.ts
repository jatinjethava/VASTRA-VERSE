import mongoose, { Schema, Document, Types } from "mongoose";
import { PRODUCT_SIZE, PRODUCT_FIT, PRODUCT_GENDER } from "../common/enum";

export interface IVariant {
    size: string;
    color: string;
    stock: number;
    sku: string;
    price: number;
    discountPrice?: number;
}

export interface ITShirt extends Document {
    title: string;
    slug: string;
    description: string;

    brand?: string;
    category: Types.ObjectId;

    basePrice: number;
    costPrice: number;
    discountPrice?: number;
    discountPercentage?: number;

    gender: "men" | "women" | "unisex" | "kids";

    fit: "regular" | "oversized" | "slim";

    material: string;

    images: string[];

    variants: IVariant[];

    tags: string[];

    isFeatured: boolean;
    isPublished: boolean;
    isBestSeller: boolean;
    isNewArrival: boolean;
    limitedEdition: boolean;

    ratingsAverage: number;
    ratingsQuantity: number;

    soldCount: number;

    seoTitle?: string;
    seoDescription?: string;
    isDeleted: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const variantSchema = new Schema<IVariant>(
    {
        size: { type: String, required: true, enum: [PRODUCT_SIZE.XS, PRODUCT_SIZE.S, PRODUCT_SIZE.M, PRODUCT_SIZE.L, PRODUCT_SIZE.XL, PRODUCT_SIZE.XXL] },
        color: { type: String, required: true, trim: true },
        stock: { type: Number, required: true, min: 0, default: 0 },
        sku: { type: String, required: true, unique: true, index: true, uppercase: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        discountPrice: { type: Number, min: 0 },
    },
    { _id: false }
);

const tshirtSchema = new Schema<ITShirt>(
    {
        title: { type: String, required: true, trim: true, maxlength: 150, },
        slug: { type: String, required: true, lowercase: true, trim: true, },
        description: { type: String, required: true, },
        brand: { type: String, trim: true, },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true, },
        basePrice: { type: Number, required: true, min: 0, },
        costPrice: { type: Number, default: 0, min: 0, },
        discountPrice: { type: Number, min: 0, },
        discountPercentage: { type: Number, default: 0, min: 0, },
        gender: { type: String, enum: [PRODUCT_GENDER.MEN, PRODUCT_GENDER.WOMEN, PRODUCT_GENDER.UNISEX, PRODUCT_GENDER.KIDS], default: PRODUCT_GENDER.UNISEX, },
        fit: { type: String, enum: [PRODUCT_FIT.REGULAR, PRODUCT_FIT.OVERSIZED, PRODUCT_FIT.SLIM], default: PRODUCT_FIT.REGULAR, },
        material: { type: String, default: "Cotton", },
        images: [
            {
                type: String,
                required: true,
            },
        ],
        variants: {
            type: [variantSchema],
            validate: {
                validator: function (value: IVariant[]) {
                    return value.length > 0;
                },
                message: "At least one variant is required",
            },
        },
        tags: [String],
        isFeatured: { type: Boolean, default: false, },
        isPublished: { type: Boolean, default: true, },
        isBestSeller: { type: Boolean, default: false, },
        isNewArrival: { type: Boolean, default: false, },
        limitedEdition: { type: Boolean, default: false, },
        ratingsAverage: { type: Number, default: 0, min: 0, max: 5, },
        ratingsQuantity: { type: Number, default: 0, },
        soldCount: { type: Number, default: 0, },
        seoTitle: String,
        seoDescription: String,
        isDeleted: { type: Boolean, default: false, },
    },
    {
        timestamps: true,
    }
);

tshirtSchema.index({ title: "text", description: "text" });

tshirtSchema.index({ category: 1 });

tshirtSchema.index({ brand: 1 });

tshirtSchema.index({ gender: 1 });

tshirtSchema.index({ isFeatured: 1 });

tshirtSchema.index({ createdAt: -1 });

export const TShirtModel = mongoose.models.TShirt || mongoose.model<ITShirt>("TShirt", tshirtSchema);
