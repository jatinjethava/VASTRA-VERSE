import Joi from "joi";
import { isValidObjectId } from "mongoose";

const objectIdValidator = (value: any, helpers: any) => {
    if (!isValidObjectId(value)) {
        return helpers.error("Invalid ObjectId");
    }
    return value;
};

export const createLikeSchema = Joi.object({
    userId: Joi.string().custom(objectIdValidator).optional(),
    id: Joi.string().custom(objectIdValidator).required(),
    isDeleted: Joi.boolean().default(false).optional(),
})

export const updateLikeSchema = Joi.object({
    userId: Joi.string().custom(objectIdValidator).optional(),
    id: Joi.string().custom(objectIdValidator).required(),
    isDeleted: Joi.boolean().default(false).optional(),
})


export const createHelpfulSchema = Joi.object({
    userId: Joi.string().custom(objectIdValidator).optional(),
    id: Joi.string().custom(objectIdValidator).required(),
    isDeleted: Joi.boolean().default(false).optional(),
})

export const updateHelpfulSchema = Joi.object({
    userId: Joi.string().custom(objectIdValidator).optional(),
    id: Joi.string().custom(objectIdValidator).required(),
    isDeleted: Joi.boolean().default(false).optional(),
})