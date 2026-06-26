import axios from 'axios';
import { api } from '../interface/api'
import type { ApiResponse } from './orderApi';

export interface Category {
    _id: string;
    name: string;
    slug: string;
    description: string;
    banner: string;
    parentCategory: string;
    sortOrder: number;
    seoTitle: string;
    seoDescription: string;
}

export interface CategoryApiResponse {
    status: number;
    success: boolean;
    message: string;
    data: { categories: Category[] };
    error: any;
}

export const addCategory = async (category: FormData): Promise<CategoryApiResponse> => {
    try {
        const { data } = await api.post("/createCategory", category);
        if (data.success === false) {
            throw new Error(data.message || "Failed to add category");
        }
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to add category");
        } else {
            console.error("General Error:", error);
            throw error;
        }
    }
}

export const getAllCategories = async (): Promise<Category[]> => {
    try {
        const { data } = await api.get("/getAllCategory");
        if (data.success === false) {
            throw new Error(data.message || "Failed to fetch categories");
        }
        return data.data.categories || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch categories");
        } else {
            throw error;
        }
    }
}

export const getParentCategories = async (): Promise<Category[]> => {
    try {
        const { data } = await api.get("/getParentCategory");
        if (data.success === false) {
            throw new Error(data.message || "Failed to fetch parent categories");
        }
        return data.data.categories || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                return [];
            }
            throw new Error(error.response?.data?.message || "Failed to fetch parent categories");
        } else {
            throw error;
        }
    }
}

export const getSingleCategory = async (id: string): Promise<Category> => {
    try {
        const { data } = await api.get(`/getCategoryById/${id}`);
        if (data.success === false) {
            throw new Error(data.message || "Failed to fetch category");
        }
        return data.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch category");
        } else {
            throw error;
        }
    }
}

export const updateCategory = async (id: string, category: FormData): Promise<ApiResponse<any>> => {
    try {
        const { data } = await api.put(`/updateCategory/${id}`, category);
        if (data.success === false) {
            throw new Error(data.message || "Failed to update category");
        }
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update category");
        } else {
            throw error;
        }
    }
}

export const deleteCategory = async (id: string): Promise<any> => {
    try {
        const { data } = await api.delete(`/deleteCategory/${id}`);
        if (data.success === false) {
            throw new Error(data.message || "Failed to delete category");
        }
        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete category");
        } else {
            throw error;
        }
    }
}