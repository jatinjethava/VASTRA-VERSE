import { ProductQuestionModel, TShirtModel, userModel } from "../../models";
import { askQuestionSchema, answerQuestionSchema, getQAByProductIdSchema, getQAByQuestionIdSchema, deleteQuestionSchema, deleteAnswerSchema } from "../../validation";
import { apiResponse, responseMessage, isValidObjectId, HTTP_STATUS, resolvePagination, getPaginationState } from "../../common";
import { Request, Response } from "express";
import { countData, createOne, getData, getFirstMatch, updateData } from "../../helpers";
import { QaHelpfulModel } from "../../models/qahelpful";

export const askQuestion = async (req: Request, res: Response) => {
    console.log("askQuestion req.body:", req.body);
    try {
        const { error, value } = askQuestionSchema.validate(req.body);
        if (error) {
            console.log("Validation error:", error.details[0]?.message);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }

        const { productId, question, user } = value;
        const userId = (req as any).user?._id;

        const userDetails = await getFirstMatch(userModel, { _id: isValidObjectId(userId) });
        if (!userDetails) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("User"), {}, {}));

        const isProductExists = await getFirstMatch(TShirtModel, { _id: isValidObjectId(productId), isDeleted: false });
        if (!isProductExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Product"), {}, {}));

        const isQuestionExists = await getFirstMatch(ProductQuestionModel, { question: question.toLowerCase(), isDeleted: false });
        if (isQuestionExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.dataAlreadyExist("Question"), {}, {}));

        const result = await createOne(ProductQuestionModel, {
            userId: isValidObjectId(userId),
            productId: isValidObjectId(productId),
            question: question.toLowerCase(),
            user: {
                name: userDetails.name,
                email: userDetails.email
            }
        });
        if (!result) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.addDataError("Question"), {}, {}));

        return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, responseMessage.addDataSuccess("Question"), { result }, {}));
    } catch (error) {
        console.log("Error in askQuestion:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const answerQuestion = async (req: Request, res: Response) => {
    try {
        const { error, value } = answerQuestionSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { questionId, answer } = value;

        const isQuestionExists = await getFirstMatch(ProductQuestionModel, { _id: isValidObjectId(questionId), isDeleted: false });
        if (!isQuestionExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Question"), {}, {}));

        const result = await updateData(ProductQuestionModel, { _id: isValidObjectId(questionId) }, { answer: answer, isAnswered: true });
        if (!result) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.addDataError("Answer"), {}, {}));

        return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, responseMessage.addDataSuccess("Answer"), { result }, {}));
    } catch (error) {
        console.log("Error in answerQuestion:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getQuestionsByProductId = async (req: Request, res: Response) => {
    try {
        const { error, value } = getQAByProductIdSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { productId } = value;

        const totalData = await countData(ProductQuestionModel, { isDeleted: false, productId: isValidObjectId(productId) });
        const pagination = resolvePagination(req.query.page, req.query.limit, totalData);
        const state = getPaginationState(totalData, pagination.page, pagination.limit);

        const getQA = await getData(ProductQuestionModel, { isDeleted: false, productId: isValidObjectId(productId), isAnswered: true }, {}, { sort: { createdAt: -1 }, skip: pagination.skip, limit: state.limit });
        if (!getQA) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Questions"), {}, {}));

        const userIdRaw = (req as any).user?._id;
        const validUserId = isValidObjectId(userIdRaw);
        let finalQA = getQA;
        if (validUserId) {
            finalQA = await Promise.all(getQA.map(async (q: any) => {
                const isLiked = await getFirstMatch(QaHelpfulModel, { questionId: q._id, userId: validUserId, isDeleted: false });
                const qObj = q._doc || (q.toObject ? q.toObject() : q);
                return { ...qObj, isLiked: !!isLiked };
            }));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Questions"), { data: finalQA, total: totalData, ...state, ...pagination }, {}));
    } catch (error) {
        console.log("Error in getQuestionsByProductId:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const helpFulCount = async (req: Request, res: Response) => {
    try {
        const { error, value } = getQAByQuestionIdSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { questionId } = value;
        const userId = isValidObjectId((req as any).user._id);
        if (!userId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "User not found", {}, {}));

        const isQuestionExists = await getFirstMatch(ProductQuestionModel, { _id: isValidObjectId(questionId), isDeleted: false });
        if (!isQuestionExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Question"), {}, {}));

        const isHelpFulExists = await getFirstMatch(QaHelpfulModel, { questionId: isValidObjectId(questionId), userId: userId });
        console.log("[DEBUG helpFulCount] questionId:", questionId, "userId:", userId, "isHelpFulExists:", isHelpFulExists);
        if (isHelpFulExists) {
            if (isHelpFulExists.isDeleted) {
                console.log("[DEBUG helpFulCount] was deleted, restoring to active and incrementing");
                await updateData(QaHelpfulModel, { _id: isHelpFulExists._id }, { $set: { isDeleted: false } })
                await updateData(ProductQuestionModel, { _id: isValidObjectId(questionId) }, { $inc: { helpfulCount: 1 } })
            } else {
                console.log("[DEBUG helpFulCount] was active, marking as deleted and decrementing");
                await updateData(QaHelpfulModel, { _id: isHelpFulExists._id }, { $set: { isDeleted: true } })
                await updateData(ProductQuestionModel, { _id: isValidObjectId(questionId) }, { $inc: { helpfulCount: -1 } })
            }
        } else {
            console.log("[DEBUG helpFulCount] did not exist, creating new and incrementing");
            await createOne(QaHelpfulModel, { questionId: isValidObjectId(questionId), userId: userId });
            await updateData(ProductQuestionModel, { _id: isValidObjectId(questionId) }, { $inc: { helpfulCount: 1 } });
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Helpful count updated", {}, {}));
    } catch (error) {
        console.log("Error in helpFulCount:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

// for admin
export const getAllQuestions = async (req: Request, res: Response) => {
    try {
        const result = await getData(ProductQuestionModel, { isDeleted: false }, {}, { sort: { createdAt: -1 } });
        if (!result) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Questions"), {}, {}));

        const productIds = result.map((q: any) => q.productId);
        const products = await getData(TShirtModel, { _id: { $in: productIds } }, {}, {});
        if (!products) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Products"), {}, {}));

        const resultWithProduct = result.map((q: any) => {
            const product = products.find((p: any) => p._id.toString() === q.productId.toString());
            return {
                ...q,
                product
            }
        })

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Questions"), { result: resultWithProduct }, {}));
    } catch (error) {
        console.log("Error in getAllQuestions:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const deleteQuestion = async (req: Request, res: Response) => {
    try {
        const { questionId } = req.params;
        if (!questionId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Question ID is required", {}, {}));
        const isQuestionExists = await getFirstMatch(ProductQuestionModel, { _id: isValidObjectId(questionId), isDeleted: false });
        if (!isQuestionExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Question"), {}, {}));

        const result = await updateData(ProductQuestionModel, { _id: isValidObjectId(questionId) }, { isDeleted: true });
        if (!result) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.deleteDataError("Question"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess("Question"), { result }, {}));
    } catch (error) {
        console.log("Error in deleteQuestion:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}