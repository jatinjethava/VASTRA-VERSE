import Joi from "joi";

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    message: Joi.string().required()
});

export const deleteContactSchema = Joi.object({
    id: Joi.string().required(),
});

export const getContactSchema = Joi.object({
    id: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
    id: Joi.string().required()
});