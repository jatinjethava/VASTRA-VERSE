import { useMutation, useQuery } from '@tanstack/react-query'
import { cancelOrder, createOrder, DownloadInvoice, getStatus, getUserOrder, type Order } from '../Api/orderApi'
import { toast } from 'sonner';
import { cartEmpty } from '../Api/cartApi';
import { useDispatch } from 'react-redux';
import { clearCart } from '../Redux/cartSlice';
import { queryClient } from '../QueryLib/query';

export const useCreateOrder = () => {
    const dispatch = useDispatch();
    return useMutation({
        mutationFn: (order: Order) => createOrder(order),
        onSuccess: (data) => {
            toast.success(data.message, {
                duration: 1500
            });
            cartEmpty();
            dispatch(clearCart());
            queryClient.invalidateQueries({
                queryKey: ["cart"],
            });
        },
        onError: (error: any) => {
            toast.error(error.response.data.message, {
                duration: 1500
            });
        }
    });
}

export const useGetUserOrder = () => {
    return useQuery({
        queryKey: ["user-order"],
        queryFn: () => getUserOrder(),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true
    });
}

export const useCancelOrder = () => {
    return useMutation({
        mutationFn: ({ reason, orderId }: { reason?: string, orderId: string }) => cancelOrder({ reason, orderId }),
        onSuccess: (data) => {
            toast.success(data.message, {
                duration: 1500
            });
            queryClient.invalidateQueries({
                queryKey: ["user-order"],
            });
        },
        onError: (error: any) => {
            toast.error(error.response.data.message, {
                duration: 1500
            });
        }
    });
}

export const useDownloadInvoice = () => {
    return useMutation({
        mutationFn: (orderId: string) => DownloadInvoice(orderId),
        onSuccess: (data: Blob) => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'invoice.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);

            toast.success("Invoice downloaded successfully", {
                duration: 1500
            });
        },
        onError: (error: any) => {
            toast.error(error.response.data.message, {
                duration: 1500
            });
        }
    });
}

export const useStatus = (orderNumber: string) => {
    return useQuery({
        queryKey: ["status", orderNumber],
        queryFn: () => getStatus(orderNumber),
        enabled: !!orderNumber,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true
    });
}