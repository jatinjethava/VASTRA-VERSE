import axios from 'axios';
import { api } from '../interface/api'

export interface ApiResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: T;
    error: any;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    role: string;
    profileImage: string;
    usedBy: string[];
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getAllUsers = async (): Promise<User[]> => {
    try {
        const { data } = await api.get("/get-all-users");

        if (data.success === false) {
            throw new Error(data.message || "Failed to fetch users");
        }

        return data.data.user || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch users");
        } else {
            throw error;
        }
    }
}

export const blockUser = async (id: string): Promise<User> => {
    try {
        const { data } = await api.put(`/block-user/${id}`);

        if (data.success === false) {
            throw new Error(data.message || "Failed to block user");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to block user");
        } else {
            throw error;
        }
    }
}

export const returningCustomer = async (): Promise<any[]> => {
    try {
        const { data } = await api.get("/returning-customers");

        if (data.success === false) {
            throw new Error(data.message || "Failed to fetch returning customers");
        }

        return data.data.returningCustomers || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch returning customers");
        } else {
            throw error;
        }
    }
}

export const growthCustomer = async (): Promise<any[]> => {
    try {
        const { data } = await api.get("/customer-growth");

        if (data.success === false) {
            throw new Error(data.message || "Failed to fetch customer growth");
        }

        return data.data.customerGrowth || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch customer growth");
        } else {
            throw error;
        }
    }
}