import { ContactModel } from "../../models";
import { Request, Response } from "express";
import { apiResponse, HTTP_STATUS, responseMessage, isValidObjectId } from "../../common";
import { createContactSchema, getContactSchema } from "../../validation";
import { createOne, getData, getFirstMatch, updateData } from "../../helpers";

export const createContact = async (req: Request, res: Response) => {
    try {
        const { error, value } = createContactSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const existingContact = await getFirstMatch(ContactModel, { email: value.email, isDeleted: false });
        if (existingContact) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Contact already exists", {}, {}));

        const addContact = {
            name: value.name,
            email: value.email,
            message: value.message
        }

        const contact = await createOne(ContactModel, addContact);
        if (!contact) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Error in creating contact", {}, {}));

        return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, "Contact created successfully", { contact }, {}));
    } catch (error) {
        console.log("Error in createContact:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getContact = async (req: Request, res: Response) => {
    try {
        const contact = await getData(ContactModel, {}, {}, {});
        if (!contact) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Error in getting contact", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Contact fetched successfully", { contact }, {}));
    } catch (error) {
        console.log("Error in getContact:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const deleteContact = async (req: Request, res: Response) => {
    try {
        const { error, value } = getContactSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const contact = await updateData(ContactModel, { _id: isValidObjectId(value.id) }, { isDeleted: true }, { returnDocument: "after" });
        if (!contact) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Error in deleting contact", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Contact deleted successfully", { contact }, {}));
    } catch (error) {
        console.log("Error in deleteContact:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateContact = async (req: Request, res: Response) => {
    try {
        const { error, value } = getContactSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const contact = await updateData(ContactModel, { _id: isValidObjectId(value.id) }, { isRead: true }, { returnDocument: "after" });
        if (!contact) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Error in updating contact", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Contact marked as read successfully", { contact }, {}));
    } catch (error) {
        console.log("Error in updateContact:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}