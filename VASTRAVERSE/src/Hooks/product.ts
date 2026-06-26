import { useMutation, useQuery } from "@tanstack/react-query"
import { getAllProducts, getRelatedProducts, shopBySlug, getChildCategoriesBySlug, getProductByCategory, viewProduct } from "../Api/productApi";

export const useGetAllProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: getAllProducts,
        staleTime: 0,
        gcTime: 1000 * 60 * 60,
        refetchInterval: 5000
    });
}

export const useGetCategoryBasedProducts = (category: string) => {
    return useQuery({
        queryKey: ["categoryBasedProducts", category],
        queryFn: () => getRelatedProducts(category),
        staleTime: 0,
        gcTime: 1000 * 60 * 60
    });
}

export const useGetProductByCategory = (id: string) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductByCategory(id),
        enabled: !!id,
    });
}

export const useShopBySlug = (
    slug: string,
    category?: string,
    fit?: string,
    maxPrice?: number,
    isFeatured?: boolean,
    isBestSeller?: boolean,
    isNewArrival?: boolean,
    limitedEdition?: boolean
) => {
    return useQuery({
        queryKey: ["shopBySlug", slug, category, fit, maxPrice, isFeatured, isBestSeller, isNewArrival, limitedEdition],
        queryFn: () => shopBySlug(slug, category, fit, maxPrice, isFeatured, isBestSeller, isNewArrival, limitedEdition),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
}

export const useGetChildCategoriesBySlug = (slug: string) => {
    return useQuery({
        queryKey: ["childCategoriesBySlug", slug],
        queryFn: () => getChildCategoriesBySlug(slug),
        staleTime: 1000 * 60 * 60
    });
}

export const useViewProduct = () => {
    return useMutation({
        mutationFn: (id: string) => viewProduct(id),
    });
}