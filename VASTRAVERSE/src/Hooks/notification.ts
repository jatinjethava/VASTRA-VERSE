import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import {
    getUserNotifications,
    markAsRead,
    readAllNotification,
} from "../Api/notificationApi";
import { toast } from "sonner";

export const getAllUserNotifications = () => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: getUserNotifications,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        enabled: !!localStorage.getItem("token"),
    })
}

export const markAsReadNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (data: any) => {
            toast.error(data.message);
        }
    })
}

export const readAllNotifications = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => readAllNotification(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (data: any) => {
            toast.error(data.message);
        }
    })
}