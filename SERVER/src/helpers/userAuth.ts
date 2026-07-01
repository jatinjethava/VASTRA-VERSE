import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { apiResponse, HTTP_STATUS, isValidObjectId, responseMessage } from '../common'
import { env } from '../config'
import { getFirstMatch } from './database_service'
import { userModel, sessionModel } from '../models';

export const userJWT = async (req: Request, res: Response, next: NextFunction) => {
    let { authorization } = req.headers;

    if (authorization) {
        try {
            const token = authorization.startsWith("Bearer ") ? (authorization.split(" ")[1] || "") : authorization;
            const decoded: any = jwt.verify(token, env.JWT_TOKEN_SECRET!);
            if (!decoded || !decoded._id) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage?.invalidToken, {}, {}));
            }

            const user = await getFirstMatch(userModel, { _id: isValidObjectId(decoded._id), isDeleted: false });

            if (!user) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage?.invalidToken, {}, {}));
            }

            if (user.isActive === false) {
                return res.status(HTTP_STATUS.FORBIDDEN).json(new apiResponse(HTTP_STATUS.FORBIDDEN, responseMessage?.accountBlock, {}, {}));
            }

            if (user.isBlocked === true) {
                return res.status(HTTP_STATUS.FORBIDDEN).json(new apiResponse(HTTP_STATUS.FORBIDDEN, "You are blocked by admin", {}, {}));
            }

            req.headers.user = decoded;
            (req as any).user = user;

            const session = await sessionModel.findOne({
                token,
                isActive: true
            });

            if (!session) {
                return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.tokenExpire || "Token has been expired!", {}, {}));
            }

            await sessionModel.findOneAndUpdate(
                {
                    _id: session._id,
                },
                {
                    lastActive: new Date()
                }
            );

            return next();
        } catch (err: any) {
            console.log("[DEBUG userJWT] CATCH:", err.name, err.message);
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
        console.log("[DEBUG userJWT] FAIL: no auth header");
        return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage?.tokenNotFound, {}, {}));
    }
}

