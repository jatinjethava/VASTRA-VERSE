import Joi from "joi";
import { isValidObjectId } from "mongoose";

export const viewBlogSchema = Joi.object({
    id: Joi.custom((value, helpers) => {
        if (!isValidObjectId(value)) {
            return helpers.error("Invalid ObjectId");
        }
        return value;
    }).required(),
});

export const getBlogByIdSchema = Joi.object({
    id: Joi.custom((value, helpers) => {
        if (!isValidObjectId(value)) {
            return helpers.error("Invalid ObjectId");
        }
        return value;
    }).required(),
});