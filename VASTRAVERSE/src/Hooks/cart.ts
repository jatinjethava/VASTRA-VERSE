import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addToCart, applyDiscountCode, cartEmpty, decreaseQuantity, getCart, getSavedCart, increaseQuantity, moveCart, removeFromCart, saveForLater } from "../Api/cartApi";
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { AddToCart } from '../Redux/cartSlice';

export const useAddToCart = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { productId: string; quantity: number; size?: string; color?: string; }) => addToCart(payload),
        onSuccess: (data: any) => {
            toast.success("Added to cart successfully!", {
                duration: 1500
            });
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
            dispatch(AddToCart(data));
        },
        onError: (error: any) => {
            toast.error(error.message, {
                duration: 1500
            });
        }
    })
}

export const useGetCart = () => {
    return useQuery({
        queryKey: ["cart"],
        queryFn: () => getCart(),
        staleTime: 5000 * 60 * 1,
        gcTime: 5000 * 60 * 1,
        enabled: !!localStorage.getItem("token")
    })
}

export const useIncreaseCartQuantity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cartItemId: string) => increaseQuantity(cartItemId),
        onSuccess: () => {
            toast.success("Cart quantity increased successfully!", {
                duration: 1500
            });
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                duration: 1500
            });
        }
    })
}

export const useDecreaseCartQuantity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cartItemId: string) => decreaseQuantity(cartItemId),
        onSuccess: () => {
            toast.success("Cart quantity decreased successfully!", {
                duration: 1500
            });
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                duration: 1500
            });
        }
    })
}

export const useRemoveCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cartItemId: string) => removeFromCart(cartItemId),
        onSuccess: () => {
            toast.success("Cart item removed successfully!", {
                duration: 1500
            });
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                duration: 1500
            });
        },
    })
}

export const useClearCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => cartEmpty(),
        onSuccess: () => {
            toast.success("Cart cleared successfully!", {
                duration: 1500
            });
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                duration: 1500
            });
        },
    })
}

export const useApplyDiscountCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, coupon }: { id: string, coupon: string }) => applyDiscountCode(id, coupon),
        onSuccess: (data: any) => {
            toast.success(data.message, {
                duration: 1500
            });
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
        },
        onError: (error: any) => {
            toast.error(error.message, {
                duration: 1500
            });
        }
    });
}

export const useSaveForLater = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id }: { id: string }) => saveForLater(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
            queryClient.invalidateQueries({
                queryKey: ["savedCart"],
            });
        },
        onError: (error: any) => {
            toast.error(error.message, {
                duration: 1500
            });
        }
    });
}

export const useGetSavedCart = () => {
    return useQuery({
        queryKey: ['savedCart'],
        queryFn: () => getSavedCart(),
        enabled: !!localStorage.getItem("token")
    });
}

export const useMoveCart = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    return useMutation({
        mutationFn: (id: string) => moveCart(id),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ["savedCart"],
            });
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
            dispatch(AddToCart(data));
        },
        onError: (error: any) => {
            toast.error(error.message, {
                duration: 1500
            });
        }
    });
}