import { Schema, model, Types, Document } from "mongoose";
import { ITShirt } from "./product";
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from "../common";

export interface IShippingAddress {
    fullName: string;
    email: string;
    phone: number;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    pincode: number;
}

export interface Items {
    productId: Types.ObjectId;
    title: String;
    size: String;
    color: String;
    quantity: Number;
    basePrice: Number;
    costPrice: Number;
    discountPrice: Number;
    total: Number;
}

export interface IOrder extends Document {
    userId: Types.ObjectId;
    orderNumber: string;
    items: Items[];
    shippingAddress: IShippingAddress;
    paymentMethod: "cod" | "razorpay";
    paymentStatus: "unpaid" | "paid" | "failed" | "refunded";
    orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    subtotal: number;
    shippingFee: number;
    discount: number;
    totalAmount: number;
    totalItems: number;
    gst: number;
    gstAmount: number;

    reason: String,

    orderedAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    expectedDeliveryDate: Date,

    returnRequest: boolean,

    isAgree: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICounter extends Document {
    name: string;
    sequence: number;
}

const shippingAddressSchema = new Schema<IShippingAddress>(
    {
        fullName: { type: String, required: true },
        phone: { type: Number, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, default: "India", },
        pincode: { type: Number, required: true, },
    },
    { _id: false }
);

const counterSchema = new Schema<ICounter>(
    { name: { type: String, required: true, unique: true }, sequence: { type: Number, default: 100000 }, },
    { timestamps: true }
);


const orderSchema = new Schema<IOrder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true, },

        orderNumber: { type: String, required: true, unique: true, },

        items: { type: [Object], required: true, },

        shippingAddress: { type: shippingAddressSchema, required: true, },

        paymentMethod: { type: String, enum: [PAYMENT_METHOD.COD, PAYMENT_METHOD.RAZORPAY], required: true, },

        paymentStatus: { type: String, enum: [PAYMENT_STATUS.UNPAID, PAYMENT_STATUS.PAID, PAYMENT_STATUS.FAILED, PAYMENT_STATUS.REFUNDED], default: PAYMENT_STATUS.UNPAID, },

        orderStatus: { type: String, enum: [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.PROCESSING, ORDER_STATUS.SHIPPED, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED], default: ORDER_STATUS.PENDING, },

        subtotal: { type: Number, required: true, },

        shippingFee: { type: Number, default: 0, },

        discount: { type: Number, default: 0, },

        totalAmount: { type: Number, required: true, },

        totalItems: { type: Number, required: true, },

        gst: { type: Number, required: true, },
        gstAmount: { type: Number, required: true, },

        reason: { type: String, },

        orderedAt: { type: Date, default: Date.now, },
        shippedAt: { type: Date, },
        deliveredAt: { type: Date, },
        expectedDeliveryDate: { type: Date, },

        returnRequest: { type: Boolean, default: false, },

        isAgree: { type: Boolean, default: false, },
        isDeleted: { type: Boolean, default: false, },
    },
    {
        timestamps: true,
    }
);

export const orderModel = model<IOrder>("Order", orderSchema);
export const Counter = model<ICounter>("Counter", counterSchema);