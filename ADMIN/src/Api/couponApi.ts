import type { ApiResponse } from "./orderApi";
import axios from 'axios';
import { api } from '../interface/api'

export interface Coupon {
    [x: string]: any;
    _id?: string;
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    minimumOrderAmount: number;
    maximumDiscount: number;
    usageLimit: number;
    usedCount?: number;
    startDate: string;
    expiryDate: string;
    isActive: boolean;
    isDeleted: boolean;
}

export const createCoupon = async (coupon: Coupon): Promise<ApiResponse<Coupon[]>> => {
    try {
        const { data } = await api.post("/coupon/create", coupon);

        if (!data.success) {
            throw new Error(data.message || "Failed to create coupon");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create coupon");
        } else {
            throw error;
        }
    }
}

export const updateCoupon = async (id: string, coupon: Coupon): Promise<ApiResponse<Coupon[]>> => {
    try {
        const { data } = await api.put(`/coupon/update/${id}`, coupon);

        if (!data.success) {
            throw new Error(data.message || "Failed to update coupon");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update coupon");
        } else {
            throw error;
        }
    }
}

export const deleteCoupon = async (id: string): Promise<ApiResponse<Coupon[]>> => {
    try {
        const { data } = await api.put(`/coupon/delete/${id}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to delete coupon");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete coupon");
        } else {
            throw error;
        }
    }
}

export const toggleCoupon = async (id: string): Promise<ApiResponse<Coupon[]>> => {
    try {
        const { data } = await api.put(`/coupon/toggle/${id}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to toggle coupon");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to toggle coupon");
        } else {
            throw error;
        }
    }
}

export const FilteredCoupons = async (): Promise<ApiResponse<{ coupons: Coupon[] }>> => {
    try {
        const { data } = await api.get(`/coupon/filter`);
        if (!data.success) {
            throw new Error(data.message || "Failed to fetch coupons");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch coupons");
        } else {
            throw error;
        }
    }
}