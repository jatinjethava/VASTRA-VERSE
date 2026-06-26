import axios from "axios";
import { api } from "../interface/api";
import type { Product } from "./productApi";

export interface WishList {
    userId: string
    wishlist: string[]
}

export interface ApiResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: T;
    error: any;
}

export const addProductInWishList = async (productId: string) => {
    try {
        const { data } = await api.post<ApiResponse<WishList>>("/wishlist/add", { productId });

        if (data.success === false) {
            throw new Error(data.message || "Failed to add product to wishlist");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to add product to wishlist");
        } else {
            throw error;
        }
    }
}

export const removeProductFromWishList = async (productId: string) => {
    try {
        const { data } = await api.delete<ApiResponse<WishList>>("/wishlist/remove", { data: { productId } });

        if (data.success === false) {
            throw new Error(data.message || "Failed to remove product from wishlist");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to remove product from wishlist");
        } else {
            throw error;
        }
    }
}

export const getProductInWishList = async () => {
    try {
        const { data } = await api.get<ApiResponse<WishList>>("/wishlist/get");

        if (data.success === false) {
            throw new Error(data.message || "Failed to get products from wishlist");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to get products from wishlist");
        } else {
            throw error;
        }
    }
}

export const getWishlistShowProducts = async (): Promise<ApiResponse<{ finalProduct: Product[] }>> => {
    try {
        const { data } = await api.get("/wishlist/get-products");

        if (data.success === false) {
            throw new Error(data.message || "Failed to get products from wishlist");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to get products from wishlist");
        } else {
            throw error;
        }
    }
}