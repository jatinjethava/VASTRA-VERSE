import { toast } from "sonner";
import { createReturnRequest } from "../Api/return";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateReturnRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: FormData) => createReturnRequest(payload),
        onSuccess: (data: any) => {
            toast.success(data.message, { duration: 1500 });
            queryClient.invalidateQueries({
                queryKey: ['return'],
            })
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create return request");
        },
    })
}