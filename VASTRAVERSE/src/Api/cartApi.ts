import axios from "axios";
import { api } from "../interface/api";

export interface CartItem {
    _id: string;
    productId: string;
    quantity: number;
    size: string;
    color: string;
    code?: string | null;
    discountAmount?: number;
}

export interface Cart {
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    code?: string;
    discountAmount?: number;
}

interface ApiResponse<T = any> {
    status: number;
    success: boolean;
    message: string;
    data: T;
    error: any;
}

export const addToCart = async (payload: {
    productId: string;
    quantity: number;
    size?: string;
    color?: string;
}): Promise<CartItem> => {
    try {
        const { data } = await api.post<ApiResponse<{ cart: CartItem }>>(
            "/add-to-cart",
            payload
        );

        if (!data.success) {
            throw new Error(data.message || "Failed to add to cart");
        }

        return data.data.cart || (data.data as any);
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to add to cart"
            );
        } else {
            throw error;
        }
    }
};

export const updateCart = async (
    cartItemId: string,
    payload: {
        quantity?: number;
        size?: string;
        color?: string;
    }
): Promise<CartItem> => {
    try {
        const { data } = await api.patch<ApiResponse<{ cart: CartItem }>>(
            `/update-cart/${cartItemId}`,
            payload
        );

        if (!data.success) {
            throw new Error(data.message || "Failed to update cart");
        }

        return data.data.cart || (data.data as any);
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to update cart"
            );
        } else {
            throw error;
        }
    }
};

export const removeFromCart = async (cartItemId: string): Promise<void> => {
    try {
        const { data } = await api.delete<ApiResponse>(
            `/delete-cart/${cartItemId}`
        );

        if (!data.success) {
            throw new Error(data.message || "Failed to remove from cart");
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to remove from cart"
            );
        } else {
            throw error;
        }
    }
};

export const cartEmpty = async (): Promise<void> => {
    try {
        const { data } = await api.delete<ApiResponse>(
            `/clear-cart`
        );

        if (!data.success) {
            throw new Error(data.message || "Failed to clear cart");
        }
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to clear cart"
            );
        } else {
            throw error;
        }
    }
};

export const getCart = async (): Promise<CartItem[]> => {
    try {
        const { data } = await api.get<ApiResponse<{ cart: CartItem[] | CartItem }>>("/get-cart");

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch cart");
        }

        const cartData = data.data.cart || data.data;
        return Array.isArray(cartData) ? cartData : [cartData as CartItem];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch cart");
        } else {
            throw error;
        }
    }
};

export const increaseQuantity = async (cartItemId: string): Promise<CartItem> => {
    try {
        const { data } = await api.put<ApiResponse<{ cart: CartItem }>>(
            `/increase-quantity/${cartItemId}`
        );

        if (!data.success) {
            throw new Error(data.message || "Failed to increase cart quantity");
        }

        return data.data.cart || (data.data as any);
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to increase cart quantity"
            );
        } else {
            throw error;
        }
    }
};

export const decreaseQuantity = async (cartItemId: string): Promise<CartItem> => {
    try {
        const { data } = await api.put<ApiResponse<{ cart: CartItem }>>(
            `/decrease-quantity/${cartItemId}`
        );

        if (!data.success) {
            throw new Error(data.message || "Failed to decrease cart quantity");
        }

        return data.data.cart || (data.data as any);
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to decrease cart quantity"
            );
        } else {
            throw error;
        }
    }
};

export const applyDiscountCode = async (id: string, code: string): Promise<CartItem> => {
    try {
        const { data } = await api.put<ApiResponse<{ cart: CartItem }>>(
            `/apply-coupon-code`,
            { id, code }
        );

        if (!data.success) {
            throw new Error(data.message || "Failed to apply discount");
        }

        return data.data.cart || (data.data as any);
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to apply discount"
            );
        } else {
            throw error;
        }
    }
};

export const saveForLater = async (cartItemId: string): Promise<Cart> => {
    try {
        const { data } = await api.put<ApiResponse<{ cart: CartItem }>>(`/save-for-later/${cartItemId}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to save for later");
        }

        return data.data as any;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to save for later"
            );
        } else {
            throw error;
        }
    }
}

export const getSavedCart = async (): Promise<CartItem[]> => {
    try {
        const { data } = await api.get<ApiResponse<{ cart: CartItem[] | CartItem }>>("/get-save-cart");

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch saved cart");
        }

        const cartData = data.data.cart || data.data;
        return Array.isArray(cartData) ? cartData : [cartData as CartItem];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch saved cart");
        } else {
            throw error;
        }
    }
};

export const moveCart = async (cartItemId: string): Promise<Cart> => {
    try {
        const { data } = await api.put(`/move-cart/${cartItemId}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to move cart to active");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Failed to move cart to active"
            );
        } else {
            throw error;
        }
    }
};