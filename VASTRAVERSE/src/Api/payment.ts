import axios from "axios";
import { api } from "../interface/api";

export interface CreatePaymentInput {
    orderId: string;
    amount: number;
    currency?: string;
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

export interface CreatePaymentResponse {
    payment: IPayment;
    razorpayOrder: {
        id: string;
        entity: string;
        amount: number;
        currency: string;
        receipt: string;
        status: string;
        created_at: number;
    };
}

export interface ApiResponse<T> {
    status: number;
    success: boolean;
    message: string;
    data: T;
    error?: any;
}

export const createPaymentOrder = async (paymentData: CreatePaymentInput): Promise<ApiResponse<CreatePaymentResponse>> => {

    try {
        const { data } = await api.post("/create-payment-order", paymentData);

        if (data.success === false) {
            throw new Error(data.message || "Failed to create payment");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create payment");
        } else {
            throw error;
        }
    }
}

export const verifyPayment = async (paymentData: { orderId: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string }): Promise<ApiResponse<IPayment>> => {
    try {
        const { data } = await api.post("/verify-payment", paymentData);

        if (data.success === false) {
            throw new Error(data.message || "Failed to verify payment");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to verify payment");
        } else {
            throw error;
        }
    }
}

export const getPaymentDetails = async (orderId: string): Promise<ApiResponse<IPayment>> => {
    try {
        const { data } = await api.get(`/get-payment-by-id/${orderId}`);

        if (data.success === false) {
            throw new Error(data.message || "Failed to get payment details");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to get payment details");
        } else {
            throw error;
        }
    }
}

export const paymentFaildReason = async (reason: string): Promise<ApiResponse<IPayment>> => {
    try {
        const { data } = await api.post("/fail-payment", { reason });

        if (data.success === false) {
            throw new Error(data.message || "Failed to fail payment");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fail payment");
        } else {
            throw error;
        }
    }
}