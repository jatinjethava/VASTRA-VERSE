import type { ApiResponse } from "./notificationApi";
import axios from "axios";
import { api } from "../interface/api";

export interface Qa {
    _id: string;
    question: string;
    answer: string;
    productId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export const askQuestion = async (payload: {
    productId: string;
    question: string;
}): Promise<ApiResponse<Qa>> => {
    try {
        const { data } = await api.post("/ask-question", payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!data.success) {
            throw new Error(data.message || "Failed to ask question");
        }
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to ask question");
        } else {
            throw error;
        }
    }
};

export interface QaPaginatedResponse {
    data: Qa[];
    page: number;
    limit: number;
    page_limit: number;
    total: number;
    skip: number;
    hasLimit: boolean;
    hasNext: boolean;
    hasPrev: boolean;
}

export const getQuestionByProduct = async (id: string, page: number): Promise<QaPaginatedResponse> => {
    try {
        const { data } = await api.get(`/get-questions-by-product-id/${id}?page=${page}&limit=${5}`);
        if (!data.success) {
            throw new Error(data.message || "Failed to get question by product");
        }
        return data.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to get question by product");
        } else {
            throw error;
        }
    }
}

export const helpfulCount = async (questionId: string): Promise<ApiResponse<Qa>> => {
    try {
        const { data } = await api.put(`/helpful-count/${questionId}`);
        if (!data.success) {
            throw new Error(data.message || "Failed to get helpful count");
        }
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to get helpful count");
        } else {
            throw error;
        }
    }
}