import joi from "joi";
import { isValidObjectId, PRODUCT_GENDER, PRODUCT_FIT, PRODUCT_SIZE } from "../common";

export const createProductSchema = joi.object({
    title: joi.string().required().trim().min(1).max(100),
    description: joi.string().required().trim().min(1).max(500),
    brand: joi.string().optional().trim().min(1).max(50),
    category: joi.string().required().trim().min(1).max(50),
    basePrice: joi.number().required().min(0),
    discountPrice: joi.number().min(0),
    gender: joi.string().required().valid(PRODUCT_GENDER.KIDS, PRODUCT_GENDER.MEN, PRODUCT_GENDER.WOMEN, PRODUCT_GENDER.UNISEX),
    fit: joi.string().required().valid(PRODUCT_FIT.REGULAR, PRODUCT_FIT.SLIM, PRODUCT_FIT.OVERSIZED),
    material: joi.string().required().trim().min(1).max(50),
    images: joi.array().items(joi.string().required()).optional().min(1),
    variants: joi.array().items(
        joi.object({
            color: joi.string().required().trim().min(1).max(50),
            size: joi.string().required().valid(PRODUCT_SIZE.XS, PRODUCT_SIZE.S, PRODUCT_SIZE.M, PRODUCT_SIZE.L, PRODUCT_SIZE.XL, PRODUCT_SIZE.XXL),
            price: joi.number().required().min(0),
            sku: joi.string().required().trim().min(1).max(50),
            discountPrice: joi.number().min(0),
            stock: joi.number().required().min(0),
        })
    ).required().min(1),
    tags: joi.array().items(joi.string().required()).optional().default([]),
    isFeatured: joi.boolean().optional().default(false),
    isPublished: joi.boolean().optional().default(false),
    isBestSeller: joi.boolean().optional().default(false),
    isNewArrival: joi.boolean().optional().default(false),
    limitedEdition: joi.boolean().optional().default(false),
    seoTitle: joi.string().optional().trim().min(1).max(200),
    seoDescription: joi.string().optional().trim().min(1).max(500),
});

export const updateProductSchema = joi.object({
    _id: joi.custom(isValidObjectId).required(),
    title: joi.string().optional().trim().min(1).max(100),
    description: joi.string().optional().trim().min(1).max(500),
    category: joi.custom(isValidObjectId).optional(),
    basePrice: joi.number().optional().min(0),
    discountPrice: joi.number().optional().min(0),
    discountPercentage: joi.number().optional().min(0).max(100),
    gender: joi.string().optional().valid(PRODUCT_GENDER.KIDS, PRODUCT_GENDER.MEN, PRODUCT_GENDER.WOMEN, PRODUCT_GENDER.UNISEX),
    fit: joi.string().optional().valid(PRODUCT_FIT.REGULAR, PRODUCT_FIT.SLIM, PRODUCT_FIT.OVERSIZED),
    material: joi.string().optional().trim().min(1).max(50),
    images: joi.array().items(joi.string().required()).optional().min(1),
    variants: joi.array().items(
        joi.object({
            color: joi.string().required().trim().min(1).max(50),
            size: joi.string().required().valid(PRODUCT_SIZE.XS, PRODUCT_SIZE.S, PRODUCT_SIZE.M, PRODUCT_SIZE.L, PRODUCT_SIZE.XL, PRODUCT_SIZE.XXL),
            price: joi.number().required().min(0),
            sku: joi.string().required().trim().min(1).max(50),
            discountPrice: joi.number().required().min(0),
            stock: joi.number().required().min(0),
        })
    ).optional().min(1),
    tags: joi.array().items(joi.string().required()).optional().default([]),
    isFeatured: joi.boolean().optional().default(false),
    isPublished: joi.boolean().optional().default(false),
    isBestSeller: joi.boolean().optional().default(false),
    isNewArrival: joi.boolean().optional().default(false),
    limitedEdition: joi.boolean().optional().default(false),
    seoTitle: joi.string().optional().trim().min(1).max(200),
    seoDescription: joi.string().optional().trim().min(1).max(500),
});

export const deleteProductSchema = joi.object({
    id: joi.custom(isValidObjectId).required(),
});

export const getProductByIdSchema = joi.object({
    id: joi.custom(isValidObjectId).required(),
});

export const searchProductSchema = joi.object({
    q: joi.string().required().trim().min(1).max(200),
});

export const filterProductSchema = joi.object({
    category: joi.custom(isValidObjectId).optional(),
    gender: joi.string().optional().valid(PRODUCT_GENDER.KIDS, PRODUCT_GENDER.MEN, PRODUCT_GENDER.WOMEN, PRODUCT_GENDER.UNISEX),
    fit: joi.string().optional().valid(PRODUCT_FIT.REGULAR, PRODUCT_FIT.SLIM, PRODUCT_FIT.OVERSIZED),
    minPrice: joi.number().optional().min(0),
    maxPrice: joi.number().optional().min(0),
    isFeatured: joi.boolean().optional(),
    isPublished: joi.boolean().optional(),
    isBestSeller: joi.boolean().optional(),
    isNewArrival: joi.boolean().optional(),
    limitedEdition: joi.boolean().optional(),
});

export const increaseStockSchema = joi.object({
    id: joi.custom(isValidObjectId).required(),
    sku: joi.string().required().trim().min(1).max(50),
    stock: joi.number().required().min(1).positive(),
});

export const viewProductSchema = joi.object({
    id: joi.custom(isValidObjectId).required()
})