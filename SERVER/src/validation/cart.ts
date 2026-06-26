import Joi from "joi";
import { isValidObjectId, PRODUCT_SIZE, SAVE_FOR } from "../common";

export const addToCartSchema = Joi.object({
    productId: Joi.string().required().custom(isValidObjectId).messages({
        'any.required': 'Product ID is required',
        'string.empty': 'Product ID cannot be empty',
        'string.pattern.base': 'Product ID must be a valid ObjectId',
    }),
    quantity: Joi.number().required().min(1).max(100).messages({
        'any.required': 'Quantity is required',
        'number.base': 'Quantity must be a number',
        'number.min': 'Quantity must be at least 1',
        'number.max': 'Quantity must be at most 100',
    }),
    size: Joi.string().required().trim().valid(...Object.values(PRODUCT_SIZE)).messages({
        'any.required': 'Size is required',
        'string.empty': 'Size cannot be empty',
        'any.only': 'Size must be one of: ' + Object.values(PRODUCT_SIZE).join(', '),
    }),
    color: Joi.string().required().trim().min(1).max(50).messages({
        'any.required': 'Color is required',
        'string.empty': 'Color cannot be empty',
    })
})
export const updateCartSchema = Joi.object({
    id: Joi.string().required().custom(isValidObjectId).messages({
        'any.required': 'Cart ID is required',
        'string.empty': 'Cart ID cannot be empty',
        'string.pattern.base': 'Cart ID must be a valid ObjectId',
    }),
    quantity: Joi.number().optional().min(1).max(100).messages({
        'number.base': 'Quantity must be a number',
        'number.min': 'Quantity must be at least 1',
        'number.max': 'Quantity must be at most 100',
    }),
    size: Joi.string().optional().trim().valid(...Object.values(PRODUCT_SIZE)).messages({
        'any.only': 'Size must be one of: ' + Object.values(PRODUCT_SIZE).join(', '),
    }),
    color: Joi.string().optional().trim().min(1).max(50)
})
export const deleteCartSchema = Joi.object({
    id: Joi.string().required().custom(isValidObjectId).messages({
        'any.required': 'Cart ID is required',
        'string.empty': 'Cart ID cannot be empty',
        'string.pattern.base': 'Cart ID must be a valid ObjectId',
    }),
})

export const getUserCartSchema = Joi.object({
    id: Joi.string().required().custom(isValidObjectId).messages({
        'any.required': 'User ID is required',
        'string.empty': 'User ID cannot be empty',
        'string.pattern.base': 'User ID must be a valid ObjectId',
    }),
})

export const increaseQuantitySchema = Joi.object({
    id: Joi.string().required().custom(isValidObjectId).messages({
        'any.required': 'Cart ID is required',
        'string.empty': 'Cart ID cannot be empty',
        'string.pattern.base': 'Cart ID must be a valid ObjectId',
    }),
})
export const decreaseQuantitySchema = Joi.object({
    id: Joi.string().required().custom(isValidObjectId).messages({
        'any.required': 'Cart ID is required',
        'string.empty': 'Cart ID cannot be empty',
        'string.pattern.base': 'Cart ID must be a valid ObjectId',
    }),
})

export const saveForLaterSchema = Joi.object({
    id: Joi.string().required().custom(isValidObjectId).messages({
        'any.required': 'Cart ID is required',
        'string.empty': 'Cart ID cannot be empty',
        'string.pattern.base': 'Cart ID must be a valid ObjectId',
    }),
    status: Joi.string().required().trim().valid(...Object.values(SAVE_FOR)).messages({
        'any.required': 'Status is required',
        'string.empty': 'Status cannot be empty',
        'any.only': 'Status must be one of: ' + Object.values(SAVE_FOR).join(', '),
    })
})

export const moveCartSchema = Joi.object({
    id: Joi.string().required().custom(isValidObjectId).messages({
        'any.required': 'Cart ID is required',
        'string.empty': 'Cart ID cannot be empty',
        'string.pattern.base': 'Cart ID must be a valid ObjectId',
    }),
})

export const applyCuponCodeSchema = Joi.object({
    id: Joi.string().required().custom(isValidObjectId).messages({
        'any.required': 'Cart ID is required',
        'string.empty': 'Cart ID cannot be empty',
        'string.pattern.base': 'Cart ID must be a valid ObjectId',
    }),
    code: Joi.string().required().trim().min(1).max(50).messages({
        'any.required': 'Cupon code is required'
    })
})