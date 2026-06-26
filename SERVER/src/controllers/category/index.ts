import { CampaignModel, CategoryModel, FlashSalesModel, TShirtModel } from "../../models";
import { apiResponse, responseMessage, HTTP_STATUS, isValidObjectId, deleteUploadedFiles, applySales, getDateForSalesQuery } from "../../common";
import { createOne, getData, getDataWithSorting, getFirstMatch, updateData } from "../../helpers";
import { createCategorySchema, deleteCategorySchema, updateCategorySchema, getCategoryByIdSchema, getCategoryBySlugSchema, getChildrenCategorySchema } from "../../validation";
import { Request, Response } from "express";

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { error, value } = createCategorySchema.validate(req.body);
        if (error) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }

        const existingCategory = await getFirstMatch(CategoryModel, { name: value.name, slug: value.slug, isDeleted: false }, {}, {});
        if (existingCategory) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.dataAlreadyExist("Category Name"), {}, {}));
        }

        if (value.parentCategory) {
            const existingParent = await getFirstMatch(CategoryModel, { _id: isValidObjectId(value.parentCategory), isDeleted: false }, {}, {});
            if (!existingParent) {
                await deleteUploadedFiles(req.files);
                return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.dataAlreadyExist("Parent Category"), {}, {}));
            }
        }

        const images = req.files as Express.Multer.File[];
        if (images && images.length > 0 && images[0]) {
            value.banner = images[0].path;
        }

        const category = await createOne(CategoryModel, value);
        if (!category) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.addDataError("Category"), {}, {}));
        }

        return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, responseMessage.addDataSuccess("Category"), { category }, {}));
    } catch (error) {
        console.log("Error in createCategory:", error);
        await deleteUploadedFiles(req.files);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error, value } = updateCategorySchema.validate(req.body);
        if (error) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }

        const existingCategory = await getFirstMatch(CategoryModel, { _id: isValidObjectId(id), isDeleted: false }, {}, {});
        if (!existingCategory) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Category"), {}, {}));
        }

        const keptBanner = value.banner || "";
        const newImages = req.files && (req.files as any).length > 0 ? (req.files as any).map((image: any) => image.path) : [];

        if (newImages.length > 0) {
            value.banner = newImages[0];
        } else {
            value.banner = keptBanner;
        }

        const imagesToDelete = existingCategory.banner && existingCategory.banner !== value.banner ? [existingCategory.banner] : [];



        if (value.parent) {
            const existingParent = await getFirstMatch(CategoryModel, { _id: isValidObjectId(value.parent), isDeleted: false }, {}, {});
            if (!existingParent) {
                await deleteUploadedFiles(req.files);
                return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.dataAlreadyExist("Parent Category"), {}, {}));
            }
        }

        const updatedCategory = await updateData(CategoryModel, { _id: isValidObjectId(id) }, { $set: value }, {});
        if (!updatedCategory) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Category"), {}, {}));
        }

        if (imagesToDelete.length > 0) {
            await deleteUploadedFiles(imagesToDelete);
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess("Category"), { updatedCategory }, {}));
    } catch (error) {
        console.log("Error in updateCategory:", error);
        await deleteUploadedFiles(req.files);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { error, value } = deleteCategorySchema.validate({ id });
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const existingCategory = await getFirstMatch(CategoryModel, { _id: isValidObjectId(id), isDeleted: false }, {}, {});
        if (!existingCategory) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Category"), {}, {}));

        if (existingCategory.banner) {
            await deleteUploadedFiles(existingCategory.banner);
        }

        const deleteCategory = await updateData(CategoryModel, { _id: isValidObjectId(id) }, { $set: { isDeleted: true } }, {});
        if (!deleteCategory) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.deleteDataError("Category"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess("Category"), { deleteCategory }, {}));
    } catch (error) {
        console.log("Error in deleteCategory:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getAllCategory = async (req: Request, res: Response) => {
    try {
        const categories = await getData(CategoryModel, { isDeleted: false });
        if (!categories || categories.length === 0) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Category"), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Category"), { categories }, {}));
    } catch (error) {
        console.log("Error in getAllCategory:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getParentCategory = async (req: Request, res: Response) => {
    try {
        const categories = await getData(CategoryModel, { parentCategory: null, isDeleted: false });
        if (!categories || categories.length === 0) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Category"), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Category"), { categories }, {}));
    } catch (error) {
        console.log("Error in getParentCategory:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const shopBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const { category, fit, maxPrice, isFeatured, isBestSeller, isNewArrival, limitedEdition } = req.query;

        const parentCategory = await getFirstMatch(CategoryModel, { parentCategory: null, slug: slug, isDeleted: false }, {}, {});
        if (!parentCategory) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Category"), {}, {}));

        const childCategories = await getData(CategoryModel, { parentCategory: parentCategory._id, isDeleted: false });
        const categoryIds = [parentCategory._id, ...childCategories.map((c: any) => c._id)];

        const query: any = {
            category: { $in: categoryIds },
            isDeleted: false,
            isPublished: true
        };

        if (category) {
            const categoryObjectId = isValidObjectId(category);
            if (categoryObjectId) {
                query.category = categoryObjectId;
            } else {
                return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Products"), { products: [] }, {}));
            }
        }

        if (fit) query.fit = fit;

        if (isFeatured) query.isFeatured = isFeatured;
        if (isBestSeller) query.isBestSeller = isBestSeller;
        if (isNewArrival) query.isNewArrival = isNewArrival;
        if (limitedEdition) query.limitedEdition = limitedEdition;

        if (maxPrice && Number(maxPrice) > 0) {
            query.discountPrice = { $lte: Number(maxPrice) };
        }

        const products = await getData(TShirtModel, query);

        const currentDate = getDateForSalesQuery();
        const campaign = await getFirstMatch(CampaignModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});
        const flashSales = await getFirstMatch(FlashSalesModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});

        const Apply = applySales(applySales(products, campaign), flashSales);
        const finalProducts = Apply;

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Products"), { products: finalProducts }, {}));
    } catch (error) {
        console.log("Error in shopBySlug:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getChildCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const childCategories = await getData(CategoryModel, { parentCategory: isValidObjectId(id), isDeleted: false });
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Category"), { childCategories }, {}));
    } catch (error) {
        console.log("Error in getChildCategory:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getChildCategoriesBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const parentCategory = await getFirstMatch(CategoryModel, { parentCategory: null, slug: slug, isDeleted: false }, {}, {});
        if (!parentCategory) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Category"), {}, {}));

        const childCategories = await getData(CategoryModel, { parentCategory: isValidObjectId(parentCategory._id), isDeleted: false });
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Category"), { childCategories }, {}));
    } catch (error) {
        console.log("Error in getChildCategoriesBySlug:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}
