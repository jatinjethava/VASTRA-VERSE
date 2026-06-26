import { ChatRoomModel, ChatMessageModel } from "../../models";
import { Request, Response } from "express";
import { apiResponse, HTTP_STATUS, responseMessage, isValidObjectId } from "../../common";
import { getChatMessagesSchema, getChatMessagesQuerySchema, closeChatRoomSchema, getUnreadCountSchema } from "../../validation";
import { countData } from "../../helpers";

export const getChatRooms = async (req: Request, res: Response) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;
        const statusFilter = req.query.status as string | undefined;

        const criteria: any = {};
        if (statusFilter === "open" || statusFilter === "closed") {
            criteria.status = statusFilter;
        }

        const totalCount = await countData(ChatRoomModel, criteria);

        const rooms = await ChatRoomModel
            .find(criteria)
            .populate("customer", "name email profileImage mobileNumber")
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Chat rooms"), {
            rooms,
            pagination: {
                page,
                limit,
                totalCount,
                pageLimit: Math.ceil(totalCount / limit) || 1,
            }
        }, {}));
    } catch (error) {
        console.log("Error in getChatRooms:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
};

export const getChatMessages = async (req: Request, res: Response) => {
    try {
        const { error: paramError, value: paramValue } = getChatMessagesSchema.validate(req.params);
        if (paramError) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, paramError.details[0]?.message || "Validation Error", {}, {}));

        const { error: queryError, value: queryValue } = getChatMessagesQuerySchema.validate(req.query);
        if (queryError) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, queryError.details[0]?.message || "Validation Error", {}, {}));

        const roomId = isValidObjectId(paramValue.roomId);
        if (!roomId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid room ID", {}, {}));

        const room = await ChatRoomModel.findById(roomId);
        if (!room) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Chat room"), {}, {}));

        const user = (req as any).user;
        const admin = (req as any).admin;
        if (!admin && user && String(room.customer) !== String(user._id)) {
            return res.status(HTTP_STATUS.FORBIDDEN).json(new apiResponse(HTTP_STATUS.FORBIDDEN, responseMessage.accessDenied, {}, {}));
        }

        const { page, limit } = queryValue;
        const skip = (page - 1) * limit;
        const totalCount = await countData(ChatMessageModel, { roomId } as any);

        const messages = await ChatMessageModel
            .find({ roomId } as any)
            .populate("sender", "name email profileImage")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Chat messages"), {
            messages: messages.reverse(),
            pagination: {
                page,
                limit,
                totalCount,
                pageLimit: Math.ceil(totalCount / limit) || 1,
            }
        }, {}));
    } catch (error) {
        console.log("Error in getChatMessages:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
};

export const closeChatRoom = async (req: Request, res: Response) => {
    try {
        const { error, value } = closeChatRoomSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const roomId = isValidObjectId(value.roomId);
        if (!roomId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid room ID", {}, {}));

        const room = await ChatRoomModel.findByIdAndUpdate(
            roomId,
            { status: "closed" },
            { new: true, lean: true }
        );

        if (!room) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Chat room"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess("Chat room"), { room }, {}));
    } catch (error) {
        console.log("Error in closeChatRoom:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
};

export const getMyRoom = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        if (!user?._id) return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.invalidToken, {}, {}));

        const room = await ChatRoomModel
            .findOne({ customer: user._id, status: "open" })
            .lean();

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Chat room"), { room: room || null }, {}));
    } catch (error) {
        console.log("Error in getMyRoom:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
};

export const getUnreadCount = async (req: Request, res: Response) => {
    try {
        const { error, value } = getUnreadCountSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const roomId = isValidObjectId(value.roomId);
        if (!roomId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid room ID", {}, {}));

        const user = (req as any).user;
        const admin = (req as any).admin;

        const senderType = admin ? "customer" : "admin";
        const unreadCount = await countData(ChatMessageModel, {
            roomId,
            senderType,
            isRead: false,
        } as any);

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Unread count"), { unreadCount }, {}));
    } catch (error) {
        console.log("Error in getUnreadCount:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
};
