import joi from "joi";
import { DISCOUNTTYPE } from "../common";
import { TARGETTYPE } from "../models";

export const createCampaignSchema = joi.object({
    name: joi.string().required(),
    description: joi.string().allow('').optional(),
    discountType: joi.string().valid(...Object.values(DISCOUNTTYPE)).required(),
    discountValue: joi.number().required(),
    target: joi.string().valid(...Object.values(TARGETTYPE)).required(),
    targetIds: joi.alternatives().try(
        joi.string(),
        joi.array().items(joi.string())
    ).optional(),
    startDate: joi.date().required(),
    endDate: joi.date().required(),
    isActive: joi.boolean().required()
});

export const updateCampaignSchema = joi.object({
    name: joi.string().optional(),
    description: joi.string().allow('').optional(),
    discountType: joi.string().valid(...Object.values(DISCOUNTTYPE)).optional(),
    discountValue: joi.number().optional(),
    target: joi.string().valid(...Object.values(TARGETTYPE)).optional(),
    targetIds: joi.alternatives().try(
        joi.string(),
        joi.array().items(joi.string())
    ).optional(),
    startDate: joi.date().optional(),
    endDate: joi.date().optional(),
    isActive: joi.boolean().optional()
});

export const deleteCampaignSchema = joi.object({
    id: joi.string().required()
});

export const toggleCampaignSchema = joi.object({
    id: joi.string().required()
});

export const campaignIdSchema = joi.object({
    id: joi.string().required()
});

// for flash sales
export const createFlashSalesSchema = joi.object({
    name: joi.string().required(),
    description: joi.string().allow('').optional(),
    discountType: joi.string().valid(...Object.values(DISCOUNTTYPE)).required(),
    discountValue: joi.number().required(),
    target: joi.string().valid(...Object.values(TARGETTYPE)).required(),
    targetIds: joi.alternatives().try(
        joi.string(),
        joi.array().items(joi.string())
    ).optional(),
    startDate: joi.date().required(),
    endDate: joi.date().required(),
    isActive: joi.boolean().required()
});

export const updateFlashSalesSchema = joi.object({
    name: joi.string().optional(),
    description: joi.string().allow('').optional(),
    discountType: joi.string().valid(...Object.values(DISCOUNTTYPE)).optional(),
    discountValue: joi.number().optional(),
    target: joi.string().valid(...Object.values(TARGETTYPE)).optional(),
    targetIds: joi.alternatives().try(
        joi.string(),
        joi.array().items(joi.string())
    ).optional(),
    startDate: joi.date().optional(),
    endDate: joi.date().optional(),
    isActive: joi.boolean().optional()
});

export const deleteFlashSalesSchema = joi.object({
    id: joi.string().required()
});

export const toggleFlashSalesSchema = joi.object({
    id: joi.string().required()
});

export const flashSalesIdSchema = joi.object({
    id: joi.string().required()
});

// for banner

export const createBannerSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
});

export const updateBannerSchema = joi.object({
    id: joi.string().required(),
    title: joi.string().optional(),
    description: joi.string().optional(),
});

export const deleteBannerSchema = joi.object({
    id: joi.string().required()
});

export const bannerIdSchema = joi.object({
    id: joi.string().required()
});