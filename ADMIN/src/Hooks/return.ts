import { toast } from "sonner";
import { getAllReturnOrders, updateReturnStatus } from "../Api/returnApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useReturn = () => {
    return useQuery({
        queryKey: ["returns"],
        queryFn: () => getAllReturnOrders(),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
}

export const useReturnUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) => updateReturnStatus(id, status),
        onSuccess: (data: any) => {
            toast.success(data.message);
            queryClient.invalidateQueries({
                queryKey: ["returns"],
            });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}