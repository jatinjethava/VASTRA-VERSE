import mongoose, { Schema } from "mongoose";
import { SAVE_FOR } from "../common";

export interface Icart {
    userId: Schema.Types.ObjectId;
    productId: Schema.Types.ObjectId;
    items: {
        name: string;
        basePrice: number;
        discountPrice: number;
        stock: number;
        images: string[];
    }[];
    quantity: number;
    size: string;
    color: string;
    code?: string;
    discountAmount?: number;
    status: typeof SAVE_FOR[keyof typeof SAVE_FOR];
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const cartSchema = new Schema<Icart>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    items: [{
        name: { type: String, required: true },
        basePrice: { type: Number, required: true },
        discountPrice: { type: Number, default: null },
        stock: { type: Number, required: true },
        images: { type: [String], default: [] },
    }],
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    code: { type: String, default: null },
    discountAmount: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(SAVE_FOR), default: SAVE_FOR.CART },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

export const CartModel = mongoose.model<Icart>("Cart", cartSchema);