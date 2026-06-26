import { Request, Response } from "express";
import { blogModel, notificationModel } from "../../models";
import { createBlogSchema, updateBlogSchema, updateBlogStatusSchema } from "../../validation";
import { HTTP_STATUS, apiResponse, responseMessage, isValidObjectId, BLOG_STATUS, AUTHOR_TYPE, getCloudinaryPublicId, deleteUploadedFiles, NOTIFICATION_TYPE, FOR } from "../../common";
import { createOne, getData, getFirstMatch, updateData } from "../../helpers";
import { viewBlogSchema } from "../../validation/blogview";
import { blogViewModel } from "../../models/blogView";

export const createBlog = async (req: Request, res: Response) => {
    try {
        if (req.body.content && typeof req.body.content === "string") {
            try {
                req.body.content = JSON.parse(req.body.content);
            } catch (e) {
                await deleteUploadedFiles(req.files);
                return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Content is required", {}, {}));
            }
        }
        if (req.body.seoKeywords && typeof req.body.seoKeywords === "string") {
            try {
                req.body.seoKeywords = JSON.parse(req.body.seoKeywords);
            } catch (e) {
                req.body.seoKeywords = req.body.seoKeywords.split(",").map((k: string) => k.trim());
            }
        }

        const { error, value } = createBlogSchema.validate(req.body);
        if (error) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }

        if (!value.author) value.author = AUTHOR_TYPE.ADMIN;

        const files = req.files as {
            featuredImage?: Express.Multer.File[];
            images?: Express.Multer.File[];
        };

        const featuredImage = files?.featuredImage?.[0];
        if (!featuredImage) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Featured image is required", {}, {}));
        }

        const images = files?.images;
        if (!images || images.length === 0) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "At least one image is required", {}, {}));
        }

        if (!value.content || value.content.length === 0) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Content is required", {}, {}));
        }

        const userId = (req as any).user?._id || undefined;
        if (userId) value.author = AUTHOR_TYPE.USER;

        const createBlogData = {
            userId: userId,
            author: value.author,
            title: value.title,
            description: value.description,
            subTitle: value.subTitle,
            subDescription: value.subDescription,
            content: value.content,
            featuredImage: featuredImage.path,
            images: images.map((image) => image.path),
            category: value.category,
            seoTitle: value.seoTitle,
            seoDescription: value.seoDescription,
            seoKeywords: value.seoKeywords,
            status: value.status
        };

        const blog = await createOne(blogModel, createBlogData);
        if (!blog) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.addDataError("Blog"), {}, {}));
        }

        if (userId) {
            await createOne(notificationModel, {
                userId: userId,
                for: FOR.ADMIN,
                type: NOTIFICATION_TYPE.BLOG,
                title: `User blog has been ${value.status}!`,
                message: `User blog "${value.title}" has been received successfully!`,
                actionUrl: isValidObjectId(blog._id.toString()) ? `${blog._id}` : "/admin/blogs"
            });
        }

        return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, responseMessage.addDataSuccess("Blog"), blog, {}));
    } catch (error) {
        console.log("Error in createBlog:", error);
        await deleteUploadedFiles(req.files);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateBlog = async (req: Request, res: Response) => {
    try {
        if (req.body.content && typeof req.body.content === "string") {
            try {
                req.body.content = JSON.parse(req.body.content);
            } catch (e) {
                await deleteUploadedFiles(req.files);
                return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Content is required", {}, {}));
            }
        }
        if (!req.body.images) req.body.images = [];
        else if (typeof req.body.images === "string") req.body.images = [req.body.images];

        if (req.body.seoKeywords && typeof req.body.seoKeywords === "string") {
            try {
                req.body.seoKeywords = JSON.parse(req.body.seoKeywords);
            } catch (e) {
                req.body.seoKeywords = req.body.seoKeywords.split(",").map((k: string) => k.trim());
            }
        }

        const { error, value } = updateBlogSchema.validate(req.body);
        if (error) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }

        const getBlog = await getFirstMatch(blogModel, { _id: isValidObjectId(req.params.id), isDeleted: false });
        if (!getBlog) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Blog"), {}, {}));
        }

        const files = req.files as {
            featuredImage?: Express.Multer.File[];
            images?: Express.Multer.File[];
        };

        const keptImages = value.images || [];
        const newImages = files?.images?.map((image) => image.path) || [];
        value.images = [...keptImages, ...newImages];

        const featuredImage = files?.featuredImage?.[0];
        const featuredImagePath = featuredImage ? featuredImage.path : getBlog.featuredImage;

        const updateBlogData = {
            author: value.author,
            title: value.title,
            description: value.description,
            subTitle: value.subTitle,
            subDescription: value.subDescription,
            content: value.content,
            featuredImage: featuredImagePath,
            images: value.images,
            category: value.category,
            seoTitle: value.seoTitle,
            seoDescription: value.seoDescription,
            seoKeywords: value.seoKeywords,
            status: value.status
        };

        const blog = await updateData(blogModel, { _id: isValidObjectId(req.params.id) }, updateBlogData);
        if (!blog) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Blog"), {}, {}));
        }

        const imagesToDelete = getBlog.images.filter((img: string) => !keptImages.includes(img));
        if (imagesToDelete.length > 0) {
            await Promise.all(
                imagesToDelete.map(async (img: string) => {
                    const publicId = getCloudinaryPublicId(img);
                    if (publicId) await deleteUploadedFiles(publicId);
                })
            );
        }

        if (featuredImage && getBlog.featuredImage) {
            const publicId = getCloudinaryPublicId(getBlog.featuredImage);
            if (publicId) await deleteUploadedFiles(publicId);
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess("Blog"), { blog }, {}));
    } catch (error) {
        console.log("Error in updateBlog:", error);
        await deleteUploadedFiles(req.files);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateBlogStatus = async (req: Request, res: Response) => {
    try {
        const { error, value } = updateBlogStatusSchema.validate({ ...req.params, ...req.body });
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const getBlog = await getFirstMatch(blogModel, { _id: isValidObjectId(value.id), isDeleted: false });
        if (!getBlog) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Blog"), {}, {}));

        if (value.status !== BLOG_STATUS.PUBLISHED && value.status !== BLOG_STATUS.REJECTED) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Status is not valid", {}, {}));
        }

        const blog = await updateData(blogModel, { _id: isValidObjectId(value.id), isDeleted: false }, { status: value.status });
        if (!blog) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.updateDataError("Blog"), {}, {}));
        if (value.status === BLOG_STATUS.PUBLISHED) {
            await updateData(notificationModel, { userId: isValidObjectId(getBlog.userId?.toString()) }, {
                $set: {
                    userId: isValidObjectId(getBlog.userId?.toString()),
                    for: FOR.USER,
                    type: NOTIFICATION_TYPE.BLOG,
                    title: "Your Blog has been published successfully!",
                    message: `Your blog "${getBlog.title}" has been published successfully!`,
                    actionUrl: `profile`,
                    isRead: false,
                }
            });
        }
        if (value.status === BLOG_STATUS.REJECTED) {
            await updateData(notificationModel, { userId: isValidObjectId(getBlog.userId?.toString()) }, {
                $set: {
                    userId: isValidObjectId(getBlog.userId?.toString()),
                    for: FOR.USER,
                    type: NOTIFICATION_TYPE.BLOG,
                    title: "Your Blog has been rejected",
                    message: `Your blog "${getBlog.title}" has been rejected`,
                    isRead: false,
                    actionUrl: `profile`,
                }
            });
        }
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess("Blog"), { blog }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const deleteBlog = async (req: Request, res: Response) => {
    try {
        const getBlog = await getFirstMatch(blogModel, { _id: isValidObjectId(req.params.id), isDeleted: false });
        if (!getBlog) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Blog"), {}, {}));

        const blog = await updateData(blogModel, { _id: isValidObjectId(req.params.id) }, { isDeleted: true });
        if (!blog) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.deleteDataError("Blog"), {}, {}));

        await updateData(notificationModel, { userId: isValidObjectId(getBlog.userId?.toString()) }, {
            $set: {
                userId: isValidObjectId(getBlog.userId?.toString()),
                for: FOR.USER,
                type: NOTIFICATION_TYPE.BLOG,
                title: "Your Blog has been removed from VastraVerse",
                message: `Your blog "${getBlog.title}" has been removed from VastraVerse.`,
                isRead: false,
                actionUrl: `profile`,
            }
        });

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess("Blog"), { blog }, {}));
    } catch (error) {
        console.log("Error in deleteBlog:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getAllBlogForUser = async (req: Request, res: Response) => {
    try {
        const blog = await getData(blogModel, { status: BLOG_STATUS.PUBLISHED, isDeleted: false });
        if (!blog) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Blog"), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Blog"), { blog }, {}));
    } catch (error) {
        console.log("Error in getAllBlog:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getUserBlog = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?._id || undefined;
        const blog = await getData(blogModel, { userId: userId, author: AUTHOR_TYPE.USER, isDeleted: false });
        if (!blog) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Blog"), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Blog"), { blog }, {}));
    } catch (error) {
        console.log("Error in getUserBlog:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getAllBlog = async (req: Request, res: Response) => {
    try {
        const blog = await getData(blogModel, { isDeleted: false }, {}, {});
        if (!blog) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Blog"), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Blog"), { blog }, {}));
    } catch (error) {
        console.log("Error in getAllBlog:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const viewBlog = async (req: Request, res: Response) => {
    try {
        const value = await viewBlogSchema.validateAsync(req.params);
        const userId = (req as any).user?._id || undefined;
        if (!userId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid User", {}, {}));

        const blog = await getFirstMatch(blogModel, { _id: value.id, isDeleted: false, status: BLOG_STATUS.PUBLISHED });
        if (!blog) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.getDataNotFound("Blog"), {}, {}));

        const isView = await getFirstMatch(blogViewModel, { blogId: value.id, userId: userId });
        if (!isView) {
            await createOne(blogViewModel, { blogId: value.id, userId: userId });
            await updateData(blogModel, { _id: isValidObjectId(value.id) }, { $inc: { views: 1 } });
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Blog"), { blog }, {}));
    } catch (error) {
        console.log("Error in viewBlog:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}   