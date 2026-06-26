import mongoose from "mongoose";

export interface ProductView {
    productId: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    viewedAt: Date;
    isDeleted?: boolean;
}

const productViewSchema = new mongoose.Schema<ProductView>({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    viewedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false }
});

export const productViewModel = mongoose.model<ProductView>("ProductView", productViewSchema);
