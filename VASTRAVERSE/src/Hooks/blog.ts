import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getBlogs, createBlogByUser, updateBlog, deleteBlog, getUserBlog, viewBlog } from "../Api/blogApi";
import { queryClient } from "../QueryLib/query";

export const useFetchBlogs = () => {
    return useQuery({
        queryKey: ["blogs"],
        queryFn: getBlogs,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchIntervalInBackground: true,
    });
};

export const useFetchUserBlog = () => {
    return useQuery({
        queryKey: ["user-blogs"],
        queryFn: getUserBlog,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchIntervalInBackground: true,
    });
};

export const useCreateBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => createBlogByUser(data),
        onSuccess: async (data: any) => {
            toast.success(data.message, {
                duration: 1500
            });
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            await queryClient.refetchQueries({ queryKey: ["user-blogs"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create blog", {
                duration: 1500
            });
        }
    });
}

export const useUpdateBlogs = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) => updateBlog(id, data),
        onSuccess: async (data: any) => {
            toast.success(data.message, {
                duration: 1500
            });
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            await queryClient.refetchQueries({ queryKey: ["user-blogs"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update blog", {
                duration: 1500
            });
        }
    });
}

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteBlog(id),
        onSuccess: async (data: any) => {
            toast.success(data.message, {
                duration: 1500
            });
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            await queryClient.refetchQueries({ queryKey: ["user-blogs"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete blog", {
                duration: 1500
            });
        }
    });
}

export const useViewBlog = () => {
    return useMutation({
        mutationFn: (id: string) => viewBlog(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["blogs"] });
            await queryClient.refetchQueries({ queryKey: ["user-blogs"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to view blog", {
                duration: 1500
            });
        }
    });
}