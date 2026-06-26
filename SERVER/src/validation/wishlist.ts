import Joi from "joi";
import { isValidObjectId } from "../common";

export const addWishlistSchema = Joi.object({
    productId: Joi.string().required().custom(isValidObjectId),
}).unknown(true);

export const removeWishlistSchema = Joi.object({
    productId: Joi.string().required().custom(isValidObjectId),
}).unknown(true);

export const getWishlistSchema = Joi.object({
    page: Joi.number().optional().default(1),
    limit: Joi.number().optional().default(10),
}).unknown(true);
