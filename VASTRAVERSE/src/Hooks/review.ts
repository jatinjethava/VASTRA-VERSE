import { createReview, getallReviews, getMyReviews, getProductAllReview, helpfulReview, likeReview, matchLike, reportReview } from '../Api/reviewApi';
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => createReview(data),
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["review"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useGetProductAllReview = (productId: string) => {
    return useQuery({
        queryKey: ["review", productId],
        queryFn: () => getProductAllReview(productId),
        enabled: !!productId,
        staleTime: 0,
    });
}

export const useAllreviews = () => {
    return useQuery({
        queryKey: ["reviews"],
        queryFn: () => getallReviews(),
        staleTime: 0,
    });
}

export const useGetMyReviews = () => {
    return useQuery({
        queryKey: ["myReviews"],
        queryFn: () => getMyReviews(),
        staleTime: 0,
    });
}

export const useLikeReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewId: string) => likeReview(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review"] });
            queryClient.invalidateQueries({ queryKey: ["matchLike"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useHelpfulReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewId: string) => helpfulReview(reviewId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["review"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useMatchLike = (productId: string) => {
    return useQuery({
        queryKey: ["matchLike"],
        queryFn: () => matchLike(productId),
        enabled: !!productId,
        staleTime: 0,
    });
}

export const useReportReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewId: string) => reportReview(reviewId),
        onSuccess: () => {
            toast.success("Reported to admin successfully", { duration: 1000 });
            queryClient.invalidateQueries({ queryKey: ["review"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}