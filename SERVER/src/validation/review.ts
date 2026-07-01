import Joi from "joi";
import { isValidObjectId } from "mongoose";

const objectIdValidator = (value: any, helpers: any) => {
    if (!isValidObjectId(value)) {
        return helpers.error("Invalid ObjectId");
    }
    return value;
};

export const createReviewSchema = Joi.object({
    userId: Joi.string().custom(objectIdValidator).optional(),
    productId: Joi.string().custom(objectIdValidator).required(),
    rating: Joi.number().required().min(1).max(5).positive(),
    title: Joi.string().required(),
    comment: Joi.string().required(),
    images: Joi.alternatives().try(Joi.array(), Joi.string()).optional(),
    user: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
    }).optional(),
    recommended: Joi.boolean().default(false).optional(),
    isVerifiedPurchase: Joi.boolean().default(false).optional(),
    helpfulCount: Joi.number().default(0).optional().positive(),
    likes: Joi.number().default(0).optional().positive(),
    reported: Joi.boolean().default(false).optional(),
    adminReply: Joi.string().optional(),
})

export const updateReviewSchema = Joi.object({
    userId: Joi.string().custom(objectIdValidator).optional(),
    productId: Joi.string().custom(objectIdValidator).optional(),
    rating: Joi.number().min(1).max(5).optional(),
    title: Joi.string().optional(),
    comment: Joi.string().optional(),
    images: Joi.alternatives().try(Joi.array(), Joi.string()).optional(),
    user: Joi.object({
        name: Joi.string().optional(),
        email: Joi.string().optional(),
        phone: Joi.string().optional(),
    }).optional(),
    recommended: Joi.boolean().default(false).optional(),
    isVerifiedPurchase: Joi.boolean().default(false).optional(),
    helpfulCount: Joi.number().default(0).optional().positive(),
    likes: Joi.number().default(0).optional().positive(),
    reported: Joi.boolean().default(false).optional(),
    adminReply: Joi.string().optional(),
})

export const getReviewSchema = Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
})

export const deleteReviewSchema = Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
})

export const updateStatusSchema = Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
    isDeleted: Joi.boolean().required(),
})

export const updateHelpfulCountSchema = Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
    helpfulCount: Joi.number().required(),
})

export const updateLikesSchema = Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
    likes: Joi.number().required(),
})

export const updateReportedSchema = Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
    reported: Joi.boolean().required(),
})

export const updateAdminReplySchema = Joi.object({
    id: Joi.string().custom(objectIdValidator).required(),
    adminReply: Joi.string().required(),
})