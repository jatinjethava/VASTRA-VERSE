import Joi from "joi";
import { isValidObjectId, ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from "../common";

export const createOrderSchema = Joi.object({
    items: Joi.array()
        .min(1)
        .items(
            Joi.object({
                productId: Joi.string().required(),
                title: Joi.string().required(),
                color: Joi.string().required(),
                size: Joi.string().required(),
                quantity: Joi.number().min(1).required(),
                discountPrice: Joi.number().required(),
            })
        )
        .required(),

    shippingAddress: Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().email().required().regex(/[a-z0-9]+@[a-z]+\.[a-z]{2,5}$/i),
        phone: Joi.number()
            .integer()
            .positive()
            .message('"phone" must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9')
            .required(),
        addressLine1: Joi.string().required(),
        addressLine2: Joi.string().optional(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
        pincode: Joi.number()
            .integer()
            .positive()
            .message('"pincode" must be a valid 6-digit number')
            .required(),
    }).required(),

    paymentMethod: Joi.string().valid(PAYMENT_METHOD.COD, PAYMENT_METHOD.RAZORPAY).required(),
    subtotal: Joi.number().required(),
    shippingFee: Joi.number().required(),
    totalAmount: Joi.number().required(),
    totalItems: Joi.number().required(),
    discount: Joi.number().default(0).optional(),
    gst: Joi.number().default(0).optional(),
    gstAmount: Joi.number().default(0).optional(),
    isAgree: Joi.boolean().default(false).optional(),
});

export const updateOrderSchema = Joi.object({
    orderId: Joi.string().custom(isValidObjectId).required(),
    orderStatus: Joi.string().valid(ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.PROCESSING, ORDER_STATUS.SHIPPED, ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED).required(),
});

export const updatePaymentStatusSchema = Joi.object({
    orderId: Joi.string().custom(isValidObjectId).required(),
    paymentStatus: Joi.string().valid(PAYMENT_STATUS.PAID, PAYMENT_STATUS.FAILED, PAYMENT_STATUS.REFUNDED).required(),
});

export const cancelOrderSchema = Joi.object({
    orderId: Joi.string().custom(isValidObjectId).required(),
    reason: Joi.string().optional(),
});

export const updateExpectedDeliveryDateSchema = Joi.object({
    orderId: Joi.string().custom(isValidObjectId).required(),
    expectedDeliveryDate: Joi.date().required(),
});