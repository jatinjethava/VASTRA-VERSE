import axios from 'axios';
import { api } from '../interface/api'
import type { ApiResponse } from "./orderApi";

export interface HelpCenter {
    _id: string;
    question: string;
    answer: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Contact {
    _id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
    updatedAt: string;
}

export const createFaqs = async (FaqsData: HelpCenter): Promise<ApiResponse<HelpCenter[]>> => {
    try {
        const { data } = await api.post("/createFaqs", FaqsData);

        if (!data.success) {
            throw new Error(data.message || "Failed to create FAQs");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create Faqs");
        } else {
            throw error;
        }
    }
}

export const getAllFaqs = async (): Promise<HelpCenter[]> => {
    try {
        const { data } = await api.get("/getAllFaqs");

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch questions");
        }

        return data.data.faq;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch questions");
        } else {
            throw error;
        }
    }
}

export const updateFaqs = async (id: string, FaqsData: HelpCenter): Promise<ApiResponse<HelpCenter[]>> => {
    try {
        const { data } = await api.put(`/updateFaqs/${id}`, FaqsData);

        if (!data.success) {
            throw new Error(data.message || "Failed to update FAQs");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update FAQs");
        } else {
            throw error;
        }
    }
}

export const deleteFaqs = async (id: string): Promise<ApiResponse<HelpCenter[]>> => {
    try {
        const { data } = await api.delete(`/deleteFaqs/${id}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to delete FAQs");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete FAQs");
        } else {
            throw error;
        }
    }
}

export const getByIdFaqs = async (id: string): Promise<ApiResponse<HelpCenter[]>> => {
    try {
        const { data } = await api.get(`/getFaqs/${id}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch FAQs");
        }

        return data.data.result;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch FAQs");
        } else {
            throw error;
        }
    }
}

export const toggleActive = async (id: string): Promise<ApiResponse<HelpCenter[]>> => {
    try {
        const { data } = await api.put(`/toggleActiveFaqs/${id}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to toggle active");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to toggle active");
        } else {
            throw error;
        }
    }
}

export const getAllContact = async (): Promise<Contact[]> => {
    try {
        const { data } = await api.get("/getAllContacts");

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch contacts");
        }

        return data.data.contact;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch contacts");
        } else {
            throw error;
        }
    }
}

export const isRead = async (id: string): Promise<ApiResponse<Contact[]>> => {
    try {
        const { data } = await api.put(`/updateContact/${id}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to update contact");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update contact");
        } else {
            throw error;
        }
    }
}

export const deleteContact = async (id: string): Promise<ApiResponse<Contact[]>> => {
    try {
        const { data } = await api.put(`/deleteContact/${id}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to delete contact");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete contact");
        } else {
            throw error;
        }
    }
}