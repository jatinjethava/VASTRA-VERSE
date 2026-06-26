import axios from 'axios';
import { api } from '../interface/api'

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

export const getAllReviewsByAdmin = async (): Promise<ApiResponse<{
    reviews: Review[]
}>> => {
    try {
        const { data } = await api.get("/getAllReviewsByAdmin");

        if (data.success === false) {
            throw new Error(data.message || "Failed to fetch products");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch products");
        } else {
            throw error;
        }
    }
}

export const verifyReview = async (id: string): Promise<ApiResponse<{
    review: Review
}>> => {
    try {
        const { data } = await api.put(`/verifyReview/${id}`);

        if (data.success === false) {
            throw new Error(data.message || "Failed to verify review");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to verify review");
        } else {
            throw error;
        }
    }
}

export const deleteReview = async (id: string): Promise<ApiResponse<{
    review: Review
}>> => {
    try {
        const { data } = await api.put(`/deleteReview/${id}`);

        if (data.success === false) {
            throw new Error(data.message || "Failed to delete review");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete review");
        } else {
            throw error;
        }
    }
}

export const adminReply = async (id: string, reply: string): Promise<ApiResponse<{
    review: Review
}>> => {
    try {
        const { data } = await api.put(`/adminReply/${id}`, { reply });

        if (data.success === false) {
            throw new Error(data.message || "Failed to add reply");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to add reply");
        } else {
            throw error;
        }
    }
}