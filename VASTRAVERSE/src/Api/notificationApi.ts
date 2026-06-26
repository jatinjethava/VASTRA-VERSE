import axios from "axios";
import type { JSX } from "react/jsx-runtime";
import { api } from "../interface/api";

export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ApiResponse<T> {
    map(arg0: (item: any) => JSX.Element): import("react").ReactNode;
    success: boolean;
    message: string;
    data: T;
    token?: string;
    error?: string;
}

export const getUserNotifications = async (): Promise<{ notifications: Notification[] }> => {
    try {
        const { data } = await api.get("/get-user-notifications");

        if (!data.success) {
            throw new Error(data.message || "Failed to get user notifications");
        }

        return data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to get user notifications");
        } else {
            throw error;
        }
    }
}

export const markAsRead = async (id: string): Promise<Notification> => {
    try {
        const { data } = await api.put(`/mark-as-read/${id}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to mark as read");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to mark as read");
        } else {
            throw error;
        }
    }
}

export const readAllNotification = async (): Promise<Notification> => {
    try {
        const { data } = await api.put(`/read-all-user-notifications`);

        if (!data.success) {
            throw new Error(data.message || "Failed to read all notification");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to read all notification");
        } else {
            throw error;
        }
    }
}