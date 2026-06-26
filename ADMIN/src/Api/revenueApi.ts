import { api } from '../interface/api'
import type { ApiResponse } from "./orderApi";
import { toast } from "sonner";

export interface RevenueOverviewData {
    grossRevenue: number;
    netRevenue: number;
    totalDiscounts: number;
    shippingRevenue: number;
    taxCollected: number;
    refunds: number;
    profit: number;
    profitMargin: number;
}

export interface RevenueChartData {
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
}

export interface RevenueRegionData {
    _id: string;
    totalRevenue: number;
    totalOrders: number;
}

export interface RevenuePaymentMethodData {
    _id: string;
    totalRevenue: number;
    totalOrders: number;
}

export const fetchRevenueOverview = async (): Promise<RevenueOverviewData> => {
    const { data } = await api.get<ApiResponse<{ data: RevenueOverviewData }>>("/revenue/overview");
    return data.data.data;
};

export const fetchRevenueCharts = async (): Promise<RevenueChartData[]> => {
    const { data } = await api.get<ApiResponse<{ data: RevenueChartData[] }>>("/revenue/charts");
    return data.data.data;
};

export const fetchRevenueByRegion = async (): Promise<RevenueRegionData[]> => {
    const { data } = await api.get<ApiResponse<{ data: RevenueRegionData[] }>>("/revenue/region");
    return data.data.data;
};

export const fetchRevenueByPaymentMethod = async (): Promise<RevenuePaymentMethodData[]> => {
    const { data } = await api.get<ApiResponse<{ data: RevenuePaymentMethodData[] }>>("/revenue/payment-method");
    return data.data.data;
};

export const exportRevenue = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
        const { data } = await api.get("/revenue/export", {
            params: { format },
            responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([data]));

        const link = document.createElement("a");
        link.href = url;

        switch (format) {
            case "csv":
                link.download = `revenue-report-${Date.now()}.csv`;
                break;
            case "excel":
                link.download = `revenue-report-${Date.now()}.xlsx`;
                break;
            case "pdf":
                link.download = `revenue-report-${Date.now()}.pdf`;
                break;
        }

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error exporting report:", error);
        if (error instanceof Error) {
            toast.error(error.message);
        }
    }
}