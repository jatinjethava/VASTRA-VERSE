import { toast } from "sonner";
import { adminReply, deleteReview, getAllReviewsByAdmin, verifyReview } from "../Api/reviewApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



export const useFetchAllReviewsByAdmin = () => {
    return useQuery({
        queryKey: ["reviews"],
        queryFn: getAllReviewsByAdmin,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
}

export const useVerifyReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => verifyReview(id),
        onSuccess: (data: any) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["reviews"] });

        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}

export const useDeleteReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteReview(id),
        onSuccess: (data: any) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}

export const useAdminReply = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reply }: { id: string, reply: string }) => adminReply(id, reply),
        onSuccess: (data: any) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}