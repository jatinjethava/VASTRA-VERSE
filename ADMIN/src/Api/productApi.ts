import axios from 'axios';
import { api } from '../interface/api'

export interface Product {
    _id?: string;
    title: string;
    slug?: string;
    description: string;
    basePrice: number;
    discountPrice: number;
    costPrice: number;
    category: string;
    gender: string;
    material: string;
    fit: string;
    images: string[];
    tags: string[];
    isFeatured: boolean;
    isPublished: boolean;
    isBestSeller: boolean;
    isNewArrival: boolean;
    seoTitle: string;
    seoDescription: string;
    variants: Variant[];
    ratingsAverage?: number;
    ratingsQuantity?: number;
    soldCount?: number;
}

export interface Variant {
    size: string;
    color: string;
    stock: number;
    sku: string;
    price: number;
    discountPrice: number;
}

export interface ApiResponse {
    status: number;
    success: boolean;
    message: string;
    data: any;
    error: any;
}

export interface PaginatedProductsResponse {
    products: Product[];
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export const addProduct = async (product: Product): Promise<ApiResponse> => {
    try {
        const formData = new FormData();

        Object.keys(product).forEach((key) => {
            const value = (product as any)[key];
            if (key === 'images') {
                value.forEach((image: any) => {
                    formData.append('images', image);
                });
            } else if (key === 'variants' || key === 'tags') {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        });

        const { data } = await api.post("/product/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (data.success === false) {
            throw new Error(data.message || "Failed to add product");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to add product");
        } else {
            console.error("General Error:", error);
            throw error;
        }
    }
}

export const getAllProducts = async (page: number = 1, limit: number = 10): Promise<PaginatedProductsResponse> => {
    try {
        const { data } = await api.get(`/product/get?page=${page}&limit=${limit}`);

        if (data.success === false) {
            throw new Error(data.message || "Failed to fetch products");
        }

        return data.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch products");
        } else {
            throw error;
        }
    }
}

export const getSingleProduct = async (id: string): Promise<Product> => {
    try {
        const { data } = await api.get(`/product/get/${id}`);

        if (data.success === false) {
            throw new Error(data.message || "Failed to fetch product");
        }

        return data.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch product");
        } else {
            throw error;
        }
    }
}

export const updateProduct = async (id: string, product: Product): Promise<ApiResponse> => {
    try {
        const formData = new FormData();

        const ignoreKeys = ['slug', 'createdAt', 'updatedAt', '__v', 'isDeleted', 'ratingsAverage', 'ratingsQuantity', 'soldCount', 'reviews', 'salesApplied'];

        Object.keys(product).forEach((key) => {
            if (ignoreKeys.includes(key)) return;

            const value = (product as any)[key];
            if (key === 'images') {
                value.forEach((image: any) => {
                    formData.append('images', image);
                });
            } else if (key === 'variants' || key === 'tags') {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value);
            }
        });

        const { data } = await api.put(`/product/update/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (data.success === false) {
            throw new Error(data.message || "Failed to update product");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update product");
        } else {
            console.error("General Error:", error);
            throw error;
        }
    }
}

export const deleteProduct = async (id: string): Promise<ApiResponse> => {
    try {
        const { data } = await api.delete(`/product/delete/${id}`);

        if (data.success === false) {
            throw new Error(data.message || "Failed to delete product");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete product");
        } else {
            throw error;
        }
    }
}

export const increaseStock = async (id: string, stock: number, sku: string): Promise<ApiResponse> => {
    try {
        const { data } = await api.put(`/product/inc-stock/${id}`, { stock, sku });

        if (data.success === false) {
            throw new Error(data.message || "Failed to increase stock");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to increase stock");
        } else {
            throw error;
        }
    }
}