import { orderModel, TShirtModel, notificationModel, userModel, CampaignModel, FlashSalesModel, PaymentModel } from "../../models";
import { Request, Response } from "express";
import { cancelOrderSchema, createOrderSchema, updateExpectedDeliveryDateSchema, updateOrderSchema, updatePaymentStatusSchema } from "../../validation";
import { FOR, HTTP_STATUS, NOTIFICATION_TYPE, ORDER_STATUS, apiResponse, applySales, generateOrderNumber, responseMessage, getDateForSalesQuery, PAYMENT_STATUS, creditWallet } from "../../common";
import { createOne, getData, getFirstMatch, updateData, updateMany } from "../../helpers";
import { isValidObjectId } from "mongoose";
import { generateInvoicePdf } from "../../services/invoice";
import { invoiceTemplate } from "../../template/invoice";
import NotificationService from "../../services/notification";

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { error, value } = createOrderSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const userId = (req as any).user?._id;

        const findUser = await getFirstMatch(userModel, { _id: userId, isDeleted: false, isBlocked: false, isEmailVerified: true });
        if (!findUser) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, "User not found", {}, {}));

        let calculatedSubtotal = 0;
        let calculatedTotalItems = 0;
        const orderItems = [];

        for (const item of value.items) {
            if (!isValidObjectId(item.productId)) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, `Invalid Product ID format: ${item.productId}`, {}, {}));
            }

            const product = await getFirstMatch(TShirtModel, { _id: item.productId, isDeleted: false });
            if (!product) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Product not found", {}, {}));

            const currentDate = getDateForSalesQuery();
            const campaign = await getFirstMatch(CampaignModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});
            const flashSales = await getFirstMatch(FlashSalesModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});

            const Apply = applySales(applySales(product, campaign), flashSales);
            const finalProducts = Apply;

            const variant = finalProducts.variants.find((v: any) => v.color.toLowerCase().trim() === item.color.toLowerCase().trim() && v.size.trim() === item.size.trim());
            if (!variant) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, `This color and size not avilable for this ${product.title}`, {}, {}));

            if (variant.stock < item.quantity) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, `Only ${variant.stock} available for ${product.title} (${item.size}, ${item.color})`, {}, {}));
            }

            const itemPrice = finalProducts.discountPrice > 0 ? finalProducts.discountPrice : finalProducts.basePrice;

            orderItems.push({
                productId: product._id,
                title: finalProducts.title,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                basePrice: finalProducts.basePrice,
                costPrice: product.costPrice || 0,
                discountPrice: finalProducts.discountPrice,
                total: itemPrice * item.quantity,
                images: finalProducts.images
            });

            calculatedSubtotal += itemPrice * item.quantity;
            calculatedTotalItems += item.quantity;
        }

        value.subtotal = calculatedSubtotal;
        value.totalItems = calculatedTotalItems;
        value.shippingFee = (value.subtotal > 1000) ? 0 : 100;
        value.items = orderItems;

        const totalAmount = value.subtotal + value.shippingFee;

        const currentBalance = Number(findUser.walletBalance) || 0;
        if (currentBalance < totalAmount) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, `Insufficient Wallet Balance! You have ₹${currentBalance} and you need ₹${value.totalAmount}`, {}, {}));
        }

        value.orderNumber = await generateOrderNumber();
        const order = await createOne(orderModel, { userId: userId, ...value });

        if (!order) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Error While Creating Order!", {}, {}));
        }

        // await NotificationService.sendOrderPlaced(findUser, order);

        if (userId) {
            await createOne(notificationModel, {
                userId: userId,
                for: FOR.ADMIN,
                type: NOTIFICATION_TYPE.ORDER,
                title: "One Order received!",
                message: `New order has been placed!`,
                actionUrl: `admin/orders`
            });
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Order Created Successfully!", { order }, {}));

    } catch (error) {
        console.error("Error in createOrder:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const orders = await getData(orderModel, { userId: (req as any).user?._id, isDeleted: false }, {})
        if (!orders || orders.length === 0) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Orders"), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Orders Fetched Successfully!", { orders }, {}));
    } catch (error) {
        console.error("Error in getMyOrders:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateOrder = async (req: Request, res: Response) => {
    try {
        const { error, value } = updateOrderSchema.validate(req.body);
        value.orderId = req.params.orderId;
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const order = await getFirstMatch(orderModel, { _id: value.orderId, isDeleted: false });
        if (!order) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Order"), {}, {}));

        const findUser = await getFirstMatch(userModel, { _id: order.userId });

        const updatedOrder = await updateData(orderModel, { _id: value.orderId }, { orderStatus: value.orderStatus }, { projection: { _id: 0, totalItems: 1, orderNumber: 1, totalAmount: 1, orderStatus: 1, paymentStatus: 1, createdAt: 1 } });

        if (value.reason && value.reason.trim().length > 0) {
            await updateData(orderModel, { _id: value.orderId }, { reason: value.reason.trim() }, {});
        }

        if (value.orderStatus === ORDER_STATUS.SHIPPED) {
            // if (findUser) await NotificationService.sendOrderShipped(findUser, order);
            await createOne(notificationModel, {
                userId: order.userId,
                for: FOR.USER,
                type: NOTIFICATION_TYPE.SHIPPING,
                title: "Your order has been shipped!",
                message: `Order ${order.orderNumber} has been shipped!`,
                actionUrl: `order-list/order-details/${order.orderNumber}`
            });
            await updateData(orderModel, { _id: value.orderId }, { shippedAt: Date.now() }, {});
        }

        if (value.orderStatus === ORDER_STATUS.DELIVERED) {
            for (const orderItem of order.items) {
                const findProduct = await getFirstMatch(TShirtModel, { _id: orderItem.productId }, {});
                if (!findProduct) continue;

                const variant = findProduct.variants.find(
                    (v: any) =>
                        v.size === orderItem.size &&
                        v.color === orderItem.color
                );

                if (!variant) continue;

                const decrementAmount = Math.min(variant.stock, orderItem.quantity);

                await updateData(TShirtModel, {
                    _id: orderItem.productId,
                    variants: { $elemMatch: { size: orderItem.size, color: orderItem.color } }
                }, {
                    $inc: {
                        soldCount: orderItem.quantity,
                        "variants.$.stock": -decrementAmount
                    }
                }, {});
            }

            // if (findUser) await NotificationService.sendOrderDelivered(findUser, order);
            await createOne(notificationModel, {
                userId: order.userId,
                for: FOR.USER,
                type: NOTIFICATION_TYPE.ORDER,
                title: "Your order has been delivered!",
                message: `Order ${order.orderNumber} has been delivered!`,
                actionUrl: `order-list/order-details/${order.orderNumber}`
            });
            await updateData(orderModel, { _id: value.orderId }, { deliveredAt: Date.now() }, {});
        }

        if (value.orderStatus === ORDER_STATUS.CANCELLED) {
            await createOne(notificationModel, {
                userId: order.userId,
                for: FOR.USER,
                type: NOTIFICATION_TYPE.ORDER,
                title: "Your order has been cancelled!",
                message: `Order ${order.orderNumber} has been cancelled!`,
                actionUrl: `order-list/order-details/${order.orderNumber}`
            });
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess("Order"), { updatedOrder }, {}));
    } catch (error) {
        console.error("Error in updateOrder:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateExpectedDeliveryDate = async (req: Request, res: Response) => {
    try {
        const { error, value } = updateExpectedDeliveryDateSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const order = await getFirstMatch(orderModel, { _id: value.orderId, isDeleted: false });
        if (!order) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Order"), {}, {}));

        const updatedOrder = await updateData(orderModel, { _id: value.orderId }, { expectedDeliveryDate: value.expectedDeliveryDate }, { projection: { _id: 0, totalItems: 1, orderNumber: 1, totalAmount: 1, orderStatus: 1, paymentStatus: 1, createdAt: 1 } });
        if (order.userId) {
            await createOne(notificationModel, {
                userId: order.userId,
                for: FOR.USER,
                type: NOTIFICATION_TYPE.ORDER,
                title: "Check Your Delivery Date",
                message: `Order ${order.orderNumber} expected delivery date has been updated from ${new Date(order.orderedAt).toDateString()} to ${new Date(value.expectedDeliveryDate).toDateString()}`,
                actionUrl: `order-list/order-details/${order.orderNumber}`
            });
        }
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Expected Delivery Date Updated Successfully!", { updatedOrder }, {}));

    } catch (error) {
        console.error("Error in updateExpectedDeliveryDate:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updatePaymentStatus = async (req: Request, res: Response) => {
    try {
        const { error, value } = updatePaymentStatusSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const order = await getFirstMatch(orderModel, { _id: value.orderId, isDeleted: false });
        if (!order) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Order"), {}, {}));

        const updatedOrder = await updateData(orderModel, { _id: value.orderId }, { paymentStatus: value.paymentStatus }, { projection: { _id: 0, totalItems: 1, orderNumber: 1, totalAmount: 1, orderStatus: 1, paymentStatus: 1, createdAt: 1 } });

        await createOne(notificationModel, {
            userId: order.userId,
            for: FOR.USER,
            type: NOTIFICATION_TYPE.PAYMENT,
            title: "Payment Status Updated!",
            message: `Your payment status for order "${order.orderNumber}" has been updated to "${value.paymentStatus}".`,
            actionUrl: `order-list/order-details/${order.orderNumber}`
        });

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess("Payment Status"), { updatedOrder }, {}));
    } catch (error) {
        console.error("Error in updatePaymentStatus:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const cancelOrder = async (req: Request, res: Response) => {
    try {
        const { error, value } = cancelOrderSchema.validate(req.params);
        const { reason } = req.body;
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        const order = await getFirstMatch(orderModel, { _id: value.orderId, isDeleted: false });
        if (!order) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Order"), {}, {}));

        if (order.paymentStatus === PAYMENT_STATUS.PAID) {
            const refundOrder = await createOne(PaymentModel, {
                userId: order.userId,
                orderId: order._id,
                amount: order.totalAmount,
                razorpayOrderId: order.razorpayOrderId,
                razorpayPaymentId: order.razorpayPaymentId,
                signature: order.signature,
                paymentStatus: PAYMENT_STATUS.REFUNDED,
                transactionType: "REFUND"
            });
            if (!refundOrder) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Order"), {}, {}));
            await updateData(orderModel, { _id: value.orderId }, { paymentStatus: PAYMENT_STATUS.REFUNDED });
            await creditWallet({ userId: order.userId, amount: order.totalAmount });
        }

        const updatedOrder = await updateData(orderModel, { _id: value.orderId, isDeleted: false }, { orderStatus: ORDER_STATUS.CANCELLED, reason: reason, isDeleted: true }, { projection: { _id: 0, totalItems: 1, orderNumber: 1, totalAmount: 1, orderStatus: 1, paymentStatus: 1, createdAt: 1 } });
        if (updatedOrder) {
            await createOne(notificationModel, {
                for: FOR.ADMIN,
                type: NOTIFICATION_TYPE.ORDER,
                title: "Order Cancelled",
                message: `Order "${order.orderNumber}" has been cancelled by user.`,
                actionUrl: `admin/orders`
            });
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess("Order"), { updatedOrder }, {}));
    } catch (error) {
        console.error("Error in cancelOrder:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const fetchAllOrders = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 0; // 0 means fetch all if not specified
        const skip = (page - 1) * limit;

        const query = { isDeleted: false };
        const totalOrders = await orderModel.countDocuments(query);
        const totalPages = limit > 0 ? Math.ceil(totalOrders / limit) : 1;

        let ordersQuery = orderModel.find(query).sort({ createdAt: -1 });
        if (limit > 0) {
            ordersQuery = ordersQuery.skip(skip).limit(limit);
        }
        const orders = await ordersQuery;

        if (!orders || orders.length === 0) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Orders"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Orders Fetched Successfully!", {
            orders,
            pagination: { totalOrders, totalPages, currentPage: page, limit }
        }, {}));
    } catch (error) {
        console.error("Error in fetchAllOrders:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const addReason = async (req: Request, res: Response) => {
    try {
        const { error, value } = cancelOrderSchema.validate(req.params);
        const { reason } = req.body;
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        value.reason = reason;
        const order = await getFirstMatch(orderModel, { _id: value.orderId, isDeleted: false });
        if (!order) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Order"), {}, {}));

        const updatedOrder = await updateData(orderModel, { _id: value.orderId, isDeleted: false }, { reason: value.reason }, { projection: { _id: 0, totalItems: 1, orderNumber: 1, totalAmount: 1, orderStatus: 1, paymentStatus: 1, createdAt: 1 } });

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess("Order"), { updatedOrder }, {}));
    } catch (error) {
        console.error("Error in addReason:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const downloadInvoice = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        if (!isValidObjectId(orderId)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid Order ID format", {}, {}));
        }

        const order = await getFirstMatch(orderModel, { _id: orderId, isDeleted: false });
        if (!order) {
            return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Order"), {}, {}));
        }

        const userId = (req as any).user?._id;
        if (userId && order.userId.toString() !== userId.toString() && (req as any).user?.role !== 'admin') {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, "Unauthorized access to this invoice", {}, {}));
        }

        const html = invoiceTemplate(order);
        const pdfBuffer = await generateInvoicePdf(html);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=invoice-${order.orderNumber}.pdf`);
        return res.end(pdfBuffer);
    } catch (error) {
        console.error("Error in downloadInvoice:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const checkStatus = async (req: Request, res: Response) => {
    try {
        const { orderNumber } = req.params;
        const order = await getFirstMatch(orderModel, { orderNumber: orderNumber, isDeleted: false });
        if (!order) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Order"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Order Status Fetched Successfully!", { status: order }, {}));
    } catch (error) {
        console.error("Error in checkStatus:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}