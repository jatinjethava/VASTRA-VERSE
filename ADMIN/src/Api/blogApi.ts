import axios from 'axios';
import { api } from '../interface/api'

export interface Blogs {
    _id: string;
    author: string,
    title: string,
    description: string,
    subTitle: string,
    subDescription: string,
    content: string[],
    featuredImage: File | string,
    images: (File | string)[],
    category: string,

    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    status: string;
    views?: number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    token?: string;
    error?: string;
}

export const createBlog = async (data: FormData): Promise<Blogs> => {
    try {
        const res = await api.post("/create-blog", data);

        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to create blog");
        }

        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create blog");
        } else {
            throw error;
        }
    }
}

export const getAllBlogs = async (): Promise<Blogs[]> => {
    try {
        const { data } = await api.get("/get-all-blog-for-admin");

        let blogsArray: Blogs[] = [];
        if (Array.isArray(data)) {
            blogsArray = data;
        } else if (data?.blog && Array.isArray(data.blog)) {
            blogsArray = data.blog;
        } else if (data?.data && Array.isArray(data.data)) {
            blogsArray = data.data;
        } else if (data?.data?.blog && Array.isArray(data.data.blog)) {
            blogsArray = data.data.blog;
        }

        return blogsArray;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create blog");
        } else {
            throw error;
        }
    }
}

export const updateBlog = async (id: string, data: FormData): Promise<Blogs> => {
    try {
        const res = await api.put(`/update-blog/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to update blog");
        }

        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update blog");
        } else {
            throw error;
        }
    }
}

export const deleteBlog = async (id: string): Promise<Blogs> => {
    try {
        const res = await api.delete(`/delete-blog/${id}`);

        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to delete blog");
        }

        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete blog");
        } else {
            throw error;
        }
    }
}

export const updateBlogStatus = async (id: string, status: string): Promise<any> => {
    try {
        const res = await api.put(`/update-blog-status/${id}`, { status });

        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to update blog status");
        }

        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update blog status");
        } else {
            throw error;
        }
    }
}