import axios from 'axios';
import { api } from '../interface/api'

export interface Order {
    _id?: string;
    userId?: string;
    orderNumber: string;
    orderItems?: OrderItem[];
    items?: any[];
    paymentMethod?: string;
    totalAmount?: number;
    shippingAddress?: {
        fullName?: string;
        phone?: string;
        [key: string]: any;
    };
    orderStatus?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentStatus?: "paid" | "unpaid" | "partial";
    paidAt?: string;
    deliveredAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface OrderItem {
    productId?: string;
    productTitle?: string;
    productPrice?: number;
    productImage?: string;
    quantity?: number;
    size?: string;
    color?: string;
    subtotal?: number;
}


export interface GetOrderParams {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    token?: string;
    error?: string;
}

export interface IPayment {
    amount: number;
    order: string;
    order_id: string;
    currency: string;
    success: boolean;
    signature: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    reason: string;
    createdAt: Date;
    updatedAt: Date;
}

export const fetchAllOrders = async (page: number = 1, limit: number = 10): Promise<{ orders: Order[], pagination?: any }> => {
    try {
        const { data } = await api.get<ApiResponse<{ orders: Order[], pagination?: any }>>(`/admin/orders?page=${page}&limit=${limit}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch orders");
        }

        return data.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch orders");
        } else {
            throw error;
        }
    }
}

export const updateOrderStatus = async (id: string, orderStatus: string): Promise<Order> => {
    try {
        const { data } = await api.put(`/update-order/${id}`, { orderId: id, orderStatus });

        if (!data.success) {
            throw new Error(data.message || "Failed to update order");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch orders");
        } else {
            throw error;
        }
    }
};

export const addReason = async (id: string, reason: string): Promise<Order> => {
    try {
        const { data } = await api.post(`/add-reason/${id}`, { orderId: id, reason });

        if (!data.success) {
            throw new Error(data.message || "Failed to update order");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch orders");
        } else {
            throw error;
        }
    }
};

export const updateExpectedDeliveryDate = async (id: string, expectedDeliveryDate: string): Promise<Order> => {
    try {
        const { data } = await api.put(`/expected-delivery-date/${id}`, { orderId: id, expectedDeliveryDate });

        if (!data.success) {
            throw new Error(data.message || "Failed to update expected delivery date");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update expected delivery date");
        } else {
            throw error;
        }
    }
};

export const refundPayment = async (orderId: string): Promise<ApiResponse<IPayment>> => {
    try {
        const { data } = await api.post(`/create-refund`, { orderId });

        if (data.success === false) {
            throw new Error(data.message || "Failed to refund payment");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to refund payment");
        } else {
            throw error;
        }
    }
}