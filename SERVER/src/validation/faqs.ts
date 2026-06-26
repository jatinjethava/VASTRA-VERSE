import Joi from "joi";
import { FAQ_CATEGORY } from "../common";

export const createFaqsSchema = Joi.object({
    category: Joi.valid(...Object.values(FAQ_CATEGORY)).required(),
    question: Joi.string().required(),
    answer: Joi.string().required(),
    isPublished: Joi.boolean().default(false),
    isActive: Joi.boolean().default(true),
});

export const updateFaqsSchema = Joi.object({
    id: Joi.string().required(),
    category: Joi.valid(...Object.values(FAQ_CATEGORY)).required(),
    question: Joi.string().required(),
    answer: Joi.string().required(),
    isPublished: Joi.boolean().required(),
    isActive: Joi.boolean().required()
});

export const deleteFaqsSchema = Joi.object({
    id: Joi.string().required(),
});

export const getFaqsSchema = Joi.object({
    id: Joi.string().required(),
});

export const toggleActiveFaqsSchema = Joi.object({
    id: Joi.string().required()
});