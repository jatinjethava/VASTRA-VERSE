import { ReturnOrderModel, notificationModel, userModel, orderModel } from "../../models";
import { Request, Response } from "express";
import { apiResponse, responseMessage, HTTP_STATUS, deleteUploadedFiles, RETURN_STATUS, NOTIFICATION_TYPE, FOR, isValidObjectId } from "../../common";
import { returnSchema, updateReturnStatusSchema } from "../../validation";
import { createOne, getFirstMatch, getData, updateData } from "../../helpers";

export const createReturn = async (req: Request, res: Response) => {
    try {
        const { error, value } = returnSchema.validate(req.body);
        if (error) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }

        if (typeof value.orderItemId === "string") value.orderItemId = [value.orderItemId];

        const userId = (req as any).user._id || undefined;
        const getUser = await getFirstMatch(userModel, { _id: userId })
        if (!getUser) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("User"), {}, {}));
        }

        const existingReturn = await getFirstMatch(ReturnOrderModel, { userId: userId, orderId: value.orderId, orderNumber: value.orderNumber });
        if (existingReturn) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Return request already raised for this order!", {}, {}));
        }

        const images = req.files as Express.Multer.File[];
        if (images && images.length > 0) {
            value.images = images.map((image: Express.Multer.File) => image.path);
        }

        const returnOrderData = {
            userId: userId,
            orderItemId: value.orderItemId,
            orderId: value.orderId,
            reason: value.reason,
            description: value.description,
            images: value.images,
            orderNumber: value.orderNumber,
        }

        const returnOrder = await createOne(ReturnOrderModel, returnOrderData);
        if (!returnOrder) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.addDataError("Return Order"), {}, {}));
        }

        await updateData(orderModel, { _id: value.orderId }, { returnRequest: true });

        await createOne(notificationModel, {
            userId: getUser._id,
            for: FOR.ADMIN,
            type: NOTIFICATION_TYPE.RETURN,
            title: `Order return request from ${getUser.name}`,
            message: `Order has been return for ${returnOrder.reason} !`,
            actionUrl: `/admin/orders/return`
        });

        return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, responseMessage.addDataSuccess("Return Order"), { returnOrder }, {}));

    } catch (error) {
        console.log("Error in createReturn:", error);
        await deleteUploadedFiles(req.files);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getUserReturnOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id || undefined;
        const returnOrders = await getData(ReturnOrderModel, { userId, isDeleted: false }, { sort: { createdAt: -1 } }, { populate: "userId orderId orderItemId" });
        if (!returnOrders) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Return Orders"), {}, {}));
        }
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Return Orders"), { returnOrders }, {}));
    } catch (error) {
        console.log("Error in getUserReturnOrders:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

// for admin
export const getReturnOrders = async (req: Request, res: Response) => {
    try {
        const returnOrders = await getData(ReturnOrderModel, { isDeleted: false }, {}, { sort: { createdAt: -1 }, populate: "orderId" });
        if (!returnOrders) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Return Orders"), {}, {}));
        }
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Return Orders"), { returnOrders }, {}));
    } catch (error) {
        console.log("Error in getReturnOrders:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateReturnStatus = async (req: Request, res: Response) => {
    try {
        const { error, value } = updateReturnStatusSchema.validate({ ...req.params, ...req.body });
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }

        const returnOrder = await getFirstMatch(ReturnOrderModel, { _id: value.id }, {}, { populate: "orderItemId" });
        if (!returnOrder) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Return Order"), {}, {}));
        }

        if (value.status === RETURN_STATUS.APPROVED) {
            await updateData(ReturnOrderModel, { _id: isValidObjectId(value.id) }, { status: RETURN_STATUS.APPROVED, approvedAt: new Date() });
            await createOne(notificationModel, {
                userId: returnOrder.userId,
                for: FOR.USER,
                type: NOTIFICATION_TYPE.RETURN,
                title: `Order return request has been approved`,
                message: `Order return request has been approved`,
                actionUrl: `/order-list/order-details/${returnOrder.orderNumber}`
            });
            return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Return Order Approved Successfully", {}, {}));
        } else if (value.status === RETURN_STATUS.REJECTED) {
            await updateData(ReturnOrderModel, { _id: isValidObjectId(value.id) }, { status: RETURN_STATUS.REJECTED, rejectedAt: new Date() });
            await createOne(notificationModel, {
                userId: returnOrder.userId,
                for: FOR.USER,
                type: NOTIFICATION_TYPE.RETURN,
                title: `Order return request has been rejected`,
                message: `Order return request has been rejected`,
                actionUrl: `/order-list/order-details/${returnOrder.orderNumber}`
            });
            return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Return Order Rejected Successfully", {}, {}));
        }

        return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Return Order Update Failed", {}, {}));
    } catch (error) {
        console.log("Error in updateReturnStatus:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}
