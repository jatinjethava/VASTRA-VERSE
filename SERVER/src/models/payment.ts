import mongoose, { Document, Schema, Types } from "mongoose";
import { PAYMENT_STATUS } from "../common";

export interface IPayment extends Document {
    userId: Types.ObjectId;
    orderId: Types.ObjectId;

    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;

    amount: number;
    currency: string;

    status: typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

    paidAt?: Date;
    failureReason?: string;

    refundId?: string;
    refundedAt?: Date;

    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, },
        orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },

        razorpayOrderId: { type: String, default: "", },
        razorpayPaymentId: { type: String, default: "", },
        razorpaySignature: { type: String, default: "", },

        amount: { type: Number, required: true, },
        currency: { type: String, default: "INR", },
        status: { type: String, enum: [PAYMENT_STATUS.UNPAID, PAYMENT_STATUS.PAID, PAYMENT_STATUS.FAILED, PAYMENT_STATUS.REFUNDED], default: PAYMENT_STATUS.UNPAID, },

        paidAt: { type: Date, },
        failureReason: { type: String, default: "", },
        refundId: { type: String, default: "", },
        refundedAt: { type: Date, },
        isDeleted: { type: Boolean, default: false, },
    },
    {
        timestamps: true,
    }
);

export const PaymentModel = mongoose.model<IPayment>(
    "Payment",
    paymentSchema
);