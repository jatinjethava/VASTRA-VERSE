import mongoose, { Schema } from "mongoose";

export interface Iwishlist {
    userId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId,
    isDeleted: boolean
}

const WishlistSchema = new Schema<Iwishlist>({
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "product", required: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

WishlistSchema.index({ userId: 1, isDeleted: 1, productId: 1 });
WishlistSchema.index({ userId: 1, productId: 1 });

export const WishlistModel = mongoose.model<Iwishlist>("wishlist", WishlistSchema);