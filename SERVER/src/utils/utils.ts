import { createOne, getFirstMatch, updateData } from "../helpers";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
import crypto from 'crypto';
import { Types } from "mongoose";
import slugify from "slugify";
import { userModel, TShirtModel, Counter, walletTransactionModel } from "../models";

import { env } from "../config";
import cloudinary from "../config/cloudinary";
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

export const getDateForSalesQuery = () => {
    const now = new Date();
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + IST_OFFSET_MS);
    const istDateStr = istTime.toISOString().split('T')[0];
    return new Date(istDateStr + 'T00:00:00.000Z');
};

export const getUniqueOtp = async () => {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        const otp = generateOtp();
        const isAlreadyAssign = await getFirstMatch(userModel, { otp }, {}, {});

        if (!isAlreadyAssign) return otp;
        attempts++;
    }

    throw new Error("Failed To Generate Otp");
};

export const getOtpExpireTime = () => {
    return new Date(Date.now() + 2 * 60 * 1000);
};

export const generateHash = async (password = "") => {
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);
    return hashPassword;
};

export const compareHash = async (password = "", hash = "") => {
    return await bcryptjs.compare(password, hash);
};

export const generateToken = async (data: any = {}, expiresIn: any = '24h') => {
    const options = typeof expiresIn === 'string' ? { expiresIn } : expiresIn;
    const payload = data && typeof data.toObject === 'function' ? data.toObject() : data;
    const cleanPayload = JSON.parse(JSON.stringify(payload));

    const token = jwt.sign(cleanPayload, env.JWT_TOKEN_SECRET!, options);
    return token;
};

export const isValidObjectId = (id: any) => {
    return Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
};


export const parseDateRange = (start?: any, end?: any) => {
    if (!start || !end) return null;

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null;

    return { startDate, endDate };
};

export const resolvePagination = (page?: any, limit?: any, totalCount?: number) => {
    const parsedLimit = Number(limit);
    const hasLimit = Number.isFinite(parsedLimit) && parsedLimit > 0;
    const limitValue = hasLimit ? Math.floor(parsedLimit) : 0;

    const parsedPage = Number(page);
    const pageValue = hasLimit ? Math.max(Math.floor(parsedPage || 1), 1) : 1;
    const skip = hasLimit ? (pageValue - 1) * limitValue : 0;
    const hasNext = (totalCount !== undefined && limitValue > 0) ? pageValue < (totalCount / limitValue) : false;
    const hasPrev = pageValue > 1;

    return { page: pageValue, limit: limitValue, skip, hasLimit, hasNext, hasPrev };
};

export const getPaginationState = (totalCount: number, pageValue: number, limitValue: number) => {
    const pageLimit = limitValue > 0 ? Math.ceil(totalCount / limitValue) || 1 : 1;

    return {
        page: pageValue,
        limit: limitValue > 0 ? limitValue : totalCount,
        page_limit: pageLimit,
    };
};

export const resolveSortAndFilter = (value: any, searchFields: string[] = ['name']) => {
    let { activeFilter, page, limit, startDateFilter, endDateFilter, search, sortFilter } = value;
    let criteria: any = { isDeleted: false }, options: any = { lean: true };

    if (search) {
        if (searchFields.length === 1) {
            criteria[searchFields[0]!] = { $regex: search, $options: 'si' };
        } else {
            criteria.$or = searchFields.map(field => ({ [field]: { $regex: search, $options: 'si' } }));
        }
    }

    if (activeFilter === true) criteria.isActive = true;
    else if (activeFilter === false) criteria.isActive = false;

    if (startDateFilter && endDateFilter) {
        criteria.createdAt = { $gte: new Date(startDateFilter), $lte: new Date(endDateFilter) };
    }

    if (sortFilter === "nameAsc") options.sort = { [searchFields[0] || 'name']: 1 };
    else if (sortFilter === "nameDesc") options.sort = { [searchFields[0] || 'name']: -1 };
    else if (sortFilter === "newest") options.sort = { createdAt: -1 };
    else if (sortFilter === "oldest") options.sort = { createdAt: 1 };
    else options.sort = { createdAt: -1 }; // Default sort

    const { skip, limit: limitValue, hasLimit } = resolvePagination(page, limit);
    if (hasLimit) {
        options.skip = skip;
        options.limit = limitValue;
    }

    return { criteria, options, page: page || 1, limit: limitValue };
};

export const verifyToken = (authorization?: string) => {
    if (!authorization) return null;
    const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : authorization;
    if (!token) return null;
    return jwt.verify(token, env.JWT_TOKEN_SECRET as string) as any;
};

export const createUserService = async () => {
    let apiKey = crypto.randomBytes(16).toString('hex');
    let secretKey = crypto.randomBytes(32).toString('hex');
    return { apiKey, secretKey };
};

export const generateOrderId = (prefix: string = "ORD"): string => {
    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);

    return `${prefix}-${timestamp}-${random}`;
};

export const validateSlug = async (slug: string, model: any) => {
    let baseSlug = slug.toLowerCase().replace(/\s+/g, '-');
    let finalSlug = baseSlug;
    let attempt = 1;

    let existing = await getFirstMatch(model, { slug: finalSlug, isDeleted: false });
    while (existing) {
        finalSlug = `${baseSlug}-${attempt}`;
        attempt++;
        existing = await getFirstMatch(model, { slug: finalSlug, isDeleted: false });
    }

    return finalSlug;
}

export const generateUniqueSlug = async (title: string, model: any) => {
    let baseSlug = slugify(title, {
        lower: true,
        strict: true,
        trim: true,
    });

    let slug: string = baseSlug;
    let counter = 1;

    while (await getFirstMatch(model, { slug: slug, isDeleted: false })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
};

export const generateOrderNumber = async (): Promise<string> => {
    const counter = await Counter.findOneAndUpdate(
        { name: "order" },
        { $inc: { sequence: 1 } },
        {
            new: true,
            upsert: true,
        }
    );

    return `ORD-${counter.sequence}`;
};

export const getCloudinaryPublicId = (url: string): string | null => {
    const parts = url.split('/');
    const filenameWithExt = parts.pop();
    const folder = parts.pop();
    if (!folder || !filenameWithExt) return null;
    return `${folder}/${filenameWithExt.split('.')[0]}`;
};

export const deleteUploadedFiles = async (files: any) => {
    if (!files) return;

    if (typeof files === "string") {
        const publicId = files.startsWith("http") ? getCloudinaryPublicId(files) : files;
        if (publicId) await cloudinary.uploader.destroy(publicId);
        return;
    }

    const uploadedFiles: any[] = [];
    if (Array.isArray(files)) {
        uploadedFiles.push(...files);
    } else {
        Object.values(files).forEach((val: any) => {
            if (Array.isArray(val)) uploadedFiles.push(...val);
        });
    }

    await Promise.all(uploadedFiles.map(async (file: any) => {
        if (file && file.path) {
            const publicId = getCloudinaryPublicId(file.path);
            if (publicId) await cloudinary.uploader.destroy(publicId);
        } else if (typeof file === "string") {
            const publicId = file.startsWith("http") ? getCloudinaryPublicId(file) : file;
            if (publicId) await cloudinary.uploader.destroy(publicId);
        }
    }));
};

export const applySales = (products: any, sales: any) => {
    const isArray = Array.isArray(products);
    const productList = isArray ? products : [products];

    const result = productList.map((product: any) => {
        const prodObj = product.toObject ? product.toObject() : product;
        if (!sales) return prodObj;

        let Discount = prodObj.discountPrice && prodObj.discountPrice < prodObj.basePrice ? prodObj.basePrice - prodObj.discountPrice : 0;
        let finalPrice = prodObj.basePrice;
        let matched = false;

        if (sales.target === "all") {
            matched = true;
        } else if (
            sales.target === "category" &&
            sales.targetIds.map(String).includes(String(prodObj.category?._id || prodObj.category))
        ) {
            matched = true;
        } else if (
            sales.target === "product" &&
            sales.targetIds.map(String).includes(String(prodObj._id))
        ) {
            matched = true;
        }

        if (!matched) return prodObj;

        if (sales.discountType === "percentage") {
            let camDiscount = (finalPrice * sales.discountValue / 100);
            if (Discount && Discount > camDiscount) {
                finalPrice = finalPrice - Discount;
            } else {
                finalPrice = finalPrice - camDiscount;
            }
        } else if (sales.discountType === "fixed") {
            let camDiscount = sales.discountValue;
            if (Discount && Discount > camDiscount) {
                finalPrice = finalPrice - Discount;
            } else {
                finalPrice = finalPrice - camDiscount;
            }
        } else {
            finalPrice = finalPrice - Discount;
        }

        prodObj.discountPrice = Math.max(0, finalPrice);
        if (prodObj.basePrice > 0 && prodObj.discountPrice < prodObj.basePrice) {
            prodObj.discountPercentage = Math.round(((prodObj.basePrice - prodObj.discountPrice) / prodObj.basePrice) * 100);
        } else {
            prodObj.discountPercentage = 0;
        }
        prodObj.salesApplied = true;
        return prodObj;
    });

    return isArray ? result : result[0];
};

export const creditWallet = async ({
    userId,
    amount
}: { userId: Types.ObjectId; amount: number; }) => {
    const user = await getFirstMatch(userModel, { _id: userId, isDeleted: false });
    if (!user) return null;
    const currentBalance = Number(user.walletBalance) || 0;
    const updateWallet = await updateData(userModel, { _id: userId }, { walletBalance: currentBalance + amount, isDeleted: false }, { returnDocument: "after" });
    if (!updateWallet) return null;

    const transaction = await createOne(walletTransactionModel, {
        user: userId,
        type: "credit",
        amount,
        balanceAfter: updateWallet.walletBalance,
    });
    return transaction;
};

export const debitWallet = async ({
    userId,
    amount,
}: { userId: Types.ObjectId; amount: number; }) => {
    const user = await getFirstMatch(userModel, { _id: userId, isDeleted: false });
    const currentBalance = Number(user.walletBalance) || 0;
    if (!user || currentBalance < amount) return null;
    const updateWallet = await updateData(userModel, { _id: userId }, { walletBalance: currentBalance - amount, isDeleted: false }, { returnDocument: "after" });
    if (!updateWallet) return null;

    const transaction = await createOne(walletTransactionModel, {
        user: userId,
        type: "debit",
        amount,
        balanceAfter: updateWallet.walletBalance,
    });
    return transaction;
};