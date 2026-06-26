import Joi from "joi";
import { Types } from "mongoose";
import { isValidObjectId } from "../common";

export const createCategorySchema = Joi.object({
    name: Joi.string().required().trim(),
    slug: Joi.string().required().trim(),
    description: Joi.string().required().trim(),
    banner: Joi.string().optional().trim(),
    parentCategory: Joi.custom((value) => isValidObjectId(value) ? new Types.ObjectId(value) : null).optional(),
    sortOrder: Joi.number().optional().default(0).positive(),
    seoTitle: Joi.string().optional().trim(),
    seoDescription: Joi.string().optional().trim(),
})

export const updateCategorySchema = Joi.object({
    name: Joi.string().optional().trim(),
    slug: Joi.string().optional().trim(),
    description: Joi.string().optional().trim(),
    banner: Joi.string().optional().trim(),
    parentCategory: Joi.custom((value) => isValidObjectId(value) ? new Types.ObjectId(value) : null).optional(),
    sortOrder: Joi.number().optional().positive(),
    seoTitle: Joi.string().optional().trim(),
    seoDescription: Joi.string().optional().trim(),
})

export const deleteCategorySchema = Joi.object({
    id: Joi.string().required().custom(isValidObjectId)
})

export const getCategoryByIdSchema = Joi.object({
    id: Joi.string().required().custom(isValidObjectId)
})

export const getCategoryBySlugSchema = Joi.object({
    slug: Joi.string().required().trim()
})

export const getChildrenCategorySchema = Joi.object({
    id: Joi.string().required().custom(isValidObjectId)
})