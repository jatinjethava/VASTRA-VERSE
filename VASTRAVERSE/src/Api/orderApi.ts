import { type Product } from "./productApi";
import axios from "axios";
import { api } from "../interface/api";

export interface Order {
    _id: string;
    userId: string;
    orderNumber: string;
    items: Product[];
    shippingAddress: IShippingAddress;
    paymentMethod: "cod" | "razorpay";
    paymentStatus: "unpaid" | "paid" | "failed" | "refunded";
    orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    subtotal: number;
    shippingFee: number;
    discount: number;
    totalAmount: number;
    totalItems: number;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    reason?: string;

    expectedDeliveryDate?: Date;
    deliveredAt?: Date;
    returnRequest?: boolean;

    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IShippingAddress {
    fullName: string;
    phone: number;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    pincode: number;
}


export interface ApiResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: {
        order: T;
    };
    error?: any;
}

export const createOrder = async (order: Order): Promise<ApiResponse<Order>> => {
    try {
        const { data } = await api.post("/create-order", order);

        if (data.success === false) {
            throw new Error(data.message || "Failed to create order");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create order");
        } else {
            throw error;
        }
    }
}

export const getUserOrder = async (): Promise<Order[]> => {
    try {
        const { data } = await api.get("/orders");

        if (data.success === false) {
            throw new Error(data.message || "Failed to fetch order");
        }

        return data.data.orders || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch orders");
        } else {
            throw error;
        }
    }
}

export const cancelOrder = async ({ reason, orderId }: { reason?: string, orderId: string }): Promise<ApiResponse<Order>> => {
    try {
        const { data } = await api.put(`/cancel-order/${orderId}`, { reason });

        if (data.success === false) {
            throw new Error(data.message || "Failed to cancel order");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to cancel order");
        } else {
            throw error;
        }
    }
}

export const DownloadInvoice = async (orderId: string): Promise<Blob> => {
    try {
        let token = localStorage.getItem("token");
        if (token) {
            if (token.startsWith('"') && token.endsWith('"')) {
                token = token.slice(1, -1);
            }
        }

        const response = await api.get(`/download-invoice/${orderId}`, {
            responseType: "blob",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status !== 200) {
            throw new Error(response.data || "Failed to download invoice");
        }

        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to download invoice");
        } else {
            throw error;
        }
    }
}

export const getStatus = async (orderNumber: string): Promise<string> => {
    try {
        const response = await api.get(`/order-status/${orderNumber}`);

        if (response.status !== 200) {
            throw new Error(response.data || "Failed to fetch order status");
        }

        const statusData = response.data.data.status;
        return statusData?.orderStatus || statusData;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch order status");
        } else {
            throw error;
        }
    }
}

export const getAllcoupons = async (): Promise<any[]> => {
    try {
        const { data } = await api.get("/coupon/filter");

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch coupons");
        }

        return data.data.coupons || [];
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch coupons");
        } else {
            throw error;
        }
    }
}