import { BannerModel, CampaignModel, FlashSalesModel, notificationModel } from "../../models";
import { createOne, updateData, getData, getFirstMatch, getDataWithSorting, countData, sendNotificationMailToSubscribers } from "../../helpers";
import { createCampaignSchema, updateCampaignSchema, deleteCampaignSchema, toggleCampaignSchema, campaignIdSchema, createFlashSalesSchema, updateFlashSalesSchema, deleteFlashSalesSchema, toggleFlashSalesSchema, createBannerSchema, updateBannerSchema, deleteBannerSchema, bannerIdSchema } from "../../validation";
import { apiResponse, responseMessage, HTTP_STATUS, isValidObjectId, FOR, NOTIFICATION_TYPE, deleteUploadedFiles } from "../../common";
import { Request, Response } from "express";


export const createCampaign = async (req: Request, res: Response) => {
    try {
        const { error, value } = createCampaignSchema.validate(req.body);
        if (error) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }
        const campaign = await getFirstMatch(CampaignModel, { name: value.name }, {}, {});
        if (campaign) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Campaign already exists", {}, {}));
        }
        const image = req.files as Express.Multer.File[];
        if (!image) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "At least one image is required", {}, {}));
        }

        const campaignData = {
            name: value.name,
            description: value.description || "",
            image: image[0]?.path || "",
            discountType: value.discountType,
            discountValue: value.discountValue,
            target: value.target,
            targetIds: value.targetIds,
            startDate: value.startDate,
            endDate: value.endDate,
            isActive: value.isActive
        }

        const result = await createOne(CampaignModel, campaignData);
        if (!result) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in campaign", {}, {}));
        }

        sendNotificationMailToSubscribers(result, 'campaign').catch(err => console.log('Campaign notification error:', err));

        return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, "Campaign created successfully", { result }, {}));
    } catch (error) {
        await deleteUploadedFiles(req.files);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateCampaign = async (req: Request, res: Response) => {
    try {
        const { error, value } = updateCampaignSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const campaign = await getFirstMatch(CampaignModel, { _id: isValidObjectId(req.params.id) }, {}, {});
        if (!campaign) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Campaign not found", {}, {}));

        const image = (req.files as Express.Multer.File[]) || [];
        if (image) {
            if (campaign.image) {
                await deleteUploadedFiles([campaign.image]);
            }
            value.image = image;
        }

        const campaignData = {
            name: value.name,
            image: image && image.length > 0 ? image[0]?.path || "" : campaign.image || "",
            description: value.description || "",
            discountType: value.discountType,
            discountValue: value.discountValue,
            target: value.target,
            targetIds: value.targetIds,
            startDate: value.startDate,
            endDate: value.endDate,
            isActive: value.isActive
        }

        const result = await updateData(CampaignModel, { _id: isValidObjectId(req.params.id) }, campaignData);
        if (!result) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in campaign", {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Campaign updated successfully", { result }, {}));
    } catch (error) {
        await deleteUploadedFiles(req.files);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const deleteCampaign = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteCampaignSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const campaign = await getFirstMatch(CampaignModel, { _id: isValidObjectId(value.id) }, {}, {});
        if (!campaign) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Campaign not found", {}, {}));

        const result = await updateData(CampaignModel, { _id: isValidObjectId(value.id) }, { isDeleted: true });
        if (!result) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in campaign", {}, {}));
        await deleteUploadedFiles([campaign.image])
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Campaign deleted successfully", { result }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const toggleCampaign = async (req: Request, res: Response) => {
    try {
        const { error, value } = toggleCampaignSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const campaign = await getFirstMatch(CampaignModel, { _id: isValidObjectId(value.id) }, {}, {});
        if (!campaign) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Campaign not found", {}, {}));

        const result = await updateData(CampaignModel, { _id: isValidObjectId(value.id) }, { isActive: !campaign.isActive });
        if (!result) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in campaign", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Campaign toggled successfully", { result }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getAllCampaigns = async (req: Request, res: Response) => {
    try {
        const [campaigns, count] = await Promise.all([
            await getData(CampaignModel, { isDeleted: false }, {}, { sort: { createdAt: -1 } }),
            await countData(CampaignModel, { isDeleted: false })
        ]);
        const pagination = {
            total: count
        }
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Campaigns fetched successfully", { campaigns }, pagination));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getCampaign = async (req: Request, res: Response) => {
    try {
        const { error, value } = campaignIdSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const campaign = await getFirstMatch(CampaignModel, { _id: isValidObjectId(value.id) }, {}, {});
        if (!campaign) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Campaign not found", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Campaign fetched successfully", { campaign }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getUserCampaigns = async (req: Request, res: Response) => {
    try {
        const campaigns = await getDataWithSorting(CampaignModel, { isDeleted: false, isActive: true }, {}, { sort: { createdAt: -1 } });
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Campaigns fetched successfully", { campaigns }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

// for flash sales
export const createFlashSales = async (req: Request, res: Response) => {
    try {
        const { error, value } = createFlashSalesSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const image = (req.files as Express.Multer.File[]) || [];
        const flashSalesData = {
            name: value.name,
            image: image && image.length > 0 ? image[0]?.path || "" : "",
            description: value.description || "",
            discountType: value.discountType,
            discountValue: value.discountValue,
            target: value.target,
            targetIds: value.targetIds,
            startDate: value.startDate,
            endDate: value.endDate,
            isActive: value.isActive
        }

        const result = await createOne(FlashSalesModel, flashSalesData);
        if (!result) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in flash sales", {}, {}));
        }

        sendNotificationMailToSubscribers(result, 'flash_sale').catch(err => console.log('Flash sale notification error:', err));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Flash sales created successfully", { result }, {}));
    } catch (error) {
        await deleteUploadedFiles(req.files);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateFlashSales = async (req: Request, res: Response) => {
    try {
        const { error, value } = updateFlashSalesSchema.validate(req.body);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const flashSales = await getFirstMatch(FlashSalesModel, { _id: isValidObjectId(req.params.id) }, {}, {});
        if (!flashSales) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Flash sales not found", {}, {}));

        const image = (req.files as Express.Multer.File[]) || [];
        if (image) {
            if (flashSales.image) {
                await deleteUploadedFiles([flashSales.image]);
            }
            value.image = image;
        }

        const flashSalesData = {
            name: value.name,
            image: image && image.length > 0 ? image[0]?.path || "" : flashSales.image || "",
            description: value.description || "",
            discountType: value.discountType,
            discountValue: value.discountValue,
            target: value.target,
            targetIds: value.targetIds,
            startDate: value.startDate,
            endDate: value.endDate,
            isActive: value.isActive
        }

        const result = await updateData(FlashSalesModel, { _id: isValidObjectId(req.params.id) }, flashSalesData);
        if (!result) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in flash sales", {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Flash sales updated successfully", { result }, {}));
    } catch (error) {
        await deleteUploadedFiles(req.files);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const deleteFlashSales = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteFlashSalesSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const flashSales = await getFirstMatch(FlashSalesModel, { _id: isValidObjectId(value.id) }, {}, {});
        if (!flashSales) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Flash sales not found", {}, {}));

        const result = await updateData(FlashSalesModel, { _id: isValidObjectId(value.id) }, { isDeleted: true });
        if (!result) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in flash sales", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Flash sales deleted successfully", { result }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const toggleFlashSales = async (req: Request, res: Response) => {
    try {
        const { error, value } = toggleFlashSalesSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const flashSales = await getFirstMatch(FlashSalesModel, { _id: isValidObjectId(value.id) }, {}, {});
        if (!flashSales) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Flash sales not found", {}, {}));

        const result = await updateData(FlashSalesModel, { _id: isValidObjectId(value.id) }, { isActive: !flashSales.isActive });
        if (!result) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in flash sales", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Flash sales toggled successfully", { result }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getAllFlashSales = async (req: Request, res: Response) => {
    try {
        const [flashSales, count] = await Promise.all([
            await getData(FlashSalesModel, { isDeleted: false }, {}, { sort: { createdAt: -1 } }),
            await countData(FlashSalesModel, { isDeleted: false })
        ]);
        const pagination = {
            total: count
        }
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Flash sales fetched successfully", { flashSales }, pagination));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getForUserFlashSales = async (req: Request, res: Response) => {
    try {
        const [flashSales] = await Promise.all([
            await getData(FlashSalesModel, { isDeleted: false, isActive: true }, {}, { sort: { createdAt: -1 } }),
        ]);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Flash sales fetched successfully", { flashSales }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

// for banner

export const createBanner = async (req: Request, res: Response) => {
    try {
        const { error, value } = createBannerSchema.validate(req.body);
        if (error) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }

        const files = (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};
        const bannerData = {
            title: value.title,
            description: value.description,
            bgImage: files['bgImage']?.[0]?.path || ""
        }

        const result = await createOne(BannerModel, bannerData);
        if (!result) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in banner", {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Banner created successfully", { result }, {}));
    } catch (error) {
        await deleteUploadedFiles(req.files);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const updateBanner = async (req: Request, res: Response) => {
    try {
        const { error, value } = updateBannerSchema.validate({ ...req.body, ...req.params });
        if (error) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));
        }

        const banner = await getFirstMatch(BannerModel, { _id: isValidObjectId(req.params.id) }, {}, {});
        if (!banner) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Banner not found", {}, {}));
        }

        const files = (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};
        const bannerData = {
            title: value.title,
            description: value.description,
            bgImage: files['bgImage']?.[0]?.path || banner.bgImage || "",
        }

        const result = await updateData(BannerModel, { _id: isValidObjectId(req.params.id) }, bannerData);
        if (!result) {
            await deleteUploadedFiles(req.files);
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in banner", {}, {}));
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Banner updated successfully", { result }, {}));
    } catch (error) {
        await deleteUploadedFiles(req.files);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const deleteBanner = async (req: Request, res: Response) => {
    try {
        const { error, value } = deleteBannerSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const banner = await getFirstMatch(BannerModel, { _id: isValidObjectId(value.id) }, {}, {});
        if (!banner) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Banner not found", {}, {}));

        const result = await updateData(BannerModel, { _id: isValidObjectId(value.id) }, { isDeleted: true });
        if (!result) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "error in banner", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Banner deleted successfully", { result }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getBannerById = async (req: Request, res: Response) => {
    try {
        const { error, value } = bannerIdSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0]?.message || "Validation Error", {}, {}));

        const banner = await getFirstMatch(BannerModel, { _id: isValidObjectId(value.id) }, {}, {});
        if (!banner) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Banner not found", {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Banner fetched successfully", { banner }, {}));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}

export const getAllBanners = async (req: Request, res: Response) => {
    try {
        const [banners, count] = await Promise.all([
            await getData(BannerModel, { isDeleted: false }, {}, { sort: { createdAt: -1 } }),
            await countData(BannerModel, { isDeleted: false })
        ]);
        const pagination = {
            total: count
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Banners fetched successfully", { banners }, pagination));
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
    }
}