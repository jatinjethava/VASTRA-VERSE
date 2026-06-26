import { Request, Response } from 'express';
import { userModel, walletTransactionModel, walletRechargeModel } from '../../models';
import { apiResponse, responseMessage, HTTP_STATUS } from '../../common';
import { creditWallet, debitWallet, isValidObjectId } from '../../utils/utils';
import { createOne, getData, getFirstMatch, updateData } from '../../helpers';
import { env } from '../../config';
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

export const creditMoney = async (req: Request, res: Response) => {
    try {
        const { amount } = req.body;
        const userId = (req as any).user?._id;

        if (!isValidObjectId(userId)) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid user", {}, {}));
        if (!amount || amount <= 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Amount is required", {}, {}));

        const user = await getFirstMatch(userModel, { _id: userId, isDeleted: false });
        if (!user) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "User not found", {}, {}));
        }

        const walletId = `wallet_${Date.now()}`;

        const Option = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: walletId,
        };

        const razorpayInstance = getRazorpayInstance();
        const order = await razorpayInstance.orders.create(Option);
        if (!order) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Failed to create order", {}, {}));
        }

        const walletRecharge = await createOne(walletRechargeModel, {
            userId: userId,
            amount: amount,
            currency: "INR",
            razorpayOrderId: order.id,
            status: "pending",
        });

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Order created successfully", { order, walletId: walletRecharge._id }, {}));
    } catch (error) {
        console.log("Error in addMoney:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const verifyCreditPayment = async (req: Request, res: Response) => {
    try {
        const { amount, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        const userId = (req as any).user?._id;

        if (!isValidObjectId(userId)) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid user", {}, {}));
        if (!amount || amount <= 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Amount is required", {}, {}));
        if (!razorpayPaymentId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Payment ID is required", {}, {}));
        if (!razorpaySignature) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Signature is required", {}, {}));
        if (!razorpayOrderId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Wallet ID is required", {}, {}));

        const walletRecharge = await getFirstMatch(walletRechargeModel, { razorpayOrderId: razorpayOrderId, userId: userId });
        if (!walletRecharge) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Wallet recharge not found", {}, {}));
        }

        if (walletRecharge.status === "success") {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Payment already verified", {}, {}));
        }

        const expectedSignature = crypto
            .createHmac("sha256", env.RAZORPAY_KEY_SECRET || "")
            .update(walletRecharge.razorpayOrderId + "|" + razorpayPaymentId)
            .digest("hex");

        if (expectedSignature !== razorpaySignature) {
            await updateData(walletRechargeModel, { razorpayOrderId: razorpayOrderId }, { status: "failed" });
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid payment signature", {}, {}));
        }

        const user = await getFirstMatch(userModel, { _id: userId, isDeleted: false });
        if (!user) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "User not found", {}, {}));
        }

        const data = await creditWallet({ userId, amount });
        if (!data) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Failed to add money", {}, {}));
        }

        await updateData(walletRechargeModel, { razorpayOrderId: razorpayOrderId }, {
            status: "success",
            razorpayPaymentId,
            razorpaySignature
        });

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Money added successfully", data, {}));
    } catch (error) {
        console.log("Error in addMoney:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getWalletInfo = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;

        if (!isValidObjectId(userId)) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid user", {}, {}));

        const user = await getFirstMatch(userModel, { _id: userId, isDeleted: false });
        if (!user) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "User not found", {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Wallet info fetched successfully", user, {}));
    } catch (error) {
        console.log("Error in getWalletInfo:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getWalletTransactions = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;

        if (!isValidObjectId(userId)) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid user", {}, {}));

        const walletTransactions = await getData(walletTransactionModel, { user: userId, isDeleted: false });
        if (!walletTransactions) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Wallet transactions not found", {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Wallet transactions fetched successfully", walletTransactions, {}));
    } catch (error) {
        console.log("Error in getWalletTransactions:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}