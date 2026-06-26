import { TShirtModel, WishlistModel } from "../../models";
import { apiResponse, responseMessage, HTTP_STATUS } from "../../common";
import { createOne, getData, getFirstMatch, updateData } from "../../helpers";
import { Request, Response } from "express";
import { addWishlistSchema, getWishlistSchema, removeWishlistSchema } from "../../validation";

export interface CustomRequest extends Request {
    user?: any;
}

export const addToWishlist = async (req: CustomRequest, res: Response) => {
    try {
        const { error, value } = addWishlistSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const existingWishlist = await getFirstMatch(WishlistModel, { productId: value.productId, userId: req.user?._id });
        if (existingWishlist) {
            if (existingWishlist.isDeleted) {
                const wishlist = await updateData(WishlistModel, { productId: value.productId, userId: req.user?._id }, { isDeleted: false });
                if (!wishlist) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Wishlist"), {}, {}));
                return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Product added to wishlist successfully", { wishlist }, {}));
            } else {
                return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "This product is already in your wishlist", {}, {}));
            }
        }

        const wishlist = await createOne(WishlistModel, { ...value, userId: req.user?._id });
        if (!wishlist) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.addDataError("Wishlist"), {}, {}));

        return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, responseMessage.addDataSuccess("Wishlist"), { wishlist }, {}));
    } catch (error) {
        console.log("Error in addToWishlist:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const removeFromWishlist = async (req: CustomRequest, res: Response) => {
    try {
        const { error, value } = removeWishlistSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const isWishlistExists = await getFirstMatch(WishlistModel, { productId: value.productId, userId: req.user?._id });
        if (!isWishlistExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Wishlist"), {}, {}));

        const wishlist = await updateData(WishlistModel, { productId: value.productId, userId: req.user?._id }, { isDeleted: true });
        if (!wishlist) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.deleteDataError("Wishlist"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Product removed from wishlist successfully", { wishlist }, {}));
    } catch (error) {
        console.log("Error in removeFromWishlist:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getWishlistForCheck = async (req: CustomRequest, res: Response) => {
    try {
        const { error, value } = getWishlistSchema.validate(req.query);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const wishlist = await getData(WishlistModel, { userId: req.user?._id, isDeleted: false }, { _id: 0, userId: 0, __v: 0, isDeleted: 0 });
        if (!wishlist) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Wishlist"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Wishlist"), { wishlist }, {}));
    } catch (error) {
        console.log("Error in getWishlist:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getWishlistShowProducts = async (req: CustomRequest, res: Response) => {
    try {
        const wishlist = await getData(WishlistModel, { userId: req.user?._id, isDeleted: false }, { _id: 0, userId: 0, __v: 0, isDeleted: 0 });
        if (!wishlist) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Wishlist"), {}, {}));

        const product = await Promise.all(
            wishlist.map(async (item: any) => {
                const product = await getFirstMatch(TShirtModel, { _id: item.productId });
                return product;
            })
        )

        const finalProduct = product.filter((item: any) => item !== null);

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Wishlist"), { finalProduct }, {}));
    } catch (error) {
        console.log("Error in getWishlistShowProducts:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}