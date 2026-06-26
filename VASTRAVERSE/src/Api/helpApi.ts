import axios from "axios";
import { api } from "../interface/api";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    token?: string;
    error?: string;
}

export interface HelpCenter {
    _id: string;
    type: string;
    title: string;
    description: string;
    status: string;
    resolution: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface HelpCenterResponse {
    faq: HelpCenter[];
    page_limit: number;
    total: number;
    page: number;
    limit: number;
}

export const getUserFaqs = async (page?: number, category?: string): Promise<HelpCenterResponse> => {
    try {
        const { data } = await api.get(`/getUserFaqs?page=${page || 1}&limit=5&category=${category || 'all'}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to get user faqs");
        }

        return data.data || [];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to get user faqs");
        } else {
            throw error;
        }
    }
}

export interface Coupon {
    _id: string;
    title: string;
    code: string;
}

export const getCoupons = async (): Promise<Coupon[]> => {
    try {
        const { data } = await api.get(`/user-coupon`);

        if (!data.success) {
            throw new Error(data.message || "Failed to get coupons");
        }

        return data.data?.coupons || [];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to get coupons");
        } else {
            throw error;
        }
    }
}