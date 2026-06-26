import { Request, Response } from "express";
import { apiResponse, deleteUploadedFiles, HTTP_STATUS, isValidObjectId, responseMessage } from '../../common';
import { createOne, getData, getFirstMatch, updateData } from '../../helpers';
import { HelpfulModel, LikeModel, ReviewModel, userModel } from '../../models'
import { createHelpfulSchema, createLikeSchema, createReviewSchema, updateLikeSchema, updateReviewSchema } from '../../validation'

export const createReview = async (req: Request, res: Response) => {
    try {
        const file = (req as any).file;
        const files = (req as any).files;

        const { error, value } = createReviewSchema.validate(req.body)
        if (error) {
            if (file) await deleteUploadedFiles([file]);
            else if (files) await deleteUploadedFiles(files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }

        value.userId = (req as any).user._id;

        const user = await getFirstMatch(userModel, { _id: isValidObjectId(value.userId) });
        if (!user) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "User not found", {}, {}));

        value.user = {
            name: user.name,
            email: user.email,
            phone: user.mobileNumber,
        }

        if (file) {
            value.images = [file.path];
        } else if (files && files.length > 0) {
            value.images = files.map((f: any) => f.path);
        }

        const reviewData = {
            userId: isValidObjectId(value.userId),
            productId: isValidObjectId(value.productId),
            rating: value.rating,
            title: value.title,
            comment: value.comment,
            images: value.images || [],
            user: value.user,
            recommended: value.recommended,
            isVerifiedPurchase: value.isVerifiedPurchase,
            helpfulCount: value.helpfulCount || 0,
            likes: value.likes || 0,
            reported: value.reported || false,
            adminReply: value.adminReply || "",
        }

        const review = await createOne(ReviewModel, reviewData)
        if (!review) {
            if (file) await deleteUploadedFiles([file]);
            else if (files) await deleteUploadedFiles(files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.addDataError("Review"), {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "review created successfully", { review }, {}));

    } catch (error) {
        console.log("Error in createReview:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getAllReviewById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid product ID", {}, {}));
        }

        const reviews = await getData(ReviewModel, { productId: id, isDeleted: false }, {}, {})
        if (!reviews) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Review"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "reviews fetched successfully", { reviews }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getAllReview = async (req: Request, res: Response) => {
    try {
        const reviews = await getData(ReviewModel, { isDeleted: false }, {}, {})
        if (!reviews) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Review"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "reviews fetched successfully", { reviews }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateReview = async (req: Request, res: Response) => {
    try {

        const file = (req as any).file;
        const files = (req as any).files;

        const { error, value } = updateReviewSchema.validate(req.body)
        if (error) {
            if (file) await deleteUploadedFiles([file]);
            else if (files) await deleteUploadedFiles(files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }

        if (file) {
            value.images = [file.path];
        } else if (files && files.length > 0) {
            value.images = files.map((f: any) => f.path);
        }

        const review = await updateData(ReviewModel, { _id: isValidObjectId(req.params.id) }, { $set: value }, { returnDocument: "after" })
        if (!review) {
            if (file) await deleteUploadedFiles([file]);
            else if (files) await deleteUploadedFiles(files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Review"), {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "review updated successfully", { review }, {}));
    } catch (error) {
        console.log("Error in updateReview:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const reportReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid review ID", {}, {}));
        }

        const review = await updateData(ReviewModel, { _id: isValidObjectId(id) }, { $set: { reported: true } }, { returnDocument: "after" })
        if (!review) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "report review failed", {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "review reported successfully", { review }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const Like = async (req: Request, res: Response) => {
    try {
        const { error, value } = createLikeSchema.validate(req.params)
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }

        const userId = (req as any).user?._id || undefined;
        if (!userId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "User not found", {}, {}));

        const review = await getFirstMatch(ReviewModel, { _id: isValidObjectId(value.id), isDeleted: false })
        if (!review) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Review not found", {}, {}));
        }

        const existingLike = await getFirstMatch(LikeModel, { reviewId: isValidObjectId(value.id), userId: userId })
        if (existingLike) {
            if (existingLike.isDeleted) {
                await updateData(LikeModel, { _id: existingLike._id }, { $set: { isDeleted: false } }, { returnDocument: "after" })
                await updateData(ReviewModel, { _id: isValidObjectId(value.id) }, { $inc: { likes: 1 } }, { returnDocument: "after" })
            } else {
                await updateData(LikeModel, { _id: existingLike._id }, { $set: { isDeleted: true } }, { returnDocument: "after" })
                await updateData(ReviewModel, { _id: isValidObjectId(value.id) }, { $inc: { likes: -1 } }, { returnDocument: "after" })
            }
        } else {
            await createOne(LikeModel, { userId: userId, reviewId: value.id, isDeleted: false })
            await updateData(ReviewModel, { _id: isValidObjectId(value.id) }, { $inc: { likes: 1 } }, { returnDocument: "after" })
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "liked", {}, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const helpful = async (req: Request, res: Response) => {
    try {
        const { error, value } = createHelpfulSchema.validate(req.params)
        if (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }

        const userId = (req as any).user?._id || undefined;
        if (!userId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "User not found", {}, {}));

        const review = await getFirstMatch(ReviewModel, { _id: isValidObjectId(value.id), isDeleted: false })
        if (!review) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Review not found", {}, {}));
        }

        const helpful = await getFirstMatch(HelpfulModel, { reviewId: isValidObjectId(value.id), userId: userId })
        if (helpful) {
            if (helpful.isDeleted) {
                await updateData(HelpfulModel, { _id: helpful._id }, { $set: { isDeleted: false } }, { returnDocument: "after" })
                await updateData(ReviewModel, { _id: isValidObjectId(value.id) }, { $inc: { helpfulCount: 1 } }, { returnDocument: "after" })
            } else {
                await updateData(HelpfulModel, { _id: helpful._id }, { $set: { isDeleted: true } }, { returnDocument: "after" })
                await updateData(ReviewModel, { _id: isValidObjectId(value.id) }, { $inc: { helpfulCount: -1 } }, { returnDocument: "after" })
            }
        } else {
            await createOne(HelpfulModel, { userId: userId, reviewId: value.id, isDeleted: false })
            await updateData(ReviewModel, { _id: isValidObjectId(value.id) }, { $inc: { helpfulCount: 1 } }, { returnDocument: "after" })
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "helpful", {}, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const matchLike = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id || undefined;
        if (!userId) {
            return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "likes", { likedReviewIds: [] }, {}));
        }

        const reviews = await getData(ReviewModel, { productId: isValidObjectId(req.params.id), isDeleted: false }, {}, {});
        const reviewIds = reviews.map((r: any) => r._id);

        const userLikes = await getData(LikeModel, { userId: userId, reviewId: { $in: reviewIds }, isDeleted: false }, {}, {});
        const likedReviewIds = userLikes.map((l: any) => l.reviewId.toString());

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "likes matched", { likedReviewIds }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getMyReviews = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;
        if (!userId) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "User not found", {}, {}));
        }

        const reviews = await getData(ReviewModel, { userId: isValidObjectId(userId), isDeleted: false }, {}, {});
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "My reviews fetched successfully", { reviews }, {}));

    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

// admin review 
export const getAllReviewsByAdmin = async (req: Request, res: Response) => {
    try {
        const reviews = await getData(ReviewModel, { isDeleted: false }, {}, {});
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "reviews fetched successfully by admin", { reviews }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const verifyReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid review ID", {}, {}));
        }

        const review = await updateData(ReviewModel, { _id: isValidObjectId(id) }, { $set: { isVerifiedPurchase: true } }, { returnDocument: "after" })
        if (!review) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "verify review failed", {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "review verified successfully", { review }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid review ID", {}, {}));
        }

        const review = await updateData(ReviewModel, { _id: isValidObjectId(id) }, { $set: { isDeleted: true } }, { returnDocument: "after" })
        if (!review) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "delete review failed", {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "review deleted successfully", { review }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const adminReply = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { reply } = req.body;
        if (!isValidObjectId(id)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid review ID", {}, {}));
        }
        const review = await updateData(ReviewModel, { _id: isValidObjectId(id) }, { $set: { adminReply: reply } }, { returnDocument: "after" })
        if (!review) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Failed to add reply", {}, {}));
        }
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Reply added successfully", { review }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}