import axios from "axios";
import { api } from "../interface/api";

export interface Campaign {
    _id: string;
    title: string;
    discount: number;
    name: string;
    discountValue: number;
    code: string;
    startDate: string;
    endDate: string;
    description: string;
    image: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getUserActiveCampaigns = async (): Promise<Campaign[]> => {
    try {
        const { data } = await api.get("/get-active-campaigns");

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch campaigns");
        }

        return data.data.campaigns;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch campaigns");
        } else {
            throw error;
        }
    }
};

export interface FlashSalesCampaign {
    _id: string;
    title: string;
    discount: number;
    name: string;
    discountValue: number;
    code: string;
    startDate: string;
    endDate: string;
    description: string;
    image: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getFlashCampaigns = async (): Promise<FlashSalesCampaign[]> => {
    try {
        const { data } = await api.get("/get-active-flash-sales");

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch Flash Sales");
        }

        return data.data.flashSales;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch Flash Sales");
        } else {
            throw error;
        }
    }
};

export interface Banner {
    _id: string;
    title: string;
    description: string;
    bgImage: string;
    image: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getAllBanner = async (): Promise<Banner[]> => {
    try {
        const { data } = await api.get("/get-all-banners-for-user");

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch banners");
        }

        return data.data.banners;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch banners");
        } else {
            throw error;
        }
    }
};