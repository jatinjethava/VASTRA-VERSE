import axios from "axios";
import { api } from "../interface/api";

export interface Product {
    _id?: string;
    title: string;
    slug?: string;
    description: string;
    basePrice: number;
    discountPrice: number;
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
    limitedEdition: boolean;
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
    data: Product;
    error: any;
}

export const getAllProducts = async (): Promise<Product[]> => {
    try {
        const { data } = await api.get("/product/get-published");

        if (data.success === false) {
            throw new Error(data.message || "Failed to fetch products");
        }

        return data.data.products || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch products");
        } else {
            throw error;
        }
    }
}

export const getRelatedProducts = async (category: string): Promise<Product[]> => {
    try {
        const { data } = await api.get(`/product/filter?gender=${category}`);

        if (data.success === false) {
            throw new Error(data.message || "Failed to fetch products");
        }

        return data.data.products || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch products");
        } else {
            throw error;
        }
    }
}

export const getProductByCategory = async (id: string): Promise<Product[]> => {
    try {
        const { data } = await api.get(`/product/get/${id}`);

        if (data.success === false) {
            throw new Error(data.message || "Failed to fetch product");
        }

        return data.data.product || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch product");
        } else {
            throw error;
        }
    }
}

export const shopBySlug = async (
    slug: string,
    category?: string,
    fit?: string,
    maxPrice?: number,
    isFeatured?: boolean,
    isBestSeller?: boolean,
    isNewArrival?: boolean,
    limitedEdition?: boolean
): Promise<Product[]> => {
    try {
        const params = new URLSearchParams();

        if (category) params.append("category", category);
        if (fit) params.append("fit", fit);
        if (maxPrice) params.append("maxPrice", maxPrice.toString());
        if (isFeatured) params.append("isFeatured", isFeatured.toString());
        if (isBestSeller) params.append("isBestSeller", isBestSeller.toString());
        if (isNewArrival) params.append("isNewArrival", isNewArrival.toString());
        if (limitedEdition) params.append("limitedEdition", limitedEdition.toString());

        const { data } = await api.get(
            `/shopBySlug/${slug}?${params.toString()}`
        );

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch products");
        }

        return data.data.products || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message ||
                "Failed to fetch products"
            );
        }
        throw error;
    }
};

export const getChildCategoriesBySlug = async (slug: string): Promise<any[]> => {
    try {
        const { data } = await api.get(`/getChildCategoriesBySlug/${slug}`);
        if (!data.success) {
            throw new Error(data.message || "Failed to fetch categories");
        }
        return data?.data?.childCategories || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch categories");
        }
        throw error;
    }
};

export const getProductsForUser = async (): Promise<Product[]> => {
    try {
        const { data } = await api.get("/product/all");

        if (data.success === false) {
            throw new Error(data.message || "Failed to fetch products");
        }

        return data.data.products || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch products");
        } else {
            throw error;
        }
    }
}

export const viewProduct = async (id: string) => {
    try {
        const { data } = await api.post(`/product/viewed/${id}`);

        if (data.success === false) {
            throw new Error(data.message || "Failed to view product");
        }

        return data.data.product || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to view product");
        } else {
            throw error;
        }
    }
}