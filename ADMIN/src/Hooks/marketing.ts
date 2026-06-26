import { fetchCampaigns, createCampaign, updateCampaign, deleteCampaign, toggleCampaign, fetchFlashSales, createFlashSales, updateFlashSales, deleteFlashSales, toggleFlashSales, fetchBanner, createBanner, updateBanner, deleteBanner } from "../Api/marketingApi";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useFetchAllCampaigns = () => {
    return useQuery({
        queryKey: ["get-all-campaigns"],
        queryFn: fetchCampaigns,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
}

export const useCreateCampaign = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const result = await createCampaign(data);
            queryClient.invalidateQueries({ queryKey: ["get-all-campaigns"] });
            toast.success("Campaign created successfully");
            return result;
        },
    });
}

export const useUpdateCampaign = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => {
            return await updateCampaign(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-all-campaigns"] });
            toast.success("Campaign updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update campaign");
        }
    });
}

export const useDeleteCampaign = () => {
    const queryClient = useQueryClient();
    return {
        mutateAsync: async (id: string) => {
            try {
                const result = await deleteCampaign(id);
                queryClient.invalidateQueries({ queryKey: ["get-all-campaigns"] });
                toast.success("Campaign deleted successfully");
                return result;
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        },
    };
}

export const useToggleCampaign = () => {
    const queryClient = useQueryClient();
    return {
        mutateAsync: async (id: string) => {
            try {
                const result = await toggleCampaign(id);
                queryClient.invalidateQueries({ queryKey: ["get-all-campaigns"] });
                toast.success("Campaign toggled successfully");
                return result;
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        },
    };
}

// for flash sales
export const useFetchAllFlashSales = () => {
    return useQuery({
        queryKey: ["get-all-flash-sales"],
        queryFn: fetchFlashSales,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
}

export const useCreateFlashSales = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const result = await createFlashSales(data);
            queryClient.invalidateQueries({ queryKey: ["get-all-flash-sales"] });
            toast.success("Flash sales created successfully");
            return result;
        },
    });
}

export const useUpdateFlashSales = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => {
            return await updateFlashSales(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-all-flash-sales"] });
            toast.success("Flash sales updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update flash sales");
        }
    });
}

export const useDeleteFlashSales = () => {
    const queryClient = useQueryClient();
    return {
        mutateAsync: async (id: string) => {
            try {
                const result = await deleteFlashSales(id);
                queryClient.invalidateQueries({ queryKey: ["get-all-flash-sales"] });
                toast.success("Flash sales deleted successfully");
                return result;
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        },
    };
}

export const useToggleFlashSales = () => {
    const queryClient = useQueryClient();
    return {
        mutateAsync: async (id: string) => {
            try {
                const result = await toggleFlashSales(id);
                queryClient.invalidateQueries({ queryKey: ["get-all-flash-sales"] });
                toast.success("Flash sales toggled successfully");
                return result;
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        },
    };
}

// for banner

export const useFetchAllBanner = () => {
    return useQuery({
        queryKey: ["get-all-banner"],
        queryFn: fetchBanner,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
}

export const useCreateBanner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const result = await createBanner(data);
            queryClient.invalidateQueries({ queryKey: ["get-all-banner"] });
            toast.success("Banner created successfully");
            return result;
        },
    });
}

export const useUpdateBanner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => {
            return await updateBanner(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-all-banner"] });
            toast.success("Banner updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update banner");
        }
    });
}

export const useDeleteBanner = () => {
    const queryClient = useQueryClient();
    return {
        mutateAsync: async (id: string) => {
            try {
                const result = await deleteBanner(id);
                queryClient.invalidateQueries({ queryKey: ["get-all-banner"] });
                toast.success("Banner deleted successfully");
                return result;
            } catch (error: any) {
                toast.error(error.response.data.message);
            }
        },
    };
}
