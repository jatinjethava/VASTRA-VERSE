import jwt from 'jsonwebtoken'
import { HTTP_STATUS, responseMessage, apiResponse, USER_ROLE } from '../common'
import { Request, Response, NextFunction } from 'express'
import { env } from '../config/env'

const jwt_token_secret = env.JWT_TOKEN_SECRET || "";

export const adminJWT = async (req: Request, res: Response, next: NextFunction) => {
    let { authorization } = req.headers;
    // console.log("authorization", authorization);
    if (authorization) {
        try {
            const token = authorization.startsWith("Bearer ") ? (authorization.split(" ")[1] || "") : authorization;
            const decoded = jwt.verify(token, jwt_token_secret) as any;
            // console.log(decoded);

            if (!decoded || decoded.role !== USER_ROLE.ADMIN) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage?.invalidToken, {}, {}));
            }

            req.headers.admin = decoded;
            (req as any).admin = decoded;
            return next();
        } catch (err: any) {
            if (err.name === "TokenExpiredError") {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.tokenExpire || "Token has been expired!", {}, {}));
            }
            if (err.message === "invalid signature") {
                return res.status(HTTP_STATUS.FORBIDDEN).json(new apiResponse(HTTP_STATUS.FORBIDDEN, responseMessage?.differentToken, {}, {}));
            }
            console.error(err);
            return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.invalidToken, {}, {}));
        }
    } else {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage?.tokenNotFound, {}, {}));
    }
}

