import axios from "axios";
import { api } from "../interface/api";

export interface IReturnPayload {
    orderItemId: string;
    reason: string;
    description: string;
    images: File[];
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export const createReturnRequest = async (payload: FormData): Promise<ApiResponse<IReturnPayload>> => {
    try {
        const { data } = await api.post(`/create-return`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });

        if (data.success === false) {
            throw new Error(data.message || "Failed to create return request");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create return request");
        } else {
            throw error;
        }
    }
}