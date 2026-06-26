import { useMutation, useQuery } from "@tanstack/react-query";
import { createPaymentOrder, verifyPayment, getPaymentDetails, type CreatePaymentInput, paymentFaildReason } from "../Api/payment";

export const useCreatePaymentOrder = () => {
    return useMutation({
        mutationFn: (paymentData: CreatePaymentInput) => createPaymentOrder(paymentData),
    })
}

export const useVerifyPayment = () => {
    return useMutation({
        mutationFn: (paymentData: { orderId: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string }) => verifyPayment(paymentData),
    })
}

export const useGetPaymentDetails = (orderId: string) => {
    return useQuery({
        queryKey: ["payment-details", orderId],
        queryFn: () => getPaymentDetails(orderId),
        enabled: !!orderId,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        retry: 2,
    })
}

export const useFailReason = () => {
    return useMutation({
        mutationFn: (reason: string) => paymentFaildReason(reason),
    })
}