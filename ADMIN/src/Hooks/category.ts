import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { addCategory, getAllCategories, getParentCategories, updateCategory, deleteCategory } from '../Api/categoryApi'
import { toast } from 'sonner';

export const useAddCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (category: FormData) => addCategory(category),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category added successfully", {
                duration: 1500
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                duration: 1500
            });
        },
    });
}

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, category }: { id: string, category: FormData }) => updateCategory(id, category),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category updated successfully", {
                duration: 1500
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                duration: 1500
            });
        },
    });
}

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category deleted successfully", {
                duration: 1500
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                duration: 1500
            });
        },
    });
}

export const useGetParentCategories = () => {
    return useQuery({
        queryKey: ["parentCategories"],
        queryFn: () => getParentCategories(),
        refetchInterval: 1000 * 60 * 60 * 24,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: 1,
    });
};

export const useGetCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: () => getAllCategories(),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
    });
};