import { useQuery } from "@tanstack/react-query";
import {
    fetchSalesReport,
    fetchSalesByDay,
    fetchSalesByMonth,
    fetchSalesByYear,
    fetchSalesByCategory,
    fetchSalesByProduct,
    fetchSalesByCustomer
} from "../Api/reportApi";

export const useSales = () => {
    return useQuery({
        queryKey: ["salesReport"],
        queryFn: fetchSalesReport,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 60 * 5,
        retry: 2
    });
};

export const useSalesByDay = () => useQuery({ queryKey: ["salesByDay"], queryFn: fetchSalesByDay });
export const useSalesByMonth = () => useQuery({ queryKey: ["salesByMonth"], queryFn: fetchSalesByMonth });
export const useSalesByYear = () => useQuery({ queryKey: ["salesByYear"], queryFn: fetchSalesByYear });
export const useSalesByCategory = () => useQuery({ queryKey: ["salesByCategory"], queryFn: fetchSalesByCategory });
export const useSalesByProduct = () => useQuery({ queryKey: ["salesByProduct"], queryFn: fetchSalesByProduct });
export const useSalesByCustomer = () => useQuery({ queryKey: ["salesByCustomer"], queryFn: fetchSalesByCustomer });
