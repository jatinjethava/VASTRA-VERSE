import axios from 'axios';
import { api } from '../interface/api'

export interface CampaignType {
    _id: string;
    name: string;
    description: string;
    image: string;
    discountType: string;
    discountValue: number;
    target: string;
    targetIds: string[];
    startDate: string;
    endDate: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FlashSalesType {
    _id: string;
    name: string;
    description: string;
    image: string;
    discountType: string;
    discountValue: number;
    target: string;
    targetIds: string[];
    startDate: string;
    endDate: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const fetchCampaigns = async (): Promise<CampaignType[]> => {
    try {
        const { data } = await api.get("/get-all-campaigns");

        if (!data) {
            throw new Error("No data found");
        }
        return data.data.campaigns;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to answer question");
        } else {
            throw error;
        }
    }
};

export const createCampaign = async (payload: FormData): Promise<CampaignType> => {
    try {
        const { data } = await api.post("/create-campaign", payload, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (!data) {
            throw new Error("No data found");
        }
        return data.campaign;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to answer question");
        } else {
            throw error;
        }
    }
};

export const updateCampaign = async (id: string, payload: FormData): Promise<CampaignType> => {
    try {
        const { data } = await api.put(`/update-campaign/${id}`, payload, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (!data) {
            throw new Error("No data found");
        }
        return data.campaign;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update campaign");
        } else {
            throw error;
        }
    }
};

export const deleteCampaign = async (id: string): Promise<CampaignType> => {
    try {
        const { data } = await api.put(`/delete-campaign/${id}`);

        if (!data) {
            throw new Error("No data found");
        }
        return data.campaign;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete campaign");
        } else {
            throw error;
        }
    }
};

export const toggleCampaign = async (id: string): Promise<CampaignType> => {
    try {
        const { data } = await api.put(`/toggle-campaign/${id}`);

        if (!data) {
            throw new Error("No data found");
        }
        return data.campaign;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to toggle campaign");
        } else {
            throw error;
        }
    }
};

// for flash sales
export const createFlashSales = async (payload: FormData): Promise<FlashSalesType> => {
    try {
        const { data } = await api.post("/create-flash-sales", payload, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (!data) {
            throw new Error("No data found");
        }
        return data.data.flashSales;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create flash sales");
        } else {
            throw error;
        }
    }
};

export const updateFlashSales = async (id: string, payload: FormData): Promise<FlashSalesType> => {
    try {
        const { data } = await api.put(`/update-flash-sales/${id}`, payload, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (!data) {
            throw new Error("No data found");
        }
        return data.flashSales;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update flash sales");
        } else {
            throw error;
        }
    }
};

export const deleteFlashSales = async (id: string): Promise<FlashSalesType> => {
    try {
        const { data } = await api.put(`/delete-flash-sales/${id}`);

        if (!data) {
            throw new Error("No data found");
        }
        return data.flashSales;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete flash sales");
        } else {
            throw error;
        }
    }
};

export const toggleFlashSales = async (id: string): Promise<FlashSalesType> => {
    try {
        const { data } = await api.put(`/toggle-flash-sales/${id}`);

        if (!data) {
            throw new Error("No data found");
        }
        return data.flashSales;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to toggle flash sales");
        } else {
            throw error;
        }
    }
};

export const fetchFlashSales = async (): Promise<FlashSalesType[]> => {
    try {
        const { data } = await api.get("/get-all-flash-sales");

        if (!data) {
            throw new Error("No data found");
        }
        return data.data.flashSales;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch flash sales");
        } else {
            throw error;
        }
    }
};

// for banner

export interface BannerType {
    _id: string;
    title: string;
    description: string;
    bgImage: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

export const fetchBanner = async (): Promise<BannerType[]> => {
    try {
        const { data } = await api.get("/get-all-banners-for-admin");

        if (!data) {
            throw new Error("No data found");
        }
        return data.data.banners;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch banner");
        } else {
            throw error;
        }
    }
};

export const createBanner = async (payload: FormData): Promise<BannerType> => {
    try {
        const { data } = await api.post("/create-banner", payload, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (!data) {
            throw new Error("No data found");
        }
        return data.banner;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create banner");
        } else {
            throw error;
        }
    }
};

export const updateBanner = async (id: string, payload: FormData): Promise<BannerType> => {
    try {
        const { data } = await api.put(`/update-banner/${id}`, payload, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (!data) {
            throw new Error("No data found");
        }
        return data.banner;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update banner");
        } else {
            throw error;
        }
    }
};

export const deleteBanner = async (id: string): Promise<BannerType> => {
    try {
        const { data } = await api.put(`/delete-banner/${id}`);

        if (!data) {
            throw new Error("No data found");
        }
        return data.banner;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete banner");
        } else {
            throw error;
        }
    }
};