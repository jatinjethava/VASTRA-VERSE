import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { addProduct, getAllProducts, getSingleProduct, deleteProduct, type Product, updateProduct, increaseStock } from "../Api/productApi";

export const useAddProduct = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (product: Product) => addProduct(product),
        onSuccess: () => {
            toast.success("Product added successfully!", {
                duration: 1500
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            navigate("/admin/products");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to add product", {
                duration: 1500
            });
        },
    });
};

export const useGetProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: getAllProducts,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, product }: { id: string, product: Product }) => updateProduct(id, product),
        onSuccess: () => {
            toast.success("Product updated successfully!", {
                duration: 1500
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update product", {
                duration: 1500
            });
        },
    });
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteProduct(id),
        onSuccess: () => {
            toast.success("Product deleted successfully!", {
                duration: 1500
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete product", {
                duration: 1500
            });
        },
    });
};

export const useGetSingleProduct = (id: string) => {
    return useQuery({
        queryKey: ["single-product", id],
        queryFn: () => getSingleProduct(id),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}

export const useIncreaseStock = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, stock, sku }: { id: string, stock: number, sku: string }) => increaseStock(id, stock, sku),
        onSuccess: () => {
            toast.success("Stock increased successfully!", {
                duration: 1500
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["single-product"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to increase stock", {
                duration: 1500
            });
        },
    });
}