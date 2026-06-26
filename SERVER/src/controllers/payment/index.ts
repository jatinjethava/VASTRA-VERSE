import { notificationModel, orderModel, PaymentModel, userModel } from "../../models";
import { Request, Response } from "express";
import { createPaymentOrderSchema, verifyPaymentSchema, createRefundSchema, getPaymentByIdSchema, failPaymentSchema } from "../../validation";
import { apiResponse, HTTP_STATUS, PAYMENT_STATUS, responseMessage, isValidObjectId, ORDER_STATUS, FOR, NOTIFICATION_TYPE, debitWallet, creditWallet } from "../../common";
import { env } from "../../config";
import { createOne, getFirstMatch, updateData } from "../../helpers";
import crypto from "crypto";
import razorpay from "razorpay";

const getRazorpayInstance = () => {
    if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay credentials are not configured properly.");
    }
    return new razorpay({
        key_id: env.RAZORPAY_KEY_ID,
        key_secret: env.RAZORPAY_KEY_SECRET,
    });
};

export const createPaymentOrder = async (req: Request, res: Response) => {
    try {
        const { error, value } = createPaymentOrderSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { orderId, amount, currency } = value;
        const userId = (req as any).user?._id;

        const findUser = await getFirstMatch(userModel, { _id: userId, isDeleted: false, isBlocked: false, isEmailVerified: true });
        if (!findUser) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, "User not found", {}, {}));

        const isPaymentExists = await getFirstMatch(PaymentModel, { orderId: isValidObjectId(orderId), isDeleted: false });
        if (isPaymentExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.dataAlreadyExist("Payment"), {}, {}));

        const order = await getFirstMatch(orderModel, { _id: isValidObjectId(orderId), isDeleted: false });
        if (!order) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Order"), {}, {}));

        if (amount !== order.totalAmount) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Please enter valid amount", {}, {}));

        const currentBalance = Number(findUser.walletBalance) || 0;
        if (currentBalance < order.totalAmount) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, `Insufficient Wallet Balance! You have ₹${currentBalance} and you need ₹${order.totalAmount}`, {}, {}));
        }

        const Option = {
            amount: Math.round(amount * 100),
            currency: currency || "INR",
            receipt: orderId,
        };

        const razorpayInstance = getRazorpayInstance();
        const razorpayOrder = await razorpayInstance.orders.create(Option);

        const payment = await createOne(PaymentModel, { userId: isValidObjectId((req as any).user?._id), orderId: isValidObjectId(orderId), amount, currency, razorpayOrderId: razorpayOrder.id, status: PAYMENT_STATUS.UNPAID });
        if (!payment) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.addDataError("Payment"), {}, {}));

        return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, responseMessage.paymentOrderCreated, { payment, razorpayOrder }, {}));
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.paymentOrderFailed, {}, {}));
    }
}

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { error, value } = verifyPaymentSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = value;

        const order = await getFirstMatch(orderModel, { _id: isValidObjectId(orderId), isDeleted: false });
        if (!order) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Order"), {}, {}));

        const payment = await getFirstMatch(PaymentModel, { razorpayOrderId, isDeleted: false });
        if (!payment) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.paymentOrderNotFound, {}, {}));

        const body = razorpayOrderId + "|" + razorpayPaymentId;

        const expectedSignature = crypto.createHmac("sha256", env.RAZORPAY_KEY_SECRET || "").update(body.toString()).digest("hex");

        if (expectedSignature !== razorpaySignature) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.paymentOrderFailed, {}, {}));
        }

        if (order.orderStatus === ORDER_STATUS.CANCELLED) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "This order is cancelled", {}, {}));
        if (order.paymentStatus === PAYMENT_STATUS.PAID) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Payment is already paid", {}, {}));
        if (order.paymentStatus === PAYMENT_STATUS.REFUNDED) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Payment is refunded", {}, {}));

        const updatedPayment = await updateData(PaymentModel, { razorpayOrderId }, { razorpayPaymentId: razorpayPaymentId, razorpaySignature: razorpaySignature, status: PAYMENT_STATUS.PAID, paidAt: new Date(), isDeleted: false }, { returnDocument: "after" });
        if (!updatedPayment) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Payment"), {}, {}));

        const updateOrder = await updateData(orderModel, { _id: isValidObjectId(orderId) }, { paymentStatus: PAYMENT_STATUS.PAID, orderStatus: ORDER_STATUS.CONFIRMED, isDeleted: false }, { returnDocument: "after" });
        if (!updateOrder) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Order"), {}, {}));

        await debitWallet({ userId: order.userId, amount: order.totalAmount });

        await createOne(notificationModel, {
            userId: order.userId,
            for: FOR.ADMIN,
            type: NOTIFICATION_TYPE.PAYMENT,
            title: "Payment Successfull!",
            message: `Payment for order "${order.orderNumber}" has been received.`,
            actionUrl: `admin/orders`
        });

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.paymentOrderVerified, updatedPayment, {}));
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.paymentOrderFailed, {}, {}));
    }
}

export const createRefund = async (req: Request, res: Response) => {
    try {
        const { error, value } = createRefundSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { orderId } = value;
        const orderObjectId = isValidObjectId(orderId);
        if (!orderObjectId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid Order ID", {}, {}));

        const order = await getFirstMatch(orderModel, { _id: orderObjectId });
        if (!order) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Order"), {}, {}));

        if (order.paymentStatus === PAYMENT_STATUS.REFUNDED) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Payment is already refunded", {}, {}));
        if (order.paymentStatus === PAYMENT_STATUS.UNPAID) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Payment is not paid", {}, {}));

        const payment = await getFirstMatch(PaymentModel, { orderId: orderObjectId });
        if (!payment) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.paymentOrderNotFound, {}, {}));

        if (!payment.razorpayPaymentId) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Payment ID not found. Payment cannot be refunded.", {}, {}));
        }

        const razorpayInstance = getRazorpayInstance();
        const razorpayPayment = await razorpayInstance.payments.fetch(payment.razorpayPaymentId);

        if (razorpayPayment.status !== "captured") {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, `Payment cannot be refunded. Current Razorpay status: ${razorpayPayment.status}`, {}, {}));
        }

        if ((razorpayPayment.amount_refunded || 0) >= Number(razorpayPayment.amount)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Payment is already fully refunded in Razorpay", {}, {}));
        }

        const refund = await (razorpayInstance.payments as any).refund(payment.razorpayPaymentId, {
            amount: payment.amount * 100
        });
        const updatePayment = await updateData(PaymentModel, { razorpayOrderId: payment.razorpayOrderId }, { status: PAYMENT_STATUS.REFUNDED, failureReason: value.failureReason, refundId: refund.id, refundedAt: new Date() }, { returnDocument: "after" });
        if (!updatePayment) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Payment"), {}, {}));

        const updateOrder = await updateData(orderModel, { _id: orderObjectId }, { paymentStatus: PAYMENT_STATUS.REFUNDED }, { returnDocument: "after" });
        if (!updateOrder) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Order"), {}, {}));

        await createOne(notificationModel, {
            userId: order.userId,
            for: FOR.USER,
            type: NOTIFICATION_TYPE.PAYMENT,
            title: "Payment Refunded!",
            message: `Payment for order "${order.orderNumber}" has been refunded.`,
            actionUrl: `order-list/order-details/${order.orderNumber}`
        });

        await creditWallet({ userId: order.userId, amount: order.totalAmount });

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Payment refund successfully", updatePayment, {}));
    } catch (error: any) {
        console.log("Refund error:", error);
        const statusCode = error?.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
        const message = error?.error?.description || responseMessage.paymentOrderFailed;
        return res.status(statusCode).json(new apiResponse(statusCode, message, error, {}));
    }
}

export const getPaymentById = async (req: Request, res: Response) => {
    try {
        const { error, value } = getPaymentByIdSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { paymentId } = value;

        const payment = await getFirstMatch(PaymentModel, { _id: isValidObjectId(paymentId), isDeleted: false });
        if (!payment) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.paymentOrderNotFound, {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Payment"), payment, {}));
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.getDataError("Payment"), {}, {}));
    }
}

export const failPayment = async (req: Request, res: Response) => {
    try {
        const { error, value } = failPaymentSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { failureReason } = value;

        const payment = await getFirstMatch(PaymentModel, { userId: isValidObjectId((req as any).user?._id), orderId: isValidObjectId(value.orderId), isDeleted: false });
        if (!payment) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.paymentOrderNotFound, {}, {}));

        const updatePayment = await updateData(PaymentModel, { _id: payment._id }, { status: PAYMENT_STATUS.FAILED, failureReason }, { returnDocument: "after" });
        if (!updatePayment) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Payment"), {}, {}));

        const updateOrder = await updateData(orderModel, { _id: payment.orderId }, { paymentStatus: PAYMENT_STATUS.FAILED }, { returnDocument: "after" });
        if (!updateOrder) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Order"), {}, {}));

        await createOne(notificationModel, {
            userId: payment.userId,
            for: FOR.USER,
            type: NOTIFICATION_TYPE.PAYMENT,
            title: "Payment Failed!",
            message: `Payment for order "${updateOrder.orderNumber}" has been failed.`,
            actionUrl: `order-list/order-details/${updateOrder.orderNumber}`
        });

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Payment failed", updatePayment, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.getDataError("Payment"), {}, {}));
    }
}