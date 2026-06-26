import Joi from "joi";
import { isValidObjectId, USER_ROLE } from "../common";

export const registerUserSchema = Joi.object({
    name: Joi.string().required().min(3).max(30),
    email: Joi.string().email().required(),
    mobileNumber: Joi.number().required().custom((value: number, helpers: Joi.CustomHelpers<number>) => {
        if (value.toString().length !== 10) {
            return helpers.error("number.invalid");
        }
        return value;
    }),
    password: Joi.string().required().min(6),
    confirmPassword: Joi.string().required().min(6).valid(Joi.ref("password")).messages({ 'any.only': 'Password Must Be Same As Password' }),
    role: Joi.string().valid(USER_ROLE.USER, USER_ROLE.DELIVERY_BOY, USER_ROLE.ADMIN).default(USER_ROLE.USER)
})

export const verifyEmailSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().required()
})

export const resendOTPSchema = Joi.object({
    email: Joi.string().email().required(),
})

export const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6)
})

export const changePasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    oldPassword: Joi.string().required().min(6),
    newPassword: Joi.string().required().min(6),
    confirmPassword: Joi.string().required().min(6).valid(Joi.ref("newPassword")),
})

export const getUserSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required()
})

export const updateUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    mobileNumber: Joi.number().custom((value: number, helpers: Joi.CustomHelpers<number>) => {
        if (value.toString().length !== 10) {
            return helpers.error("number.invalid");
        }
        return value;
    }).optional(),
    profileImage: Joi.string().optional(),
})