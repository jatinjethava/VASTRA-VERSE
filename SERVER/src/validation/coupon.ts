import Joi from "joi";
import { DISCOUNTTYPE } from "../common";

export const createCouponSchema = Joi.object({
    code: Joi.string().required().regex(/^[A-Z0-9\-_ ]+$/).message("Coupon code must contain only uppercase letters, numbers, spaces, hyphens, and underscores"),
    description: Joi.string().required(),
    discountType: Joi.string().valid(DISCOUNTTYPE.PERCENTAGE, DISCOUNTTYPE.FIXED).required(),
    discountValue: Joi.number().positive().required(),
    minimumOrderAmount: Joi.number().positive().required(),
    maximumDiscount: Joi.number().positive().required(),
    usageLimit: Joi.number().positive().required(),
    startDate: Joi.date().required(),
    expiryDate: Joi.date().required(),
    isActive: Joi.boolean().required(),
});

export const updateCouponSchema = Joi.object({
    id: Joi.string().required(),
    code: Joi.string().regex(/^[A-Z0-9\-_ ]+$/).message("Coupon code must contain only uppercase letters, numbers, spaces, hyphens, and underscores"),
    description: Joi.string(),
    discountType: Joi.string().valid(DISCOUNTTYPE.PERCENTAGE, DISCOUNTTYPE.FIXED),
    discountValue: Joi.number().positive(),
    minimumOrderAmount: Joi.number().positive(),
    maximumDiscount: Joi.number().positive(),
    usageLimit: Joi.number().positive(),
    startDate: Joi.date(),
    expiryDate: Joi.date(),
    isActive: Joi.boolean(),
});

export const deleteCouponSchema = Joi.object({
    id: Joi.string().required(),
});

export const toggleCouponSchema = Joi.object({
    id: Joi.string().required(),
});

export const filterCouponSchema = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    sort: Joi.string().optional(),
    search: Joi.string().optional(),
});