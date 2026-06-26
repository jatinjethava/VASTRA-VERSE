import Joi from "joi";
import { FOR, NOTIFICATION_TYPE } from "../common";

export const createNotificationSchema = Joi.object<{
    title: string;
    message: string;
    type: keyof typeof NOTIFICATION_TYPE;
    for: keyof typeof FOR;
    actionUrl?: string;
    userId?: string;
}>({
    title: Joi.string().required(),
    message: Joi.string().required(),
    type: Joi.string().valid(...Object.values(NOTIFICATION_TYPE)).required(),
    for: Joi.string().valid(...Object.values(FOR)).required(),
    actionUrl: Joi.string(),
    userId: Joi.string().optional(),
})

export const getNotificationSchema = Joi.object<{
    userId?: string;
    for?: keyof typeof FOR;
    isRead?: boolean;
}>({
    userId: Joi.string().optional(),
    for: Joi.string().valid(...Object.values(FOR)).optional(),
    isRead: Joi.boolean().optional(),
})

export const updateNotificationSchema = Joi.object<{
    isRead: boolean;
}>({
    isRead: Joi.boolean().required(),
})

export const deleteNotificationSchema = Joi.object<{
    userId: string;
}>({
    userId: Joi.string().required(),
})

export const clearAllNotificationSchema = Joi.object<{
    for?: keyof typeof FOR;
}>({
    for: Joi.string().valid(...Object.values(FOR)).optional(),
})