import { addReason, fetchAllOrders, refundPayment, updateExpectedDeliveryDate, updateOrderStatus } from "../Api/orderApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useFetchAllOrders = () => {
    return useQuery({
        queryKey: ["orders"],
        queryFn: fetchAllOrders,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, orderStatus }: { id: string; orderStatus: string }) => updateOrderStatus(id, orderStatus),
        onSuccess: (data: any) => {
            toast.success(data.message, {
                duration: 1500
            });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update order", {
                duration: 1500
            });
        },
    });
}

export const useAddReason = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) => addReason(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to add reason", {
                duration: 1500
            });
        },
    });
}

export const useUpdateExpectedDeliveryDate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, expectedDeliveryDate }: { id: string; expectedDeliveryDate: string }) => updateExpectedDeliveryDate(id, expectedDeliveryDate),
        onSuccess: (data: any) => {
            toast.success(data.message, {
                duration: 1500
            });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update expected delivery date", {
                duration: 1500
            });
        },
    });
}

export const useRefundPayment = () => {
    return useMutation({
        mutationFn: (orderId: string) => refundPayment(orderId),
        onSuccess: () => {
            toast.success("Payment refunded successfully", { duration: 2000 });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to refund payment", { duration: 2000 });
        },
    })
}