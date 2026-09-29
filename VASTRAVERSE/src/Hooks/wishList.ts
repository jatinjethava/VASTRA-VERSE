import { isAuthenticated } from '../Utils/auth';
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { addProductInWishList, removeProductFromWishList, getProductInWishList, getWishlistShowProducts } from "../Api/wishlistApi";
import { toast } from "sonner";
import type { WishList, ApiResponse } from "../Api/wishlistApi";

export const useAddToWishList = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (param: string | { _id?: string;[key: string]: any }) => {
            const productId = typeof param === "string" ? param : param._id;
            if (!productId) throw new Error("Product ID is required");
            return addProductInWishList(productId);
        },
        onMutate: async (param: string | { _id?: string;[key: string]: any }) => {
            const productId = typeof param === "string" ? param : param._id;
            if (!productId) return;
            const productObj = typeof param === "object" ? param : null;

            await queryClient.cancelQueries({ queryKey: ["wishlist"] });
            await queryClient.cancelQueries({ queryKey: ["wishlist-products"] });

            const previousWishlist = queryClient.getQueryData<any>(["wishlist"]);
            const previousWishlistProducts = queryClient.getQueryData<any>(["wishlist-products"]);

            queryClient.setQueryData<any>(["wishlist"], (old: any) => {
                const currentList = Array.isArray(old?.data?.wishlist) ? old.data.wishlist : [];
                const alreadyExists = currentList.some((item: any) => item.productId === productId);
                if (alreadyExists) return old;

                return {
                    ...(old || {}),
                    status: 200,
                    success: true,
                    message: "Success",
                    data: {
                        ...(old?.data || {}),
                        wishlist: [...currentList, { productId }]
                    }
                };
            });

            if (productObj) {
                queryClient.setQueryData<any>(["wishlist-products"], (old: any) => {
                    const currentProducts = Array.isArray(old?.data?.finalProduct) ? old.data.finalProduct : [];
                    const alreadyExists = currentProducts.some((p: any) => p._id === productId);
                    if (alreadyExists) return old;

                    return {
                        ...(old || {}),
                        status: 200,
                        success: true,
                        message: "Success",
                        data: {
                            ...(old?.data || {}),
                            finalProduct: [...currentProducts, productObj]
                        }
                    };
                });
            }

            return { previousWishlist, previousWishlistProducts };
        },
        onSuccess: (data: ApiResponse<WishList>) => {
            toast.success(data.message || "Added to wishlist", {
                duration: 1000
            });
        },
        onError: (error: any, _param, context) => {
            if (context?.previousWishlist) {
                queryClient.setQueryData(["wishlist"], context.previousWishlist);
            }
            if (context?.previousWishlistProducts) {
                queryClient.setQueryData(["wishlist-products"], context.previousWishlistProducts);
            }
            toast.error(error.message || "Failed to add product to wishlist", {
                duration: 1000
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist-products"] });
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        }
    });
};

export const useRemoveFromWishList = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productId: string) => removeProductFromWishList(productId),
        onMutate: async (productId: string) => {
            await queryClient.cancelQueries({ queryKey: ["wishlist"] });
            await queryClient.cancelQueries({ queryKey: ["wishlist-products"] });

            const previousWishlist = queryClient.getQueryData<any>(["wishlist"]);
            const previousWishlistProducts = queryClient.getQueryData<any>(["wishlist-products"]);

            queryClient.setQueryData<any>(["wishlist"], (old: any) => {
                if (!old?.data?.wishlist) return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        wishlist: old.data.wishlist.filter((item: any) => item.productId !== productId)
                    }
                };
            });

            queryClient.setQueryData<any>(["wishlist-products"], (old: any) => {
                if (!old?.data?.finalProduct) return old;
                return {
                    ...old,
                    data: {
                        ...old.data,
                        finalProduct: old.data.finalProduct.filter((item: any) => item._id !== productId)
                    }
                };
            });

            return { previousWishlist, previousWishlistProducts };
        },
        onSuccess: (data: ApiResponse<WishList>) => {
            toast.success(data.message || "Removed from wishlist", {
                duration: 1000
            });
        },
        onError: (error: any, _productId, context) => {
            if (context?.previousWishlist) {
                queryClient.setQueryData(["wishlist"], context.previousWishlist);
            }
            if (context?.previousWishlistProducts) {
                queryClient.setQueryData(["wishlist-products"], context.previousWishlistProducts);
            }
            toast.error(error.message || "Failed to remove product from wishlist", {
                duration: 1000
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist-products"] });
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        }
    });
};

export const useGetWishList = () => {
    return useQuery({
        queryKey: ["wishlist"],
        queryFn: () => getProductInWishList(),
        staleTime: 5000 * 60 * 1,
        gcTime: 5000 * 60 * 1,
        enabled: isAuthenticated(),
    });
};

export const useGetWishlistProducts = () => {
    return useQuery({
        queryKey: ["wishlist-products"],
        queryFn: () => getWishlistShowProducts(),
        staleTime: 5000 * 60 * 1,
        gcTime: 5000 * 60 * 1,
        enabled: isAuthenticated(),
    });
};
