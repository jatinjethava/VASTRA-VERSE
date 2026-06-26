import { FaqsModel } from "../../models";
import { Request, Response } from "express";
import { apiResponse, HTTP_STATUS, responseMessage, isValidObjectId, resolvePagination, getPaginationState, } from "../../common";
import { createFaqsSchema, deleteFaqsSchema, getFaqsSchema, toggleActiveFaqsSchema, updateFaqsSchema } from "../../validation";
import { countData, createOne, getData, getFirstMatch, updateData, updateMany } from "../../helpers";

export const createFaqs = async (req: Request, res: Response) => {
    try {
        const { error, value } = createFaqsSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const isFaqExists = await getFirstMatch(FaqsModel, { question: value.question, isDeleted: false });
        if (isFaqExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Faq already exists", {}, {}));

        const addAddress = {
            category: value.category.toLowerCase(),
            question: value.question.toLowerCase(),
            answer: value.answer.toLowerCase(),
            isPublished: value.isPublished || false,
            isActive: value.isActive || true,
        }

        const faq = await createOne(FaqsModel, addAddress);
        if (!faq) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Error in creating faq", {}, {}));

        return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, "Faq created successfully", { faq }, {}));
    } catch (error) {
        console.log("Error in createFaqs:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateFaqs = async (req: Request, res: Response) => {
    try {
        const { error, value } = updateFaqsSchema.validate({ ...req.params, ...req.body });
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const isFaqExists = await getFirstMatch(FaqsModel, { _id: isValidObjectId(value.id), isDeleted: false });
        if (!isFaqExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Faq not found", {}, {}));

        const faq = await updateData(FaqsModel, { _id: isValidObjectId(value.id) }, value, { returnDocument: "after" });
        if (!faq) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Error in updating faq", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Faq updated successfully", { faq }, {}));
    } catch (error) {
        console.log("Error in updateFaqs:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const deleteFaqs = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteFaqsSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const isFaqExists = await getFirstMatch(FaqsModel, { _id: isValidObjectId(value.id), isDeleted: false });
        if (!isFaqExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Faq not found", {}, {}));

        const faq = await updateData(FaqsModel, { _id: isValidObjectId(value.id) }, { isDeleted: true }, { returnDocument: "after" });
        if (!faq) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Error in deleting faq", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Faq deleted successfully", { faq }, {}));
    } catch (error) {
        console.log("Error in deleteFaqs:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const toggleActiveFaqs = async (req: Request, res: Response) => {
    try {
        const { error, value } = toggleActiveFaqsSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const isFaqExists = await getFirstMatch(FaqsModel, { _id: isValidObjectId(value.id), isDeleted: false });
        if (!isFaqExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Faq not found", {}, {}));

        const faq = await updateData(FaqsModel, { _id: isValidObjectId(value.id) }, { isActive: !isFaqExists.isActive }, { returnDocument: "after" });
        if (!faq) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Error in toggling active status of faq", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Faq active status toggled successfully", { faq }, {}));
    } catch (error) {
        console.log("Error in toggleActiveFaqs:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getFaqs = async (req: Request, res: Response) => {
    try {
        const { error, value } = getFaqsSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const faq = await getFirstMatch(FaqsModel, { _id: isValidObjectId(value.id), isDeleted: false });
        if (!faq) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Faq not found", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Faq fetched successfully", { faq }, {}));
    } catch (error) {
        console.log("Error in getFaqs:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getAllFaqs = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, query } = req.query;
        const faq = await getData(FaqsModel, { isDeleted: false });
        if (!faq) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Error in fetching faqs", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Faqs fetched successfully", { faq }, {}));
    } catch (error) {
        console.log("Error in getAllFaqs:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getUserFaqs = async (req: Request, res: Response) => {
    try {
        let query: any = { isDeleted: false, isActive: true, isPublished: true };
        if (req.query.category && req.query.category !== 'all') {
            query.category = req.query.category;
        }

        const totalData = await countData(FaqsModel, query);
        const pagination = resolvePagination(req.query.page, req.query.limit, totalData);
        const state = getPaginationState(totalData, pagination.page, pagination.limit);

        const faq = await getData(FaqsModel, query, {}, pagination);
        if (!faq) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Error in fetching faqs", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Faqs fetched successfully", { faq, total: totalData, ...state, ...pagination }, {}));
    } catch (error) {
        console.log("Error in getUserFaqs:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}