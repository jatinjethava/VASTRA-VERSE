import { Request, Response } from "express";
import { CampaignModel, CategoryModel, FlashSalesModel, productViewModel, TShirtModel } from "../../models";
import { isValidObjectId, apiResponse, responseMessage, HTTP_STATUS, validateSlug, generateUniqueSlug, deleteUploadedFiles, applySales, getDateForSalesQuery } from "../../common";
import { createProductSchema, updateProductSchema, deleteProductSchema, getProductByIdSchema, filterProductSchema, increaseStockSchema, viewProductSchema } from "../../validation";
import { createOne, getData, getDataWithSorting, getFirstMatch, updateData, countData } from "../../helpers";
import { v2 as cloudinary } from "cloudinary";

export const createProduct = async (req: Request, res: Response) => {
    try {

        if (typeof req.body.variants === "string") req.body.variants = JSON.parse(req.body.variants);
        if (typeof req.body.tags === "string") req.body.tags = JSON.parse(req.body.tags);
        if (typeof req.body.isFeatured === "string") req.body.isFeatured = req.body.isFeatured === "true";
        if (typeof req.body.isPublished === "string") req.body.isPublished = req.body.isPublished === "true";
        if (typeof req.body.isBestSeller === "string") req.body.isBestSeller = req.body.isBestSeller === "true";
        if (typeof req.body.isNewArrival === "string") req.body.isNewArrival = req.body.isNewArrival === "true";
        if (typeof req.body.limitedEdition === "string") req.body.limitedEdition = req.body.limitedEdition === "true";
        if (req.body.basePrice !== undefined && req.body.basePrice !== null && req.body.basePrice !== "") {
            req.body.basePrice = Number(req.body.basePrice);
        }
        if (req.body.costPrice !== undefined && req.body.costPrice !== null && req.body.costPrice !== "") {
            req.body.costPrice = Number(req.body.costPrice);
        }
        if (req.body.discountPrice !== undefined) {
            req.body.discountPrice = (req.body.discountPrice === "" || req.body.discountPrice === null || req.body.discountPrice === "null")
                ? null
                : Number(req.body.discountPrice);
        }

        if (Array.isArray(req.body.variants)) {
            req.body.variants = req.body.variants.map((variant: any) => {
                const parsedVariant: any = {
                    size: variant.size,
                    color: variant.color,
                    sku: variant.sku,
                    price: Number(variant.price),
                    stock: Number(variant.stock),
                };

                if (variant.discountPrice !== undefined && variant.discountPrice !== "" && variant.discountPrice !== null) {
                    parsedVariant.discountPrice = Number(variant.discountPrice);
                }

                return parsedVariant;
            });
        }

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

        const discountPercentage = (value.basePrice && value.discountPrice && value.discountPrice > 0 && value.discountPrice < value.basePrice)
            ? Math.round(((value.basePrice - value.discountPrice) / value.basePrice) * 100)
            : 0;

        const productData = {
            title: value.title,
            slug: slug,
            description: value.description,
            category: category._id,
            basePrice: value.basePrice,
            costPrice: value.costPrice,
            discountPrice: value.discountPrice,
            discountPercentage: discountPercentage,
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
        const targetId = req.params.id || (Array.isArray(req.body._id) ? req.body._id[0] : req.body._id);
        req.body._id = targetId;

        if (Array.isArray(req.body.category)) req.body.category = req.body.category[0];
        if (req.body.category && typeof req.body.category === "object") {
            req.body.category = req.body.category._id || req.body.category.id;
        }

        if (typeof req.body.variants === "string") req.body.variants = JSON.parse(req.body.variants);
        if (typeof req.body.tags === "string") req.body.tags = JSON.parse(req.body.tags);
        if (typeof req.body.existingImages === "string") req.body.existingImages = JSON.parse(req.body.existingImages);
        if (typeof req.body.images === "string") req.body.images = [req.body.images];
        if (typeof req.body.isFeatured === "string") req.body.isFeatured = req.body.isFeatured === "true";
        if (typeof req.body.isPublished === "string") req.body.isPublished = req.body.isPublished === "true";
        if (typeof req.body.isBestSeller === "string") req.body.isBestSeller = req.body.isBestSeller === "true";
        if (typeof req.body.isNewArrival === "string") req.body.isNewArrival = req.body.isNewArrival === "true";
        if (typeof req.body.limitedEdition === "string") req.body.limitedEdition = req.body.limitedEdition === "true";
        if (req.body.basePrice !== undefined && req.body.basePrice !== null && req.body.basePrice !== "") {
            req.body.basePrice = Number(req.body.basePrice);
        }
        if (req.body.costPrice !== undefined && req.body.costPrice !== null && req.body.costPrice !== "") {
            req.body.costPrice = Number(req.body.costPrice);
        }
        if (req.body.discountPrice !== undefined) {
            req.body.discountPrice = (req.body.discountPrice === "" || req.body.discountPrice === null || req.body.discountPrice === "null")
                ? null
                : Number(req.body.discountPrice);
        }

        if (Array.isArray(req.body.variants)) {
            req.body.variants = req.body.variants.map((variant: any) => {
                const parsedVariant: any = {
                    size: variant.size,
                    color: variant.color,
                    sku: variant.sku,
                    price: Number(variant.price),
                    stock: Number(variant.stock),
                };

                if (variant.discountPrice !== undefined && variant.discountPrice !== "" && variant.discountPrice !== null) {
                    parsedVariant.discountPrice = Number(variant.discountPrice);
                }

                return parsedVariant;
            });
        }

        const { error, value } = updateProductSchema.validate(req.body);
        if (error) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }

        const product = await getFirstMatch(TShirtModel, { _id: isValidObjectId(value._id), isDeleted: { $ne: true } });
        if (!product) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Product"), {}, {}));
        }

        const keptImages = value.existingImages || value.images || [];
        const newImages = req.files && (req.files as any).length > 0 ? (req.files as any).map((image: any) => image.path) : [];
        value.images = [...keptImages, ...newImages];
        delete value.existingImages;

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

        const effectiveBasePrice = value.basePrice !== undefined ? value.basePrice : product.basePrice;
        const effectiveDiscountPrice = value.discountPrice !== undefined ? value.discountPrice : product.discountPrice;

        if (effectiveBasePrice && effectiveDiscountPrice !== undefined && effectiveDiscountPrice !== null && effectiveDiscountPrice > 0 && effectiveDiscountPrice < effectiveBasePrice) {
            value.discountPercentage = Math.round(((effectiveBasePrice - effectiveDiscountPrice) / effectiveBasePrice) * 100);
        } else {
            value.discountPercentage = 0;
        }

        const { _id, ...updateFields } = value;
        const updatedProduct = await updateData(TShirtModel, { _id: isValidObjectId(_id) }, { $set: updateFields });
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

        const product = await getData(TShirtModel, { category: value.id, isDeleted: false, isPublished: true }, { title: 1, images: 1, basePrice: 1, discountPrice: 1, variants: 1, slug: 1, isFeatured: 1, isPublished: 1, category: 1, fit: 1, material: 1, gender: 1, isNewArrival: 1, isBestSeller: 1, description: 1, tags: 1, limitedEdition: 1 });
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
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const products = await getDataWithSorting(TShirtModel, {
            isDeleted: false,
        }, { title: 1, images: 1, basePrice: 1, costPrice: 1, discountPrice: 1, discountPercentage: 1, variants: 1, slug: 1, isFeatured: 1, isPublished: 1, category: 1, fit: 1, material: 1, gender: 1, isNewArrival: 1, isBestSeller: 1, description: 1, tags: 1, limitedEdition: 1, seoTitle: 1, seoDescription: 1 }, { skip, limit, sort: { createdAt: -1 } });

        if (!products) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Products"), {}, {}));

        const totalItems = await countData(TShirtModel, { isDeleted: false });
        const totalPages = Math.ceil(totalItems / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Products"), {
            products: products,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                limit,
                hasNext,
                hasPrev
            }
        }, {}));
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
        }, { title: 1, images: 1, basePrice: 1, discountPrice: 1, variants: 1, slug: 1, isFeatured: 1, isPublished: 1, category: 1, fit: 1, material: 1, gender: 1, isNewArrival: 1, isBestSeller: 1, description: 1, tags: 1, limitedEdition: 1 });
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

        const products = await getDataWithSorting(TShirtModel, query, { title: 1, images: 1, basePrice: 1, discountPrice: 1, variants: 1, slug: 1, isFeatured: 1, isPublished: 1, category: 1, fit: 1, material: 1, gender: 1, isNewArrival: 1, isBestSeller: 1, description: 1, tags: 1, limitedEdition: 1 }, { sort: { createdAt: -1 } });
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
        }, { title: 1, images: 1, basePrice: 1, discountPrice: 1, variants: 1, slug: 1, isFeatured: 1, isPublished: 1, category: 1, fit: 1, material: 1, gender: 1, isNewArrival: 1, isBestSeller: 1, description: 1, tags: 1, limitedEdition: 1 });
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