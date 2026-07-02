import { Request, Response } from 'express';
import { notificationModel, userModel, TShirtModel, loginActivityModel, sessionModel, orderModel, CampaignModel, FlashSalesModel, subscribeModel } from "../../models";
import { apiResponse, responseMessage, isValidObjectId, USER_ROLE, HTTP_STATUS, getUniqueOtp, getOtpExpireTime, generateHash, generateToken, compareHash, FOR, NOTIFICATION_TYPE, deleteUploadedFiles, applySales, getDateForSalesQuery } from "../../common";
import { changePasswordSchema, getUserSchema, loginUserSchema, registerUserSchema, resendOTPSchema, updateUserSchema, verifyEmailSchema } from "../../validation";
import { createOne, getFirstMatch, updateData, email_verification_mail, confirmAccount, getData, updateMany, getDataWithSorting } from "../../helpers";
import { OAuth2Client } from "google-auth-library";
import { env } from "../../config";
import { UAParser } from "ua-parser-js";

const oauth2Client = new OAuth2Client(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET
);

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { error, value } = registerUserSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const isEmailExists = await getFirstMatch(userModel, { $or: [{ email: value.email }, { mobileNumber: value.mobileNumber }], isDeleted: false });
        if (isEmailExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.dataAlreadyExist("User") + " with email " + value.email + " or mobile number " + value.mobileNumber + " , please try again later.", {}, {}));
        }

        value.password = await generateHash(value.password);

        const user = await createOne(userModel, value);
        if (!user) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.addDataError("User"), {}, {}));

        const otp = await getUniqueOtp();
        const otpExpireTime = getOtpExpireTime();

        const updatedUser = await updateData(userModel, { _id: isValidObjectId(user._id) }, { otp, otpExpireTime }, { returnDocument: "after" });
        if (!updatedUser) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("User"), {}, {}));


        try {
            await email_verification_mail(user, otp);
        } catch (emailError: any) {
            console.log("==========================================");
            console.log("⚠️ EMAIL SENDING FAILED:", emailError?.message || emailError);
            console.log(`📧 User Email: ${user.email}`);
            console.log(`🔑 OTP for verification: ${otp}`);
            console.log("==========================================");
        }

        await createOne(notificationModel, {
            userId: user._id,
            for: FOR.ADMIN,
            type: NOTIFICATION_TYPE.ACCOUNT,
            title: "New User Registered",
            message: `User with name ${user.name} and email ${user.email} has been registered.`,
            actionUrl: "admin/customers"
        });

        let token = await generateToken({ _id: isValidObjectId(user._id) });

        const parser = new UAParser(req.headers["user-agent"]);
        const result = parser.getResult();

        let clientIp = (req.headers['x-forwarded-for'] || req.ip || req.socket?.remoteAddress || '').toString().split(',')[0]?.trim() || '';
        if (clientIp.includes('::ffff:')) {
            clientIp = clientIp.replace('::ffff:', '');
        }

        await createOne(sessionModel, {
            userId: isValidObjectId(user._id),
            token: token,
            device: result.device.type || "Desktop",
            browser: result.browser.name,
            os: result.os.name,
            ipAddress: clientIp,
            lastActive: new Date(),
            isActive: true
        });

        return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, responseMessage.signupSuccess, { user, token }, {}));
    } catch (error) {
        console.log("Error in registerUser:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const verifyUser = async (req: Request, res: Response) => {
    try {
        const { error, value } = verifyEmailSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const isEmailExists = await getFirstMatch(userModel, { email: value.email, isDeleted: false });
        if (!isEmailExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("User"), {}, {}));
        }

        if (isEmailExists.isEmailVerified) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.verifyAccount, {}, {}));
        }

        if (isEmailExists.otp !== value.otp) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.invalidOTP, {}, {}));
        }

        if (isEmailExists.otpExpireTime <= Date.now()) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.expireOTP, {}, {}));
        }

        const user = await updateData(userModel, { email: value.email }, { isEmailVerified: true, otp: 0, otpExpireTime: 0 }, { returnDocument: "after" });
        if (!user) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("OTP"), {}, {}));

        await confirmAccount(user);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.OTPVerified, { user }, {}));

    } catch (error) {
        console.log("Error in registerUser:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const resedOtp = async (req: Request, res: Response) => {
    try {

        const { error, value } = resendOTPSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const isEmailExists = await getFirstMatch(userModel, { email: value.email, isDeleted: false });
        if (!isEmailExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("User"), {}, {}));
        }

        if (isEmailExists.isEmailVerified) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.verifyAccount, {}, {}));
        }

        const otp = await getUniqueOtp();
        const otpExpireTime = await getOtpExpireTime();

        const updatedUser = await updateData(userModel, { email: value.email }, { otp, otpExpireTime }, { returnDocument: "after" });
        if (!updatedUser) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("OTP"), {}, {}));

        const isEmailSend = await email_verification_mail(isEmailExists, otp);
        if (!isEmailSend) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.addDataError("Email"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.otpResendSuccess, { user: updatedUser }, {}));
    } catch (error) {
        console.log("Error in resedOtp:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { error, value } = loginUserSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const isUserExists = await getFirstMatch(userModel, { email: value.email, isDeleted: false });
        if (!isUserExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("User"), {}, {}));
        }
        if (!isUserExists.isEmailVerified) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.isNotVerified("Account"), {}, {}));
        }

        const isPasswordValid = await compareHash(value.password, isUserExists.password);
        if (!isPasswordValid) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.invalidUserPassword, {}, {}));
        }

        const token = await generateToken({ _id: isValidObjectId(isUserExists._id) });

        const parser = new UAParser(req.headers["user-agent"]);
        const result = parser.getResult();

        let clientIp = (req.headers['x-forwarded-for'] || req.ip || req.socket?.remoteAddress || '').toString().split(',')[0]?.trim() || '';
        if (clientIp.includes('::ffff:')) {
            clientIp = clientIp.replace('::ffff:', '');
        }

        await createOne(loginActivityModel, {
            userId: isValidObjectId(isUserExists._id),
            device: result.device.type,
            browser: result.browser.name,
            os: result.os.name,
            ipAddress: clientIp,
            loginAt: new Date()
        });

        await createOne(sessionModel, {
            userId: isValidObjectId(isUserExists._id),
            token: token,
            device: result.device.type || "Desktop",
            browser: result.browser.name,
            os: result.os.name,
            ipAddress: clientIp,
            lastActive: new Date(),
            isActive: true
        });

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.loginSuccess, { user: isUserExists, token }, {}));
    } catch (error) {
        console.log("Error in loginUser:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const token = req.headers.authorization?.split(" ")[1];

        const isUserExists = await getFirstMatch(userModel, { _id: isValidObjectId(userId), isDeleted: false });
        if (!isUserExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("User"), {}, {}));
        }

        await updateData(sessionModel, { userId: isValidObjectId(userId), token }, { isActive: false });
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Logout Successfully", {}, {}));
    } catch (error) {
        console.log("Error in logout:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const logoutOtherDevices = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const token = req.headers.authorization?.split(" ")[1];

        const isUserExists = await getFirstMatch(userModel, { _id: isValidObjectId(userId), isDeleted: false });
        if (!isUserExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("User"), {}, {}));
        }

        await updateMany(sessionModel, { userId: isValidObjectId(userId), token: { $ne: token } }, { isActive: false });
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Other devices logged out successfully", {}, {}));
    } catch (error) {
        console.log("Error in logout:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const revokeToken = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const tokenId = req.params.tokenId;

        const isUserExists = await getFirstMatch(userModel, { _id: isValidObjectId(userId), isDeleted: false });
        if (!isUserExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("User"), {}, {}));
        }

        const isTokenExists = await getFirstMatch(sessionModel, { _id: isValidObjectId(tokenId), userId: isValidObjectId(userId) });
        if (!isTokenExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Token"), {}, {}));
        }

        await updateData(sessionModel, { _id: isValidObjectId(tokenId), userId: isValidObjectId(userId) }, { isActive: false });
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Token revoked successfully", {}, {}));
    } catch (error) {
        console.log("Error in revokeToken:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getLoginActivity = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;

        const isUserExists = await getFirstMatch(userModel, { _id: isValidObjectId(userId), isDeleted: false });
        if (!isUserExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("User"), {}, {}));
        }

        const loginActivities = await getDataWithSorting(loginActivityModel, { userId: isValidObjectId(userId) }, {}, { sort: { loginAt: -1 } });
        if (!loginActivities) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Login Activity"), {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Login Activity"), { loginActivities }, {}));
    } catch (error) {
        console.log("Error in getLoginAvctivity:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getAllSessions = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;

        const isUserExists = await getFirstMatch(userModel, { _id: isValidObjectId(userId), isDeleted: false });
        if (!isUserExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("User"), {}, {}));
        }

        const sessions = await getDataWithSorting(sessionModel, { userId: isValidObjectId(userId), isActive: true }, {}, { sort: { lastActive: -1 } });
        if (!sessions) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Session"), {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Session"), { sessions }, {}));
    } catch (error) {
        console.log("Error in getAllSessions:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        const ticket = await oauth2Client.verifyIdToken({
            idToken: token,
            audience: env.GOOGLE_CLIENT_ID as string,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid Google Token", {}, {}));
        }

        let isUserExists = await getFirstMatch(userModel, { email: payload.email, isDeleted: false });

        if (!isUserExists) {
            let userName = payload.name || payload.email.split("@")[0] || "user";
            if (userName.length < 3) userName = userName.padEnd(3, '0');

            const newUser = {
                name: userName,
                email: payload.email,
                mobileNumber: 0,
                password: await generateHash(payload.sub),
                isEmailVerified: payload.email_verified || true,
                profileImage: payload.picture || ""
            };
            isUserExists = await createOne(userModel, newUser);
            if (!isUserExists) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Failed to create user", {}, {}));
            }
        }

        const appToken = await generateToken({ _id: isValidObjectId(isUserExists._id) });

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.loginSuccess, { user: isUserExists, token: appToken }, {}));
    } catch (error: any) {
        console.log("Error in googleLogin:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, error?.message || responseMessage.internalServerError, {}, {}));
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { error, value } = changePasswordSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const isUserExists = await getFirstMatch(userModel, { email: value.email, isDeleted: false });
        if (!isUserExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("User"), {}, {}));
        }

        if (!isUserExists.isEmailVerified) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.isNotVerified("Account"), {}, {}));
        }

        const isPasswordValid = await compareHash(value.oldPassword, isUserExists.password);
        if (!isPasswordValid) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.invalidUserPassword, {}, {}));
        }

        if (value.newPassword !== value.confirmPassword) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.passwordNotMatch, {}, {}));
        }

        value.confirmPassword = await generateHash(value.confirmPassword);
        const updatedUser = await updateData(userModel, { _id: isValidObjectId(isUserExists._id) }, { password: value.confirmPassword }, { returnDocument: "after" });
        if (!updatedUser) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Password"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.passwordChangeSuccess, { user: updatedUser }, {}));
    } catch (error) {
        console.log("Error in changePassword:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {

        const userId = (req as any).user._id;
        const isUserExists = await getFirstMatch(userModel, { _id: isValidObjectId(userId), isDeleted: false });
        if (!isUserExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("User"), {}, {}));
        }
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("User"), { user: isUserExists }, {}));
    } catch (error) {
        console.log("Error in getUser:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { error, value } = updateUserSchema.validate(req.body);
        const file = (req as any).file;
        const files = (req as any).files;

        if (error) {
            if (file) await deleteUploadedFiles([file]);
            else if (files) await deleteUploadedFiles(files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }
        const userId = (req as any).user._id;

        const updatePayload: any = { ...value };
        if (file) {
            updatePayload.profileImage = file.path;
        } else if (files && files.length > 0) {
            updatePayload.profileImage = files[0].path;
        }

        const isUserExists = await getFirstMatch(userModel, { _id: isValidObjectId(userId), isDeleted: false });
        if (!isUserExists) {
            if (file) await deleteUploadedFiles([file]);
            else if (files) await deleteUploadedFiles(files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("User"), {}, {}));
        }

        const updatedUser = await updateData(userModel, { _id: isValidObjectId(userId) }, updatePayload, { returnDocument: "after" });
        if (!updatedUser) {
            if (file) await deleteUploadedFiles([file]);
            else if (files) await deleteUploadedFiles(files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Profile"), {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess("Profile"), { user: updatedUser }, {}));
    } catch (error) {
        const file = (req as any).file;
        const files = (req as any).files;
        if (file) await deleteUploadedFiles([file]);
        else if (files) await deleteUploadedFiles(files);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const RecentlyViewed = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const productId = req.params.id;

        if (!isValidObjectId(userId) || !isValidObjectId(productId)) { return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid Id", {}, {})); }

        const user = await getFirstMatch(userModel, { _id: userId, isDeleted: false });
        if (!user) { return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("User"), {}, {})); }

        const recentlyViewed = (user.recentlyViewed || []).filter((id: any) => id.toString() !== productId);
        if (recentlyViewed.length >= 8) {
            recentlyViewed.pop();
        }
        recentlyViewed.unshift(productId);

        await updateData(userModel, { _id: userId }, { recentlyViewed: recentlyViewed });
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Product added to recently viewed", {}, {}));

    } catch (error) {
        console.log("Error in RecentlyViewed:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getRecentlyViewed = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;

        if (!isValidObjectId(userId)) { return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid Id", {}, {})); }

        const user = await getFirstMatch(userModel, { _id: userId, isDeleted: false });
        if (!user) { return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("User"), {}, {})); }

        const getRecentlyViewed = await getData(TShirtModel, { _id: { $in: user.recentlyViewed }, isDeleted: false });
        if (!getRecentlyViewed) { return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Recently Viewed"), {}, {})); }

        const sortedRecentlyViewed = getRecentlyViewed.sort((a: any, b: any) => {
            const indexA = user.recentlyViewed.findIndex((id: any) => id.toString() === a._id.toString());
            const indexB = user.recentlyViewed.findIndex((id: any) => id.toString() === b._id.toString());
            return indexA - indexB;
        });

        const currentDate = getDateForSalesQuery();
        const campaign = await getFirstMatch(CampaignModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});
        const flashSales = await getFirstMatch(FlashSalesModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});

        const Apply = applySales(applySales(sortedRecentlyViewed, campaign), flashSales);
        const finalRecentlyViewed = Apply;

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Recently Viewed"), { recentlyViewed: finalRecentlyViewed }, {}));
    } catch (error) {
        console.log("Error in getRecentlyViewed:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const subscribeMail = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Please Provide Email", {}, {}));

        const isSubscribeExists = await getFirstMatch(subscribeModel, { email, isDeleted: false });
        if (isSubscribeExists) { return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Already Subscribed", {}, {})); }

        const subscribe = await createOne(subscribeModel, { email });
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Subscribed Successfully", { subscribe }, {}));
    } catch (error) {
        console.log("Error in subscribeMail:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}


// for Admin
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const isUserExists = await getData(userModel, { isDeleted: false }, {}, {});
        if (!isUserExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("User"), {}, {}));
        }
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("User"), { user: isUserExists }, {}));
    } catch (error) {
        console.log("Error in getAllUsers:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const blockUser = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        if (!id) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Please Provide User ID", {}, {}));

        const isUserExists = await getFirstMatch(userModel, { _id: isValidObjectId(id), isDeleted: false });
        if (!isUserExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("User"), {}, {}));
        }

        if (isUserExists.role === USER_ROLE.ADMIN) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "You Cannot Block The Admin", {}, {}));
        }

        if (isUserExists.isBlocked === true) {
            const unBlockedUser = await updateData(userModel, { _id: isValidObjectId(id) }, { isBlocked: false }, { returnDocument: "after" });
            if (!unBlockedUser) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("User"), {}, {}));
            return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "User Unblocked Successfully", { user: unBlockedUser }, {}));
        } else {
            const blockedUser = await updateData(userModel, { _id: isValidObjectId(id) }, { isBlocked: true }, { returnDocument: "after" });
            if (!blockedUser) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("User"), {}, {}));
            return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "User Blocked Successfully", { user: blockedUser }, {}));
        }

    } catch (error) {
        console.log("Error in getUser:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const returningCustomers = async (req: Request, res: Response) => {
    try {
        const returningCustomers = await orderModel.aggregate([
            {
                $group: {
                    _id: "$userId", totalOrders: {
                        $sum: 1
                    }
                }
            },
            {
                $match: {
                    totalOrders: {
                        $gt: 1
                    }
                }
            }
        ]);

        if (!returningCustomers) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Returning Customers"), {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Returning Customers"), { returningCustomers }, {}));
    } catch (error) {
        console.log("Error in returningCustomers:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const customerGrowth = async (req: Request, res: Response) => {
    try {
        const growth = await userModel.aggregate([
            {
                $match: {
                    createdAt: { $exists: true, $type: "date" }
                }
            },
            {
                $group: {
                    _id: {
                        month: {
                            $month: "$createdAt"
                        },
                        year: {
                            $year: "$createdAt"
                        }
                    },
                    totalUsers: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        if (!growth) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Customer Growth"), {}, {}));
        }

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const formattedGrowth = growth.map(item => ({
            month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
            users: item.totalUsers
        }));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Customer Growth"), { customerGrowth: formattedGrowth }, {}));
    } catch (error) {
        console.log("Error in customerGrowth:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}