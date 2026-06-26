import axios from 'axios';
import { api } from '../interface/api'

export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface NotificationApiResponse<T> {
    success: boolean;
    message: string;
    data: T
}

export const getAdminNotifications = async (): Promise<NotificationApiResponse<{ notifications: Notification[] }>> => {
    try {
        const { data } = await api.get("/get-admin-notifications");
        if (data.success === false) {
            throw new Error(data.message || "Failed to get notifications");
        }
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to get notifications");
        } else {
            console.error("General Error:", error);
            throw error;
        }
    }
};

export const markAsRead = async (id: string): Promise<NotificationApiResponse<Notification>> => {
    try {
        const { data } = await api.put(`/mark-as-read/${id}`);
        if (data.success === false) {
            throw new Error(data.message || "Failed to mark as read");
        }
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to mark as read");
        } else {
            console.error("General Error:", error);
            throw error;
        }
    }
};

export const markAllAsReadAdmin = async (): Promise<NotificationApiResponse<{ notifications: Notification[] }>> => {
    try {
        const { data } = await api.put("/mark-all-as-read");
        if (data.success === false) {
            throw new Error(data.message || "Failed to mark all as read");
        }
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to mark all as read");
        } else {
            console.error("General Error:", error);
            throw error;
        }
    }
}