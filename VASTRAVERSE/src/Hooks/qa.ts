import { toast } from "sonner";
import { askQuestion, getQuestionByProduct, helpfulCount } from "../Api/qaApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAskQuestion = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: {
            productId: string;
            question: string;
        }) => askQuestion(payload),
        onSuccess: (data: any) => {
            toast.success(data.message, { duration: 1500 });
            queryClient.invalidateQueries({
                queryKey: ["getQAbyProduct"],
            });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to ask question");
        },
    });
};

export const useGetQAbyProduct = (productId: string, page: number) => {
    return useQuery({
        queryKey: ["getQAbyProduct", productId, page],
        queryFn: () => getQuestionByProduct(productId, page),
        enabled: !!productId,
    });
}

export const useHelpFulCount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => helpfulCount(id),
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to get helpful count");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["getQAbyProduct"] });
        }
    });
}