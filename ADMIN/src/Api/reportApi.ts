import axios from 'axios';
import { api } from '../interface/api'

export interface SalesReportData {
    stockWithProduct: { stock: number; name: string; soldCount: number }[];
    totalAmount: number;
    totalOrders: number;
    totalPending: number;
    totalShipped: number;
    totalDelivered: number;
    totalCancelled: number;
    totalReturn: number;
    returnRejected: number;
    totalReturnAmount: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const fetchSalesReport = async (): Promise<SalesReportData> => {
    try {
        const { data } = await api.get<ApiResponse<{ reportData: SalesReportData }>>("/sales-report");

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch sales report");
        }

        return data.data.reportData;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch sales report");
        } else {
            throw error;
        }
    }
};

export const exportReport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
        const response = await api.get(`/sales/export?format=${format}`, {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const extension = format === 'excel' ? 'xlsx' : format;
        link.setAttribute('download', `sales-report.${extension}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error: any) {
        console.error("Export error:", error);
        throw new Error("Failed to export report");
    }
};

export interface SalesTimeData {
    _id: string;
    totalSales: number;
    totalOrders: number;
}

export interface SalesByCategoryData {
    _id: string;
    totalSales: number;
    totalOrders: number;
}

export interface SalesByProductData {
    title: string;
    productId: string;
    quantitySold: number;
    sales: number;
}

export interface SalesByCustomerData {
    customerId: string;
    name: string;
    quantitySold: number;
    sales: number;
}

export const fetchSalesByDay = async (): Promise<SalesTimeData[]> => {
    const { data } = await api.get<ApiResponse<{ data: SalesTimeData[] }>>("/sales/day");
    return data.data.data;
};

export const fetchSalesByMonth = async (): Promise<SalesTimeData[]> => {
    const { data } = await api.get<ApiResponse<{ data: SalesTimeData[] }>>("/sales/month");
    return data.data.data;
};

export const fetchSalesByYear = async (): Promise<SalesTimeData[]> => {
    const { data } = await api.get<ApiResponse<{ data: SalesTimeData[] }>>("/sales/year");
    return data.data.data;
};

export const fetchSalesByCategory = async (): Promise<SalesByCategoryData[]> => {
    const { data } = await api.get<ApiResponse<{ data: SalesByCategoryData[] }>>("/sales/category");
    return data.data.data;
};

export const fetchSalesByProduct = async (): Promise<SalesByProductData[]> => {
    const { data } = await api.get<ApiResponse<{ data: SalesByProductData[] }>>("/sales/product");
    return data.data.data;
};

export const fetchSalesByCustomer = async (): Promise<SalesByCustomerData[]> => {
    const { data } = await api.get<ApiResponse<{ data: SalesByCustomerData[] }>>("/sales/customer");
    return data.data.data;
};
