import { Request, Response } from "express";
import { apiResponse, HTTP_STATUS, responseMessage, ORDER_STATUS } from '../../common';
import { orderModel, productViewModel, TShirtModel, WishlistModel } from '../../models';

export const productAnalysis = async (req: Request, res: Response) => {
    try {
        const topProducts = await orderModel.aggregate([
            { $match: { orderStatus: ORDER_STATUS.DELIVERED } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    totalSold: { $sum: { $ifNull: ["$items.quantity", 0] } },
                    revenue: { $sum: { $multiply: [{ $ifNull: ["$items.quantity", 0] }, { $ifNull: ["$items.discountPrice", 0] }] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 },
            { $lookup: { from: "tshirts", localField: "_id", foreignField: "_id", as: "product" } },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } }
        ]);

        const lowSelling = await orderModel.aggregate([
            { $match: { orderStatus: ORDER_STATUS.DELIVERED } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    totalSold: { $sum: { $ifNull: ["$items.quantity", 0] } },
                    revenue: { $sum: { $multiply: [{ $ifNull: ["$items.quantity", 0] }, { $ifNull: ["$items.discountPrice", 0] }] } }
                }
            },
            { $sort: { totalSold: 1 } },
            { $limit: 10 },
            { $lookup: { from: "tshirts", localField: "_id", foreignField: "_id", as: "product" } },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } }
        ]);

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Product Analysis"), { topProducts, lowSelling }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const productViewAnalysis = async (req: Request, res: Response) => {
    try {
        const mostViewProduct = await productViewModel.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$productId", viewCount: { $sum: 1 } } },
            { $sort: { viewCount: -1 } },
            { $limit: 10 },
            { $lookup: { from: "tshirts", localField: "_id", foreignField: "_id", as: "product" } },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } }
        ]);

        const categoryView = await productViewModel.aggregate([
            { $match: { isDeleted: false } },
            { $lookup: { from: "tshirts", localField: "productId", foreignField: "_id", as: "product" } },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
            { $group: { _id: "$product.category", viewCount: { $sum: 1 } } },
            { $sort: { viewCount: -1 } }
        ]);

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Product View Analysis"), { mostViewProduct, categoryView }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const mostWishlisted = async (req: Request, res: Response) => {
    try {
        const mostWishlisted = await WishlistModel.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$productId", wishlistCount: { $sum: 1 } } },
            { $sort: { wishlistCount: -1 } },
            { $limit: 10 },
            { $lookup: { from: "tshirts", localField: "_id", foreignField: "_id", as: "product" } },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } }
        ]);

        const categoryWishlisted = await WishlistModel.aggregate([
            { $match: { isDeleted: false } },
            { $lookup: { from: "tshirts", localField: "productId", foreignField: "_id", as: "product" } },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
            { $group: { _id: "$product.category", wishlistCount: { $sum: 1 } } },
            { $sort: { wishlistCount: -1 } }
        ]);

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Product Wishlisted"), { mostWishlisted, categoryWishlisted }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const conversionRate = async (req: Request, res: Response) => {
    try {
        const totalOrders = await orderModel.countDocuments({ isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED });
        const totalView = await productViewModel.countDocuments({ isDeleted: false });

        const rate = totalView > 0 ? ((totalOrders / totalView) * 100).toFixed(2) : 0;

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Conversion Rate"), {
            conversionRate: Number(rate),
            totalOrders,
            totalViews: totalView
        }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const categoryAnalysis = async (req: Request, res: Response) => {
    try {
        const categoryAnalysis = await orderModel.aggregate([
            { $match: { isDeleted: false, orderStatus: ORDER_STATUS.DELIVERED } },
            { $unwind: "$items" },
            { $lookup: { from: "tshirts", localField: "items.productId", foreignField: "_id", as: "product" } },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$product.category",
                    totalSold: { $sum: { $ifNull: ["$items.quantity", 0] } },
                    revenue: { $sum: { $multiply: [{ $ifNull: ["$items.quantity", 0] }, { $ifNull: ["$items.discountPrice", 0] }] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 }
        ]);

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Category Analysis"), { categoryAnalysis }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}