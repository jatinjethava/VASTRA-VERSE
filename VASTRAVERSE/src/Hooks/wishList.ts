import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { addProductInWishList, removeProductFromWishList, getProductInWishList, getWishlistShowProducts } from "../Api/wishlistApi";
import { toast } from "sonner";
import type { WishList, ApiResponse } from "../Api/wishlistApi";


export const useAddToWishList = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productId: string) => addProductInWishList(productId),
        onSuccess: (data: ApiResponse<WishList>) => {
            toast.success(data.message, {
                duration: 1000
            });
            queryClient.invalidateQueries({ queryKey: ["wishlist-products"] });
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        },
        onError: (error: ApiResponse<WishList>) => {
            toast.error(error.message || "Failed to add product to wishlist", {
                duration: 1000
            });
        }
    });
}

export const useRemoveFromWishList = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productId: string) => removeProductFromWishList(productId),
        onSuccess: (data: ApiResponse<WishList>) => {
            toast.success(data.message, {
                duration: 1000
            });
            queryClient.invalidateQueries({ queryKey: ["wishlist-products"] });
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        },
        onError: (error: ApiResponse<WishList>) => {
            toast.error(error.message || "Failed to remove product from wishlist", {
                duration: 1000
            });
        }
    });
}

export const useGetWishList = () => {
    return useQuery({
        queryKey: ["wishlist"],
        queryFn: () => getProductInWishList(),
        staleTime: 5000 * 60 * 1,
        gcTime: 5000 * 60 * 1,
        enabled: !!localStorage.getItem("token"),
    });
}

export const useGetWishlistProducts = () => {
    return useQuery({
        queryKey: ["wishlist-products"],
        queryFn: () => getWishlistShowProducts(),
        staleTime: 5000 * 60 * 1,
        gcTime: 5000 * 60 * 1,
        enabled: !!localStorage.getItem("token"),
    });
}