import { useQuery } from "@tanstack/react-query";
import {
    fetchRevenueOverview,
    fetchRevenueCharts,
    fetchRevenueByRegion,
    fetchRevenueByPaymentMethod
} from "../Api/revenueApi";

export const useRevenueOverview = () => useQuery({ queryKey: ["revenueOverview"], queryFn: fetchRevenueOverview });
export const useRevenueCharts = () => useQuery({ queryKey: ["revenueCharts"], queryFn: fetchRevenueCharts });
export const useRevenueByRegion = () => useQuery({ queryKey: ["revenueByRegion"], queryFn: fetchRevenueByRegion });
export const useRevenueByPaymentMethod = () => useQuery({ queryKey: ["revenueByPaymentMethod"], queryFn: fetchRevenueByPaymentMethod });
