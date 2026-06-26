import axios from 'axios';
import { api } from '../interface/api'
import type { ApiResponse } from "./orderApi";

export interface Return {
    _id: string;
    userId: any;
    orderId: any;
    orderItemId: string[];
    orderDate?: string;
    orderTotal?: number;
    reason: string;
    description: string;
    images: string[];
    status: "pending" | "approved" | "rejected";
    approvedAt: Date;
    rejectedAt: Date;
    createdAt?: string;
}

export const getAllReturnOrders = async (): Promise<Return[]> => {
    try {
        const { data } = await api.get("/all-returns");

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch returns");
        }

        return data.data.returnOrders;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch orders");
        } else {
            throw error;
        }
    }
}

export const updateReturnStatus = async (id: string, status: string): Promise<ApiResponse<{
    returnOrder: Return
}>> => {
    try {
        const { data } = await api.put(`/update-status/${id}`, { status });

        if (!data.success) {
            throw new Error(data.message || "Failed to update return status");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update return status");
        } else {
            throw error;
        }
    }
}