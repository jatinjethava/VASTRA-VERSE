import axios from "axios";
import { api } from "../interface/api";

export interface Review {
    _id: string,
    productId: string,
    userId: string,
    orderId: string,
    title: string,
    comment: string,
    rating: number,
    images: string[],
    recommended: boolean,
    isVerifiedPurchase: boolean,
    helpfulCount: number,
    likes: number,
    createdAt: Date,
    updatedAt: Date,
    [key: string]: any;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    token?: string;
    error?: string;
}

export const createReview = async (data: FormData): Promise<ApiResponse<Review>> => {
    try {
        const res = await api.post("/createReview", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to create review");
        }

        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create review");
        } else {
            throw error;
        }
    }
}

export const getallReviews = async (): Promise<Review[]> => {
    try {
        const res = await api.get(`/getAllReview`);

        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to fetch reviews");
        }

        return res.data.data.reviews || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch reviews");
        } else {
            throw error;
        }
    }
}

export const getMyReviews = async (): Promise<Review[]> => {
    try {
        const res = await api.get(`/myReviews`);

        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to fetch my reviews");
        }

        return res.data.data.reviews || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch my reviews");
        } else {
            throw error;
        }
    }
}

export const getProductAllReview = async (productId: string): Promise<Review[]> => {
    try {
        const res = await api.get(`/getAllReview/${productId}`);

        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to fetch reviews");
        }

        return res.data.data.reviews || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch reviews");
        } else {
            throw error;
        }
    }
}

export const likeReview = async (reviewId: string): Promise<ApiResponse<Review>> => {
    try {
        const res = await api.put(`/like/${reviewId}`);

        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to like review");
        }

        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to like review");
        } else {
            throw error;
        }
    }
}

export const helpfulReview = async (reviewId: string): Promise<ApiResponse<Review>> => {
    try {
        const res = await api.put(`/helpful/${reviewId}`);

        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to helpful review");
        }

        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to helpful review");
        } else {
            throw error;
        }
    }
}

export const matchLike = async (productId: string): Promise<{ likedReviewIds: string[] }> => {
    try {
        const res = await api.get(`/matchLike/${productId}`);

        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to match like");
        }

        return res.data.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to match like");
        } else {
            throw error;
        }
    }
}

export const reportReview = async (reviewId: string): Promise<ApiResponse<Review>> => {
    try {
        const res = await api.put(`/reportReview/${reviewId}`);

        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to report review");
        }

        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to report review");
        } else {
            throw error;
        }
    }
}