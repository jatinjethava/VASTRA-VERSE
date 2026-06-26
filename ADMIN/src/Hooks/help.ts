import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { HelpCenter } from "../Api/helpApi";
import { createFaqs, getAllFaqs, updateFaqs, deleteFaqs, getByIdFaqs, toggleActive, getAllContact, isRead, deleteContact } from "../Api/helpApi";
import { toast } from "sonner";

export const useCreateFaqs = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (FaqsData: HelpCenter) => createFaqs(FaqsData),
        onSuccess: (data: any) => {
            toast.success(data.message, {
                duration: 1500
            });
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create FAQs", {
                duration: 1500
            });
        },
    });
}

export const useGetAllFaqs = () => {
    return useQuery({
        queryKey: ["faqs"],
        queryFn: getAllFaqs,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}

export const useGetByIdFaqs = (id: string) => {
    return useQuery({
        queryKey: ["faqs", id],
        queryFn: () => getByIdFaqs(id),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}

export const useUpdateFaqs = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, FaqsData }: { id: string; FaqsData: HelpCenter }) => updateFaqs(id, FaqsData),
        onSuccess: (data: any) => {
            toast.success(data.message, {
                duration: 1500
            });
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update FAQs", {
                duration: 1500
            });
        },
    });
}

export const useDeleteFaqs = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteFaqs(id),
        onSuccess: (data: any) => {
            toast.success(data.message, {
                duration: 1500
            });
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete FAQs", {
                duration: 1500
            });
        },
    });
}

export const useToggleActive = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => toggleActive(id),
        onSuccess: (data: any) => {
            toast.success(data.message, {
                duration: 1500
            });
            queryClient.invalidateQueries({ queryKey: ["faqs"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to toggle active", {
                duration: 1500
            });
        },
    });
}

export const useContact = () => {
    return useQuery({
        queryKey: ["contact"],
        queryFn: getAllContact,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}

export const useRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => isRead(id),
        onSuccess: (data: any) => {
            toast.success(data.message, {
                duration: 1500
            });
            queryClient.invalidateQueries({ queryKey: ["contact"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update contact", {
                duration: 1500
            });
        },
    });
}

export const useDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteContact(id),
        onSuccess: (data: any) => {
            toast.success(data.message, {
                duration: 1500
            });
            queryClient.invalidateQueries({ queryKey: ["contact"] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete contact", {
                duration: 1500
            });
        },
    });
}