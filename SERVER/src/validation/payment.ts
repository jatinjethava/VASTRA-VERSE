import Joi from "joi";

export const createPaymentOrderSchema = Joi.object({
    orderId: Joi.string().length(24).hex().required(),
    amount: Joi.number().required(),
    currency: Joi.string().optional().default("INR"),
});

export const verifyPaymentSchema = Joi.object({
    orderId: Joi.string().length(24).hex().required(),
    razorpayOrderId: Joi.string().required(),
    razorpayPaymentId: Joi.string().required(),
    razorpaySignature: Joi.string().required(),
});

export const createRefundSchema = Joi.object({
    orderId: Joi.string().length(24).hex().required(),
    failureReason: Joi.string().optional(),
});

export const getPaymentByIdSchema = Joi.object({
    paymentId: Joi.string().length(24).hex().required(),
});

export const failPaymentSchema = Joi.object({
    failureReason: Joi.string().required(),
});