import { toast } from "sonner";
import { getAdminNotifications, markAllAsReadAdmin, markAsRead } from "../Api/notificationApi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../queryLib/query";

export const useAdminNotifications = () => {
    return useQuery({
        queryKey: ["adminNotifications"],
        queryFn: async () => {
            try {
                const res = await getAdminNotifications();
                return res?.data?.notifications || [];
            } catch (error: any) {
                toast.error(error.message, { duration: 1500 });
                throw error;
            }
        },
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
};

export const useMarkAsRead = () => {
    return useMutation({
        mutationFn: (id: string) => markAsRead(id),
        mutationKey: ["adminNotifications"],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
        },
        onError: (error: any) => {
            toast.error(error.message, { duration: 1500 });
        }
    });
};

export const useMarkAllAsReadAdmin = () => {
    return useMutation({
        mutationFn: () => markAllAsReadAdmin(),
        mutationKey: ["adminNotifications"],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
        },
        onError: (error: any) => {
            toast.error(error.message, { duration: 1500 });
        }
    });
};