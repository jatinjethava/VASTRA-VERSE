import Joi from "joi";

export const getChatMessagesSchema = Joi.object({
    roomId: Joi.string().required(),
});

export const getChatMessagesQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50),
});

export const closeChatRoomSchema = Joi.object({
    roomId: Joi.string().required(),
});

export const getUnreadCountSchema = Joi.object({
    roomId: Joi.string().required(),
});
