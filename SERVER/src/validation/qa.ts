import Joi from "joi";
import { isValidObjectId } from "../common";

export const askQuestionSchema = Joi.object({
    productId: Joi.string().required().custom(isValidObjectId).messages({ "string.pattern.base": "Product is required" }),
    question: Joi.string().required().min(5).max(500).messages({ "string.min": "Question must be at least 5 characters long", "string.max": "Question must be at most 500 characters long", "string.empty": "Question is required", "any.required": "Question is required" }),
});

export const answerQuestionSchema = Joi.object({
    questionId: Joi.string().required().custom(isValidObjectId).messages({ "string.pattern.base": "Question is required" }),
    answer: Joi.string().required().min(5).max(500).messages({ "string.min": "Answer must be at least 5 characters long", "string.max": "Answer must be at most 500 characters long", "string.empty": "Answer is required", "any.required": "Answer is required" }),
});

export const getQAByProductIdSchema = Joi.object({
    productId: Joi.string().required().custom(isValidObjectId).messages({ "string.pattern.base": "Product is required" }),
});

export const getQAByQuestionIdSchema = Joi.object({
    questionId: Joi.string().required().custom(isValidObjectId).messages({ "string.pattern.base": "Question is required" }),
});

export const deleteQuestionSchema = Joi.object({
    questionId: Joi.string().required().custom(isValidObjectId).messages({ "string.pattern.base": "Question is required" }),
});

export const deleteAnswerSchema = Joi.object({
    answerId: Joi.string().required().custom(isValidObjectId).messages({ "string.pattern.base": "Answer is required" }),
});