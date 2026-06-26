import { env } from "../../config";
import { Request, Response } from "express";
import { adminLoginSchema, createCouponSchema } from "../../validation";
import { apiResponse, responseMessage, HTTP_STATUS, generateToken, USER_ROLE } from "../../common";

export const adminLogin = async (req: Request, res: Response) => {
    try {
        const { error, value } = adminLoginSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        if (value.email != env.ADMIN_EMAIL || value.password != env.ADMIN_PASSWORD) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.invalidCredentials("Admin"), {}, {}));
        }

        const token = await generateToken({ userEmail: env.ADMIN_EMAIL, role: USER_ROLE.ADMIN });

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.loginSuccess, { token }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}