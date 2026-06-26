import { createCoupon, deleteCoupon, FilteredCoupons, toggleCoupon, updateCoupon } from "../Api/couponApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (coupon: any) => createCoupon(coupon),
        onSuccess: (data: any) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["Coupons"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    })
}

export const useUpdateCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, coupon }: { id: string, coupon: any }) => updateCoupon(id, coupon),
        onSuccess: (data: any) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["Coupons"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    })
}

export const useDeleteCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteCoupon(id),
        onSuccess: (data: any) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["Coupons"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    })
}

export const useToggleCoupon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => toggleCoupon(id),
        onSuccess: (data: any) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["Coupons"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    })
}

export const useFilteredCoupons = () => {
    return useQuery({
        queryKey: ["Coupons"],
        queryFn: () => FilteredCoupons(),
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        retry: true,
    })
}