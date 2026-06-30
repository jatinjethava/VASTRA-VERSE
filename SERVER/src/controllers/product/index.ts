import { Request, Response } from "express";
import { CampaignModel, CategoryModel, FlashSalesModel, productViewModel, TShirtModel } from "../../models";
import { isValidObjectId, apiResponse, responseMessage, HTTP_STATUS, validateSlug, generateUniqueSlug, deleteUploadedFiles, applySales, getDateForSalesQuery } from "../../common";
import { createProductSchema, updateProductSchema, deleteProductSchema, getProductByIdSchema, filterProductSchema, increaseStockSchema, viewProductSchema } from "../../validation";
import { createOne, getData, getDataWithSorting, getFirstMatch, updateData } from "../../helpers";
import { v2 as cloudinary } from "cloudinary";

export const createProduct = async (req: Request, res: Response) => {
    try {

        if (typeof req.body.variants === "string") req.body.variants = JSON.parse(req.body.variants);
        if (typeof req.body.tags === "string") req.body.tags = JSON.parse(req.body.tags);

        const { error, value } = createProductSchema.validate(req.body);
        if (error) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }

        const images = req.files as Express.Multer.File[];
        if (images && images.length > 0) {
            value.images = images.map((image) => image.path);
        } else {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "At least one image is required", {}, {}));
        }

        if (!isValidObjectId(value.category)) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Category is required", {}, {}));
        }

        const category = await getFirstMatch(CategoryModel, { _id: value.category, isDeleted: false });
        if (!category) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Category not found", {}, {}));
        }

        const slug = await generateUniqueSlug(value.title, TShirtModel);
        if (!slug) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid or duplicate slug", {}, {}));
        }

        const productData = {
            title: value.title,
            slug: slug,
            description: value.description,
            category: category._id,
            basePrice: value.basePrice,
            costPrice: value.costPrice,
            discountPrice: value.discountPrice,
            gender: value.gender,
            fit: value.fit,
            material: value.material,
            images: value.images,
            variants: value.variants,
            tags: value.tags,
            isFeatured: value.isFeatured,
            isPublished: value.isPublished,
            isBestSeller: value.isBestSeller,
            isNewArrival: value.isNewArrival,
            limitedEdition: value.limitedEdition,
            seoTitle: value.seoTitle,
            seoDescription: value.seoDescription,
        };

        const product = await createOne(TShirtModel, productData);
        if (!product) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.addDataError("Product"), {}, {}));
        }

        return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, responseMessage.addDataSuccess("Product"), { product }, {}));
    } catch (error) {
        console.log("Error in createProduct:", error);
        await deleteUploadedFiles(req.files);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {

        if (typeof req.body.variants === "string") req.body.variants = JSON.parse(req.body.variants);
        if (typeof req.body.tags === "string") req.body.tags = JSON.parse(req.body.tags);
        if (typeof req.body.images === "string") req.body.images = [req.body.images];

        const { error, value } = updateProductSchema.validate(req.body);
        if (error) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }

        const product = await getFirstMatch(TShirtModel, { _id: isValidObjectId(value._id), isDeleted: false });
        if (!product) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Product"), {}, {}));
        }

        const keptImages = value.images || [];
        const newImages = req.files && (req.files as any).length > 0 ? (req.files as any).map((image: any) => image.path) : [];
        value.images = [...keptImages, ...newImages];

        if (value.images.length === 0) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "At least one image is required", {}, {}));
        }

        const imagesToDelete = product.images.filter((img: string) => !keptImages.includes(img));

        if (value.category && !isValidObjectId(value.category)) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.requiredField("Category"), {}, {}));
        }

        if (value.category) {
            const category = await getFirstMatch(CategoryModel, { _id: isValidObjectId(value.category), isDeleted: false });
            if (!category) {
                await deleteUploadedFiles(req.files);
                return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Category"), {}, {}));
            }
        }

        const updatedProduct = await updateData(TShirtModel, { _id: isValidObjectId(value._id) }, value);
        if (!updatedProduct) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Product"), {}, {}));
        }

        if (imagesToDelete.length > 0) {
            await deleteUploadedFiles(imagesToDelete);
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess("Product"), { product: updatedProduct }, {}));
    } catch (error: any) {
        console.log("Error in updateProduct:", error);
        await deleteUploadedFiles(req.files);

        if (error.code === 11000) {

            const field = Object.keys(error.keyPattern)[0];

            return res.status(409).json({
                success: false,
                message: `${field} already exists`,
            });
        }

        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteProductSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const product = await getFirstMatch(TShirtModel, { _id: isValidObjectId(value.id), isDeleted: false });
        if (!product) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Product"), {}, {}));

        if (product.images.length > 0) {
            await deleteUploadedFiles(product.images);
        }

        const updatedProduct = await updateData(TShirtModel, { _id: isValidObjectId(value.id) }, { isDeleted: true });
        if (!updatedProduct) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.deleteDataError("Product"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess("Product"), { product: updatedProduct }, {}));
    } catch (error) {
        console.log("Error in deleteProduct:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getProductByCategory = async (req: Request, res: Response) => {
    try {
        const { error, value } = getProductByIdSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const product = await getData(TShirtModel, { category: value.id, isDeleted: false, isPublished: true });
        if (!product) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Product"), {}, {}));

        const currentDate = getDateForSalesQuery();
        const campaign = await getFirstMatch(CampaignModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});
        const flashSales = await getFirstMatch(FlashSalesModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});

        const Apply = applySales(applySales(product, campaign), flashSales);
        const finalProducts = Apply;

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Product"), { product: finalProducts }, {}));
    } catch (error) {
        console.log("Error in getProductById:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await getData(TShirtModel, {
            isDeleted: false,
        });
        if (!products) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Products"), {}, {}));

        const currentDate = getDateForSalesQuery();
        const campaign = await getFirstMatch(CampaignModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});
        const flashSales = await getFirstMatch(FlashSalesModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});

        const Apply = applySales(applySales(products, campaign), flashSales);
        const finalProducts = Apply;

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Products"), { products: finalProducts }, {}));
    } catch (error) {
        console.log("Error in getProducts:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getPublishedProducts = async (req: Request, res: Response) => {
    try {
        const products = await getData(TShirtModel, {
            isPublished: true,
            isDeleted: false,
        });
        if (!products) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Products"), {}, {}));

        const currentDate = getDateForSalesQuery();
        const campaign = await getFirstMatch(CampaignModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});
        const flashSales = await getFirstMatch(FlashSalesModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});


        const Apply = applySales(applySales(products, campaign), flashSales);
        const finalProducts = Apply;

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Products"), { products: finalProducts }, {}));
    } catch (error) {
        console.log("Error in getProducts:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const filterProducts = async (req: Request, res: Response) => {
    try {
        const { value } = filterProductSchema.validate(req.query);

        let query: any = {
            isPublished: true,
            isDeleted: false,
        };

        if (value.gender) query.gender = value.gender;
        if (value.category) query.category = isValidObjectId(value.category);
        if (value.fit) query.fit = value.fit;
        if (value.material) query.material = value.material;
        if (value.minPrice !== undefined || value.maxPrice !== undefined) {
            query.basePrice = {};
            if (value.minPrice !== undefined) query.basePrice.$gte = value.minPrice;
            if (value.maxPrice !== undefined) query.basePrice.$lte = value.maxPrice;
        }
        if (value.isFeatured !== undefined) query.isFeatured = value.isFeatured;

        const products = await getDataWithSorting(TShirtModel, query, {}, { sort: { createdAt: -1 } });
        if (!products) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Products"), {}, {}));

        const currentDate = getDateForSalesQuery();
        const campaign = await getFirstMatch(CampaignModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});
        const flashSales = await getFirstMatch(FlashSalesModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});

        const Apply = applySales(applySales(products, campaign), flashSales);
        const finalProducts = Apply;

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Products"), { products: finalProducts }, {}));
    } catch (error) {
        console.log("Error in filterProducts:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const increaseStock = async (req: Request, res: Response) => {
    try {
        const { error, value } = increaseStockSchema.validate({ ...req.body, ...req.params });
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const product = await getFirstMatch(TShirtModel, { _id: isValidObjectId(value.id), isDeleted: false });
        if (!product) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Product"), {}, {}));

        const variant = product.variants.find((v: any) => v.sku === value.sku);
        if (!variant) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Variant"), {}, {}));

        const updatedProduct = await updateData(
            TShirtModel,
            {
                _id: isValidObjectId(value.id),
                isDeleted: false,
                "variants.sku": value.sku
            },
            {
                $inc: {
                    "variants.$.stock": value.stock
                }
            }
        );
        if (!updatedProduct) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Product"), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess("Product"), { product: updatedProduct }, {}));
    } catch (error) {
        console.log("Error in increaseStock:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getProductsForUser = async (req: Request, res: Response) => {
    try {
        const products = await getData(TShirtModel, {
            isDeleted: false,
        });
        if (!products) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Products"), {}, {}));

        const currentDate = getDateForSalesQuery();
        const campaign = await getFirstMatch(CampaignModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});
        const flashSales = await getFirstMatch(FlashSalesModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});

        const Apply = applySales(applySales(products, campaign), flashSales);
        const finalProducts = Apply;

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Products"), { products: finalProducts }, {}));
    } catch (error) {
        console.log("Error in getProducts:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const viewProduct = async (req: Request, res: Response) => {
    try {
        const { error, value } = viewProductSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const userId = (req as any).user?._id;

        const product = await createOne(productViewModel, { userId: userId || null, productId: isValidObjectId(value.id), viewedAt: Date.now() });
        if (!product) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Product"), {}, {}));

        const currentDate = getDateForSalesQuery();
        const campaign = await getFirstMatch(CampaignModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});
        const flashSales = await getFirstMatch(FlashSalesModel, { isActive: true, isDeleted: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }, {}, {});

        const Apply = applySales(applySales(product, campaign), flashSales);
        const finalProducts = Apply;

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Product"), { product: finalProducts }, {}));
    } catch (error) {
        console.log("Error in viewProduct:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}