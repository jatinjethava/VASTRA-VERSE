import Joi from "joi";
import { ADDRESS_LABEL } from "../common";

export const createAddressSchema = Joi.object({
    label: Joi.valid(...Object.values(ADDRESS_LABEL)).default(ADDRESS_LABEL.HOME).required(),
    addressLine1: Joi.string().min(5).max(100).required(),
    addressLine2: Joi.string().optional(),
    city: Joi.string().min(2).max(25).required(),
    state: Joi.string().min(2).max(25).required(),
    pincode: Joi.string().length(6).pattern(/^[0-9]{6}$/).required(),
    country: Joi.string().required(),
    isDefault: Joi.boolean().default(false),
});

export const updateAddressSchema = Joi.object({
    label: Joi.valid(...Object.values(ADDRESS_LABEL)).default(ADDRESS_LABEL.HOME).optional(),
    addressLine1: Joi.string().min(5).max(100).optional(),
    addressLine2: Joi.string().optional(),
    city: Joi.string().min(2).max(25).optional(),
    state: Joi.string().min(2).max(25).optional(),
    pincode: Joi.string().length(6).pattern(/^[0-9]{6}$/).optional(),
    country: Joi.string().optional(),
    isDefault: Joi.boolean().optional(),
    isDeleted: Joi.boolean().default(false),
});

export const getAddressSchema = Joi.object({
    userId: Joi.string().required(),
});

export const deleteAddressSchema = Joi.object({
    id: Joi.string().required(),
});

export const setAsDefaultAddressSchema = Joi.object({
    id: Joi.string().required(),
});