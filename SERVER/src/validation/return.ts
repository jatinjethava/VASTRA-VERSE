import Joi from "joi";
import { isValidObjectId, RETURN_STATUS } from "../common";

export const returnSchema = Joi.object({
    orderId: Joi.string().required().custom(isValidObjectId),
    orderItemId: Joi.alternatives().try(
        Joi.array().items(Joi.string().custom(isValidObjectId)).min(1),
        Joi.string().custom(isValidObjectId)
    ).required(),
    orderNumber: Joi.string().required().trim().min(1),
    reason: Joi.string().required().trim().min(1).max(50),
    description: Joi.string().required().trim().min(1).max(500),
    images: Joi.array().items(Joi.string()).min(1).max(5),
})

export const updateReturnStatusSchema = Joi.object({
    id: Joi.string().required().custom(isValidObjectId),
    status: Joi.string().required().valid(...Object.values(RETURN_STATUS)).trim(),
})