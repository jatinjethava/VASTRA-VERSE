"use strict"
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: true });

        if (error) {
            const errorMessage = error.details[0]?.message.replace(/\"/g, "");
            if (errorMessage) {
                return res.status(400).json({
                    success: false,
                    error: errorMessage
                });
            }
            return res.status(400).json({
                success: false,
                error: "Invalid request data"
            });
        }
        next();
    };
};