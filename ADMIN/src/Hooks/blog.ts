import { useMutation, useQuery } from "@tanstack/react-query";
import { createBlog, deleteBlog, getAllBlogs, updateBlog, updateBlogStatus } from "../Api/blogApi";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => createBlog(data),
        onSuccess: (data: any) => {
            toast.success(data.message, {
                duration: 1500
            });
            return queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create blog", {
                duration: 1500
            });
        }
    });
}

export const useGetAllBlogs = () => {
    return useQuery({
        queryKey: ["blogs"],
        queryFn: getAllBlogs,
    });
}

export const useUpdateBlogs = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) => updateBlog(id, data),
        onSuccess: (data: any) => {
            toast.success(data.message);
            return queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update blog");
        }
    });
}

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteBlog(id),
        onSuccess: (data: any) => {
            toast.success(data.message);
            return queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete blog");
        }
    });
}

export const useUpdateBlogStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => updateBlogStatus(id, status),
        onSuccess: (data: any) => {
            toast.success(data.message);
            return queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update blog status");
        }
    });
}