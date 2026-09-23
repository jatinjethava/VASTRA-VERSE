import { getAllBanner, getFlashCampaigns, getUserActiveCampaigns } from "../Api/marketingApi";
import { useQuery } from "@tanstack/react-query";

export const useMarketingCampaigns = () => {
    return useQuery({
        queryKey: ["marketing-campaigns"],
        queryFn: () => getUserActiveCampaigns(),
        staleTime: 1000 * 60 * 15,
        retry: 1,
        refetchOnWindowFocus: false,
    });
}

export const useFlashCampaigns = () => {
    return useQuery({
        queryKey: ["flash-campaigns"],
        queryFn: () => getFlashCampaigns(),
        staleTime: 1000 * 60 * 15,
        retry: 1,
        refetchOnWindowFocus: false,
    });
}

export const useAllBanner = () => {
    return useQuery({
        queryKey: ["all-banners"],
        queryFn: () => getAllBanner(),
        staleTime: 1000 * 60 * 30,
        retry: 1,
        refetchOnWindowFocus: false,
    });
}