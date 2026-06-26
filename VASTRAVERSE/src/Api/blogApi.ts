import axios from "axios";
import { api } from "../interface/api";

export interface IBlog {
    _id: string,
    author: string,
    title: string,
    description: string,
    subTitle: string,
    subDescription: string,
    content: string[],

    featuredImage: string;
    images: string[];

    category: string;

    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];

    status: string;

    views: number;
    createdAt: Date;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    token?: string;
    error?: string;
}

export const createBlogByUser = async (data: FormData): Promise<IBlog> => {
    try {
        const res = await api.post("/create-blog-by-user", data);

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

export const updateBlog = async (id: string, data: FormData): Promise<IBlog> => {
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

export const deleteBlog = async (id: string): Promise<IBlog> => {
    try {
        const res = await api.delete(`/delete-user-blog/${id}`);

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

export const getUserBlog = async (): Promise<ApiResponse<{ blog: IBlog[] }>> => {
    try {
        const { data } = await api.get("/get-user-blog");

        if (data.success === false) {
            throw new Error(data.message || "Failed to get user blogs");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to get user blogs"
            );
        } else {
            throw error;
        }
    }
}

export const getBlogs = async (): Promise<ApiResponse<{ blog: IBlog[] }>> => {
    try {
        const { data } = await api.get("/get-all-blog");

        if (data.status !== 200) {
            throw new Error(data.message || "Failed to get blogs");
        }

        return data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to fetch blogs"
            );
        } else {
            throw error;
        }
    }
}

export const viewBlog = async (id: string): Promise<IBlog> => {
    try {
        const res = await api.put(`/view-blog/${id}`);

        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to view blog");
        }

        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to view blog");
        } else {
            throw error;
        }
    }
}