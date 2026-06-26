import { useMutation, useQuery } from "@tanstack/react-query";
import { blockUser, growthCustomer, getAllUsers, returningCustomer, type User } from "../Api/userApi";
import { queryClient } from "../queryLib/query";
import { toast } from "sonner";


export const useGetAllUsers = () => {
    return useQuery<User[]>({
        queryKey: ["users"],
        queryFn: getAllUsers,
        staleTime: 10 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    })
}

export const useBlockUser = () => {
    return useMutation<User, Error, string>({
        mutationFn: (id: string) => blockUser(id),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success(data.message)
        },
        onError: (error: any) => {
            toast.error(error.message)
        },
    })
}

export const useReturningCustomers = () => {
    return useQuery<any[]>({
        queryKey: ["returning-customers"],
        queryFn: returningCustomer,
        staleTime: 10 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    })
}

export const useCustomerGrowth = () => {
    return useQuery<any[]>({
        queryKey: ["customer-growth"],
        queryFn: growthCustomer,
        staleTime: 10 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    })
}