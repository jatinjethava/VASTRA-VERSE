import mongoose, { Document, Types } from "mongoose";
import { RETURN_STATUS } from "../common";

export interface ReturnOrderDocument extends Document {
    userId: Types.ObjectId,
    orderId: Types.ObjectId,
    orderItemId: Types.ObjectId[],
    orderNumber: string;
    reason: String,
    description: String,
    images: [String],

    status: typeof RETURN_STATUS[keyof typeof RETURN_STATUS],

    approvedAt: Date,
    rejectedAt: Date,

    isDeleted: boolean,

    createdAt: Date,
    updatedAt: Date,
}

const returnOrderSchema = new mongoose.Schema<ReturnOrderDocument>({
    userId: { type: Types.ObjectId, ref: "User" },
    orderId: { type: Types.ObjectId, ref: "Order" },
    orderItemId: { type: [Types.ObjectId], ref: "TShirt" },
    orderNumber: { type: String },
    reason: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    status: { type: String, enum: [RETURN_STATUS.PENDING, RETURN_STATUS.APPROVED, RETURN_STATUS.REJECTED], default: RETURN_STATUS.PENDING, trim: true },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

const returnOrderModel = mongoose.model<ReturnOrderDocument>("ReturnOrder", returnOrderSchema);
export { returnOrderModel as ReturnOrderModel };