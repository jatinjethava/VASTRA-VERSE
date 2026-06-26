import { CampaignModel, CartModel, couponModel, FlashSalesModel, IVariant, TShirtModel } from "../../models"
import { addToCartSchema, applyCuponCodeSchema, decreaseQuantitySchema, deleteCartSchema, increaseQuantitySchema, moveCartSchema, saveForLaterSchema, updateCartSchema } from "../../validation"
import { Request, Response } from "express";
import { HTTP_STATUS, apiResponse, responseMessage, isValidObjectId, SAVE_FOR, DISCOUNTTYPE, applySales, getDateForSalesQuery } from "../../common";
import { createOne, getData, getFirstMatch, updateData, updateMany } from "../../helpers";

export const addToCart = async (req: Request, res: Response) => {
    try {
        const { error, value } = addToCartSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { productId, quantity = 1, size, color } = value;
        const userId = (req as any).user?._id;

        const product = await getFirstMatch(TShirtModel, { _id: isValidObjectId(productId), isDeleted: false });
        if (!product) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Product"), {}, {}));

        const isCartExists = await getFirstMatch(CartModel, { userId: isValidObjectId(userId), productId: isValidObjectId(productId), isDeleted: false });
        if (isCartExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.dataAlreadyExist("Cart"), {}, {}));

        const stock = product.variants.reduce((acc: number, item: IVariant) => item.stock > 0 ? acc + item.stock : acc, 0);
        if (stock < quantity) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, `Stock is not available only ${stock} are available`, {}, {}));

        const currentDate = getDateForSalesQuery();
        const campaign = await getFirstMatch(CampaignModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});

        const flashSales = await getFirstMatch(FlashSalesModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});

        const Apply = applySales(applySales(product, campaign), flashSales);
        const finalProducts = Apply;

        const cart = await createOne(CartModel, { userId: isValidObjectId(userId), productId: isValidObjectId(productId), items: { name: finalProducts.title, basePrice: finalProducts.basePrice, discountPrice: finalProducts.discountPrice, discountPercentage: finalProducts.discountPercentage, stock: stock, images: finalProducts.images }, quantity, size, color });
        if (!cart) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.addDataError("Cart"), {}, {}));

        return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, `Cart ` + responseMessage.addDataSuccess("Cart"), { cart }, {}));

    } catch (error) {
        console.log("Error in addToCart:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateCart = async (req: Request, res: Response) => {
    try {
        const { error, value } = updateCartSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { id, quantity, size, color } = value;
        const userId = (req as any).user?._id;

        const isCartExists = await getFirstMatch(CartModel, { userId: isValidObjectId(userId), _id: isValidObjectId(id), isDeleted: false });
        if (!isCartExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Cart"), {}, {}));

        const cart = await updateData(CartModel, { _id: isValidObjectId(id) }, { quantity, size, color });
        if (!cart) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Cart"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess("Cart"), { cart }, {}));

    } catch (error) {
        console.log("Error in updateCart:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const deleteCart = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteCartSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { id } = value;
        const userId = (req as any).user?._id;

        const isCartExists = await getFirstMatch(CartModel, { userId: isValidObjectId(userId), _id: isValidObjectId(id), isDeleted: false });
        if (!isCartExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Cart"), {}, {}));

        const cart = await updateData(CartModel, { _id: isValidObjectId(id) }, { isDeleted: true });
        if (!cart) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.deleteDataError("Cart"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, `Cart ` + responseMessage.deleteDataSuccess("Cart"), { cart }, {}));

    } catch (error) {
        console.log("Error in deleteCart:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;

        const isCartExists = await getData(CartModel, { userId: isValidObjectId(userId), status: SAVE_FOR.CART, isDeleted: false });
        if (!isCartExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Cart"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, `Cart ` + responseMessage.getDataSuccess("Cart"), { cart: isCartExists }, {}));

    } catch (error) {
        console.log("Error in getCart:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const clearCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;

        const isCartExists = await getData(CartModel, { userId: isValidObjectId(userId), status: SAVE_FOR.CART, isDeleted: false });
        if (!isCartExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Cart"), {}, {}));

        const cart = await updateMany(CartModel, { userId: isValidObjectId(userId), status: SAVE_FOR.CART }, { isDeleted: true });
        if (!cart) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.deleteDataError("Cart"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, `Cart ` + responseMessage.deleteDataSuccess("Cart"), { cart }, {}));
    } catch (error) {
        console.log("Error in clearCart:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const saveForLater = async (req: Request, res: Response) => {
    try {
        const { error, value } = moveCartSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { id } = value;
        const userId = (req as any).user?._id;

        const isCartExists = await getFirstMatch(CartModel, { userId: isValidObjectId(userId), _id: isValidObjectId(id), isDeleted: false });
        if (!isCartExists) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Cart"), {}, {}));

        const cart = await updateData(CartModel, { _id: isValidObjectId(id) }, { status: SAVE_FOR.SAVE });
        if (!cart) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Cart"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess("Cart"), { cart }, {}));
    } catch (error) {
        console.log("Error in saveCart:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getSaveCart = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id;

        const isCartExists = await getData(CartModel, { userId: isValidObjectId(userId), status: SAVE_FOR.SAVE, isDeleted: false });
        if (!isCartExists) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Cart"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, `Cart ` + responseMessage.getDataSuccess("Cart"), { cart: isCartExists }, {}));

    } catch (error) {
        console.log("Error in getSaveCart:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const moveCart = async (req: Request, res: Response) => {
    try {
        const { error, value } = moveCartSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { id } = value;
        const userId = (req as any).user?._id;

        const isCartExists = await getFirstMatch(CartModel, { userId: isValidObjectId(userId), _id: isValidObjectId(id), status: SAVE_FOR.SAVE, isDeleted: false });
        if (!isCartExists) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Cart"), {}, {}));

        const cart = await updateData(CartModel, { _id: isValidObjectId(id) }, { status: SAVE_FOR.CART });
        if (!cart) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Cart"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess("Cart"), { cart }, {}));
    } catch (error) {
        console.log("Error in moveCart:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const increaseQuantity = async (req: Request, res: Response) => {
    try {
        const { error, value } = increaseQuantitySchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { id } = value;
        const userId = (req as any).user?._id;

        const isCartExists = await getFirstMatch(CartModel, { userId: isValidObjectId(userId), _id: isValidObjectId(id), status: SAVE_FOR.CART, isDeleted: false });
        if (!isCartExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Cart"), {}, {}));

        const cart = await updateData(CartModel, { _id: isValidObjectId(id) }, { quantity: isCartExists.quantity + 1 });
        if (!cart) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Cart"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, `Cart ` + responseMessage.updateDataSuccess("Cart"), { cart }, {}));

    } catch (error) {
        console.log("Error in increaseQuantity:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const decreaseQuantity = async (req: Request, res: Response) => {
    try {
        const { error, value } = decreaseQuantitySchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { id } = value;
        const userId = (req as any).user?._id;

        const isCartExists = await getFirstMatch(CartModel, { userId: isValidObjectId(userId), _id: isValidObjectId(id), status: SAVE_FOR.CART, isDeleted: false });
        if (!isCartExists) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Cart"), {}, {}));

        const cart = await updateData(CartModel, { _id: isValidObjectId(id) }, { quantity: isCartExists.quantity - 1 });
        if (!cart) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Cart"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, `Cart ` + responseMessage.updateDataSuccess("Cart"), { cart }, {}));

    } catch (error) {
        console.log("Error in decreaseQuantity:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const applyCuponCode = async (req: Request, res: Response) => {
    try {
        const { error, value } = applyCuponCodeSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const { code } = value;
        const userId = (req as any).user?._id;

        const existCoupon = await getData(couponModel, { isActive: true, isDeleted: false }, {}, {})
        if (!existCoupon || existCoupon.length === 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Plz ! Enter valid coupon Code!", {}, {}));

        if (existCoupon.some((item: any) => item.expiryDate < new Date())) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Coupon is expired!", {}, {}));
        }

        const userCarts = await getData(CartModel, { userId: isValidObjectId(userId), status: SAVE_FOR.CART, isDeleted: false });
        if (!userCarts || userCarts.length === 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Cart"), {}, {}));

        if (userCarts.some((item: any) => item.code)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "You have already applied a coupon code!", {}, {}));
        }

        const couponCodeUpper = code.trim().toUpperCase();
        const coupons = existCoupon.find((item: any) => item.code?.trim().toUpperCase() === couponCodeUpper);
        if (!coupons) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "you applied wrong coupon!", {}, {}));
        }

        if (coupons.usageLimit != -1 && coupons.usedCount === coupons.usageLimit) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "coupon usage limit exceeded!", {}, {}));
        }

        if (coupons.usedBy.some((id: any) => id.toString() === userId.toString())) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "You have already used this coupon!", {}, {}));
        }

        if (coupons.startDate && new Date(coupons.startDate) > new Date()) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Coupon is not started yet!", {}, {}));
        }

        if (coupons.expiryDate && new Date(coupons.expiryDate) < new Date()) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Coupon is expired!", {}, {}));
        }

        if (coupons.usageLimit > 0 && coupons.usedCount >= coupons.usageLimit) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Coupon usage limit exceeded!", {}, {}));
        }

        let totalPrice = 0;
        for (const cartItem of userCarts) {
            if (cartItem.items && cartItem.items.length > 0) {
                for (const item of cartItem.items) {
                    const itemPrice = (item.discountPrice && item.discountPrice > 0) ? item.discountPrice : item.basePrice;
                    totalPrice += itemPrice * cartItem.quantity;
                }
            }
        }

        if (totalPrice < coupons.minimumOrderAmount) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, `Minimum order amount of ₹${coupons.minimumOrderAmount} is required!`, {}, {}));
        }

        let discount = 0;
        if (coupons.discountType === DISCOUNTTYPE.PERCENTAGE) {
            discount = (totalPrice * coupons.discountValue) / 100;
            if (coupons.maximumDiscount > 0 && discount > coupons.maximumDiscount) {
                discount = coupons.maximumDiscount;
            }
        } else {
            discount = coupons.discountValue;
            if (coupons.maximumDiscount > 0 && discount > coupons.maximumDiscount) {
                discount = coupons.maximumDiscount;
            }
        }

        await updateMany(CartModel, { userId: isValidObjectId(userId), status: SAVE_FOR.CART, isDeleted: false }, { code: couponCodeUpper, discountAmount: discount });

        const cart = await getFirstMatch(CartModel, { userId: isValidObjectId(userId), status: SAVE_FOR.CART, isDeleted: false });
        if (!cart) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Cart"), {}, {}));

        await updateData(couponModel, { _id: isValidObjectId(coupons._id) }, { $push: { usedBy: userId }, $inc: { usedCount: 1 } });

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "coupon applied Successfully", { cart }, {}));

    } catch (error) {
        console.log("Error in applyCuponCode:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}