import { notificationModel, notificationDocument } from "../../models";
import { Response, Request } from "express";
import { apiResponse, FOR, HTTP_STATUS, responseMessage } from "../../common";
import { getNotificationSchema, updateNotificationSchema } from "../../validation";
import { getData, updateData, updateMany, countData } from "../../helpers";
import { isValidObjectId } from "mongoose";

export const getAdminNotifications = async (req: Request, res: Response) => {
    try {
        const notifications = await getData(notificationModel, { for: FOR.ADMIN }, {}, { sort: { createdAt: -1 } });
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Notifications"), { notifications }, {}));
    } catch (error: any) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const notification = await updateData(notificationModel, { _id: req.params.id }, { isRead: true });
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Notification"), { notification }, {}));
    } catch (error: any) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const markAllAsReadAdmin = async (req: Request, res: Response) => {
    try {
        const notification = await updateMany(notificationModel, { for: FOR.ADMIN }, { isRead: true });
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "All notifications marked as read", { notification }, {}));
    } catch (error: any) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const markAllAsReadUser = async (req: Request, res: Response) => {
    try {
        const notification = await updateMany(notificationModel, { for: FOR.USER }, { isRead: true });
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "All notifications marked as read", { notification }, {}));
    } catch (error: any) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const AllreadAdminNotifications = async (req: Request, res: Response) => {
    try {
        const { error, value } = updateNotificationSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { isRead } = value;
        const notifications = await getData(notificationModel, { for: FOR.ADMIN, ...(isRead !== undefined && { isRead }) }, { sort: { createdAt: -1 } });

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Notifications"), { notifications }, {}));
    } catch (error: any) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getUserNotifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;
        const notifications = await getData(notificationModel, { userId: userId, for: FOR.USER }, {}, { sort: { createdAt: -1 } });

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Notifications"), { notifications }, {}));
    } catch (error: any) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const readUserNotifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;
        const notification = await updateMany(notificationModel, { for: FOR.USER, userId: userId }, { isRead: true });
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Notification"), { notification }, {}));
    } catch (error: any) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}