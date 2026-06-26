import Joi from "joi";
import { AUTHOR_TYPE, BLOG_CATEGORY, BLOG_STATUS } from "../common";

export const createBlogSchema = Joi.object({
    userId: Joi.string().optional(),
    author: Joi.string().valid(...Object.values(AUTHOR_TYPE)).optional(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    subTitle: Joi.string().required(),
    subDescription: Joi.string().required(),
    content: Joi.array().items(Joi.string()).required(),
    category: Joi.string().valid(...Object.values(BLOG_CATEGORY)).required(),
    seoTitle: Joi.string(),
    seoDescription: Joi.string(),
    seoKeywords: Joi.array().items(Joi.string()),
    status: Joi.string().valid(...Object.values(BLOG_STATUS)).default(BLOG_STATUS.DRAFT)
})

export const updateBlogSchema = Joi.object({
    author: Joi.string().valid(...Object.values(AUTHOR_TYPE)).optional(),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    subTitle: Joi.string().optional(),
    subDescription: Joi.string().optional(),
    content: Joi.array().items(Joi.string()).optional(),
    featuredImage: Joi.string().optional(),
    images: Joi.array().items(Joi.string()).optional(),
    category: Joi.string().valid(...Object.values(BLOG_CATEGORY)).optional(),
    seoTitle: Joi.string().optional(),
    seoDescription: Joi.string().optional(),
    seoKeywords: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid(...Object.values(BLOG_STATUS)).optional()
})

export const deleteBlogSchema = Joi.object({
    id: Joi.string().required()
})

export const getBlogByIdSchema = Joi.object({
    id: Joi.string().required()
})

export const getBlogsSchema = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    category: Joi.string().valid(...Object.values(BLOG_CATEGORY)).optional(),
})

export const updateBlogStatusSchema = Joi.object({
    id: Joi.string().required(),
    status: Joi.string().valid(...Object.values(BLOG_STATUS)).required()
})