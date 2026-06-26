import { addressModel } from "../../models";
import { Request, Response } from "express";
import { responseMessage, HTTP_STATUS, apiResponse, isValidObjectId } from "../../common";
import { createAddressSchema, deleteAddressSchema, getUserSchema, setAsDefaultAddressSchema, updateAddressSchema } from "../../validation";
import { createOne, getData, getFirstMatch, updateData, updateMany } from "../../helpers";

export const createAddress = async (req: Request, res: Response) => {
    try {
        const { error, value } = createAddressSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const userId = (req as any).user?._id;
        if (!isValidObjectId(userId)) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid user id", {}, {}));

        const isAddressExists = await getFirstMatch(addressModel, { userId: isValidObjectId(userId), label: value.label, isDeleted: false });
        if (isAddressExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Change address label", {}, {}));
        }

        const createAddress = {
            userId: userId,
            label: value.label,
            addressLine1: value.addressLine1,
            addressLine2: value.addressLine2,
            city: value.city,
            state: value.state,
            pincode: value.pincode,
            country: value.country,
        }

        const address = await createOne(addressModel, createAddress);
        if (!address) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in address", {}, {}));

        return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, "Address added successfully", { address }, {}));

    } catch (error) {
        console.log("Error in createAddress:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateAddress = async (req: Request, res: Response) => {
    try {
        const { error, value } = updateAddressSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const userId = (req as any).user?._id;

        const updateAddress = {
            label: value.label,
            addressLine1: value.addressLine1,
            addressLine2: value.addressLine2,
            city: value.city,
            state: value.state,
            pincode: value.pincode,
            country: value.country,
        }

        const address = await updateData(addressModel, { _id: isValidObjectId(req.params.id) }, updateAddress, { returnDocument: "after" });
        if (!address) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in address", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Address updated successfully", { address }, {}));
    } catch (error) {
        console.log("Error in updateAddress:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteAddressSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const isAddressExists = await getFirstMatch(addressModel, { _id: isValidObjectId(value.id), isDeleted: false });
        if (!isAddressExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Address not found", {}, {}));
        }

        const address = await updateData(addressModel, { _id: isValidObjectId(value.id) }, { isDeleted: true }, { returnDocument: "after" });
        if (!address) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in address", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Address deleted successfully", { address }, {}));
    } catch (error) {
        console.log("Error in deleteAddress:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const setAsDefaultAddress = async (req: Request, res: Response) => {
    try {
        const { error, value } = setAsDefaultAddressSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const userId = (req as any).user?._id;

        const isAddressExists = await getFirstMatch(addressModel, { _id: isValidObjectId(value.id), isDeleted: false });
        if (!isAddressExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Address not found", {}, {}));
        }

        const done = await updateMany(addressModel, { userId: isValidObjectId(userId), isDeleted: false }, { isDefault: false }, {});
        if (!done) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in address", {}, {}));

        const address = await updateData(addressModel, { _id: isValidObjectId(value.id), userId: isValidObjectId(userId) }, { isDefault: true }, { returnDocument: "after" });
        if (!address) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in address", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Address set as default successfully", { address }, {}));
    } catch (error) {
        console.log("Error in setAsDefaultAddress:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const setDefaultAddress = async (req: Request, res: Response) => {
    try {
        const { error, value } = setAsDefaultAddressSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const userId = (req as any).user?._id;

        const isAddressExists = await getFirstMatch(addressModel, { _id: isValidObjectId(value.id), userId: isValidObjectId(userId), isDeleted: false });
        if (!isAddressExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Address not found", {}, {}));
        }

        const done = await updateMany(addressModel, { userId: isValidObjectId(userId), isDeleted: false }, { isDefault: false }, {});
        if (!done) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in address", {}, {}));

        const address = await updateData(addressModel, { _id: isValidObjectId(value.id), userId: isValidObjectId(userId) }, { isDefault: true }, { returnDocument: "after" });
        if (!address) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in address", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Address set as default successfully", { address }, {}));
    } catch (error) {
        console.log("Error in setDefaultAddress:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getDefaultAddress = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;
        const address = await getFirstMatch(addressModel, { userId: isValidObjectId(userId), isDeleted: false, isDefault: true });
        if (!address) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Default address not found", {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Default address fetched successfully", { address }, {}));
    } catch (error) {
        console.log("Error in getDefaultAddress:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getAllAddress = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;
        const address = await getData(addressModel, { userId: isValidObjectId(userId), isDeleted: false });
        if (!address) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Address not found", {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Address fetched successfully", { address }, {}));
    } catch (error) {
        console.log("Error in getAllAddress:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}