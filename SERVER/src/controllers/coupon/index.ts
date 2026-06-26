import { couponModel, i_coupon } from "../../models";
import { Request, Response } from "express";
import { createCouponSchema, deleteCouponSchema, filterCouponSchema, toggleCouponSchema, updateCouponSchema } from "../../validation";
import { apiResponse, HTTP_STATUS, isValidObjectId, responseMessage } from "../../common";
import { createOne, getData, getFirstMatch, updateData } from "../../helpers";

export const createCoupon = async (req: Request, res: Response) => {
    try {
        const { error, value } = createCouponSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const isCouponExists = await getFirstMatch(couponModel, { code: value.code });
        if (isCouponExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Coupon already exists", {}, {}));
        }

        const couponData = {
            code: value.code,
            description: value.description,
            discountType: value.discountType,
            discountValue: value.discountValue,
            minimumOrderAmount: value.minimumOrderAmount,
            maximumDiscount: value.maximumDiscount,
            usageLimit: value.usageLimit,
            usedCount: 0,
            startDate: value.startDate,
            expiryDate: value.expiryDate,
            isActive: value.isActive
        }

        const coupon = await createOne(couponModel, couponData);
        if (!coupon) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in coupon", {}, {}));

        return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, "Coupon created successfully", { coupon }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateCoupon = async (req: Request, res: Response) => {
    try {
        const { error, value } = updateCouponSchema.validate({ ...req.body, id: req.params.id });
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const isCouponExists = await getFirstMatch(couponModel, { code: value.code, _id: { $ne: isValidObjectId(req.params.id) } });
        if (isCouponExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Coupon already exists with this code", {}, {}));
        }

        const couponData = {
            code: value.code,
            description: value.description,
            discountType: value.discountType,
            discountValue: value.discountValue,
            minimumOrderAmount: value.minimumOrderAmount,
            maximumDiscount: value.maximumDiscount,
            usageLimit: value.usageLimit,
            usedCount: 0,
            startDate: value.startDate,
            expiryDate: value.expiryDate,
            isActive: value.isActive
        }

        const coupon = await updateData(couponModel, { _id: isValidObjectId(req.params.id) }, couponData, { returnDocument: "after" });
        if (!coupon) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in coupon", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Coupon updated successfully", { coupon }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const deleteCoupon = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteCouponSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const isCouponExists = await getFirstMatch(couponModel, { _id: isValidObjectId(value.id) });
        if (!isCouponExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Coupon not found", {}, {}));
        }

        const coupon = await updateData(couponModel, { _id: isValidObjectId(value.id) }, { isDeleted: true }, { returnDocument: "after" });
        if (!coupon) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in coupon", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Coupon deleted successfully", { coupon }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const toggleActive = async (req: Request, res: Response) => {
    try {
        const { error, value } = toggleCouponSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const isCouponExists = await getFirstMatch(couponModel, { _id: isValidObjectId(value.id) });
        if (!isCouponExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Coupon not found", {}, {}));
        }

        const coupon = await updateData(couponModel, { _id: isValidObjectId(value.id) }, { isActive: !isCouponExists.isActive }, { returnDocument: "after" });
        if (!coupon) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in coupon", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Coupon toggled successfully", { coupon }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const filterCoupons = async (req: Request, res: Response) => {
    try {
        const coupons = await getData(couponModel, { isDeleted: false }, {}, { sort: { createdAt: -1 } });
        if (!coupons) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in coupon", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Coupon fetch successfully", { coupons }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const userCoupon = async (req: Request, res: Response) => {
    try {
        const coupons = await getData(couponModel, { isDeleted: false, isActive: true }, {}, { sort: { createdAt: -1 } });
        if (!coupons) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in coupon", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Coupon fetch successfully", { coupons }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}