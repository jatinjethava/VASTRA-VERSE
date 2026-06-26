import { useQuery } from "@tanstack/react-query";
import { getUserFaqs, getCoupons } from "../Api/helpApi";

export const useGetUserFaqs = (page?: number, category?: string) => {
    return useQuery({
        queryKey: ["userFaqs", page, category],
        queryFn: () => getUserFaqs(page, category),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}

export const useGetCoupons = () => {
    return useQuery({
        queryKey: ["coupons"],
        queryFn: () => getCoupons(),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}