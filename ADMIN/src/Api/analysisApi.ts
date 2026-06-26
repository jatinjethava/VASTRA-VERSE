import axios from 'axios';
import { api } from '../interface/api'

export const productAnalysis = async () => {
    try {
        const { data } = await api.get("/product-analysis");
        return data.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch product analysis");
        } else {
            throw error;
        }
    }
}

export const viewProductAnalysis = async () => {
    try {
        const { data } = await api.get("/view-analysis");
        return data.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch view product analysis");
        } else {
            throw error;
        }
    }
}

export const wishlistedAnalysis = async () => {
    try {
        const { data } = await api.get("/wishlisted-analysis");
        return data.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch wishlisted analysis");
        } else {
            throw error;
        }
    }
}

export const conversionRate = async () => {
    try {
        const { data } = await api.get("/conversion-rate");
        return data.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch conversion rate");
        } else {
            throw error;
        }
    }
}

export const categoryAnalysis = async () => {
    try {
        const { data } = await api.get("/category-analysis");
        return data.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch category analysis");
        } else {
            throw error;
        }
    }
}