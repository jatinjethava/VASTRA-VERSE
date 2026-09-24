import { isAuthenticated } from '../Utils/auth';
import { createReview, getallReviews, getMyReviews, getProductAllReview, helpfulReview, likeReview, matchLike, matchHelpful, reportReview } from '../Api/reviewApi';
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
        staleTime: 5000 * 60 * 1,
    });
}

export const useAllreviews = () => {
    return useQuery({
        queryKey: ["reviews"],
        queryFn: () => getallReviews(),
        staleTime: 5000 * 60 * 1,
    });
}

export const useGetMyReviews = () => {
    return useQuery({
        queryKey: ["myReviews"],
        queryFn: () => getMyReviews(),
        staleTime: 5000 * 60 * 1,
    });
}

export const useLikeReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewId: string) => likeReview(reviewId),
        onMutate: async (reviewId: string) => {
            await queryClient.cancelQueries({ queryKey: ["review"] });
            await queryClient.cancelQueries({ queryKey: ["matchLike"] });

            const previousMatchLike = queryClient.getQueryData(["matchLike"]);

            queryClient.setQueryData(["matchLike"], (old: any) => {
                if (!old) return old;
                const likedReviewIds = old.likedReviewIds || [];
                const isLiked = likedReviewIds.includes(reviewId);
                return {
                    ...old,
                    likedReviewIds: isLiked
                        ? likedReviewIds.filter((id: string) => id !== reviewId)
                        : [...likedReviewIds, reviewId]
                };
            });

            queryClient.setQueriesData({ queryKey: ["review"] }, (old: any) => {
                if (!old || !Array.isArray(old)) return old;
                const isLiked = (previousMatchLike as any)?.likedReviewIds?.includes(reviewId);
                return old.map((r: any) => {
                    if (r._id === reviewId) {
                        return { ...r, likes: isLiked ? Math.max(0, (r.likes || 0) - 1) : (r.likes || 0) + 1 };
                    }
                    return r;
                });
            });

            return { previousMatchLike };
        },
        onError: (error: any, _, context: any) => {
            queryClient.setQueryData(["matchLike"], context?.previousMatchLike);
            toast.error(error.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["review"] });
            queryClient.invalidateQueries({ queryKey: ["myReviews"] });
            queryClient.invalidateQueries({ queryKey: ["matchLike"] });
        },
    })
}

export const useHelpfulReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reviewId: string) => helpfulReview(reviewId),
        onMutate: async (reviewId: string) => {
            await queryClient.cancelQueries({ queryKey: ["review"] });
            await queryClient.cancelQueries({ queryKey: ["matchHelpful"] });

            const previousMatchHelpful = queryClient.getQueryData(["matchHelpful"]);

            queryClient.setQueryData(["matchHelpful"], (old: any) => {
                if (!old) return old;
                const helpfulReviewIds = old.helpfulReviewIds || [];
                const isHelpful = helpfulReviewIds.includes(reviewId);
                return {
                    ...old,
                    helpfulReviewIds: isHelpful
                        ? helpfulReviewIds.filter((id: string) => id !== reviewId)
                        : [...helpfulReviewIds, reviewId]
                };
            });

            queryClient.setQueriesData({ queryKey: ["review"] }, (old: any) => {
                if (!old || !Array.isArray(old)) return old;
                const isHelpful = (previousMatchHelpful as any)?.helpfulReviewIds?.includes(reviewId);
                return old.map((r: any) => {
                    if (r._id === reviewId) {
                        return { ...r, helpfulCount: isHelpful ? Math.max(0, (r.helpfulCount || 0) - 1) : (r.helpfulCount || 0) + 1 };
                    }
                    return r;
                });
            });

            return { previousMatchHelpful };
        },
        onError: (error: any, _, context: any) => {
            queryClient.setQueryData(["matchHelpful"], context?.previousMatchHelpful);
            toast.error(error.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["review"] });
            queryClient.invalidateQueries({ queryKey: ["myReviews"] });
            queryClient.invalidateQueries({ queryKey: ["matchHelpful"] });
        },
    })
}

export const useMatchLike = (productId: string) => {
    return useQuery({
        queryKey: ["matchLike"],
        queryFn: () => matchLike(productId),
        enabled: !!productId && isAuthenticated(),
        staleTime: 0,
    });
}

export const useMatchHelpful = (productId: string) => {
    return useQuery({
        queryKey: ["matchHelpful"],
        queryFn: () => matchHelpful(productId),
        enabled: !!productId && isAuthenticated(),
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
            queryClient.invalidateQueries({ queryKey: ["myReviews"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}
