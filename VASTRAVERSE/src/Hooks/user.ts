import { toast } from "sonner";
import { getCurrentUser, updateUserProfile, googleLogin, changePassword, recentlyViewed, getRecentlyViewed, getLoginActivity, getAllSessions, logoutOtherDevices, revokeToken, logoutCurrentDevice, addAddress, updateAddress, getAllAddresses, deleteAddress, setDefaultAddress, getDefaultAddress, createContact, subscribeMail, addMoneyToWallet, verifyRazorpaySignature, debitMoneyFromWallet, getWalletInfo, getWalletTransactions } from "../Api/userApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../QueryLib/query";

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: () => getCurrentUser(),
        enabled: !!localStorage.getItem("token"),
    });
}

export const useGoogleLogin = () => {
    return useMutation({
        mutationFn: (token: string) => googleLogin(token),
        onSuccess: (data: any) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}

export const useUpdateUserProfile = () => {
    return useMutation({
        mutationFn: (formData: FormData) => updateUserProfile(formData),
        onSuccess: (data: any) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}

export const useChangePassword = () => {
    return useMutation({
        mutationFn: (passwordData: { email: string, oldPassword: string, newPassword: string, confirmPassword: string }) => changePassword(passwordData),
        onSuccess: (data: any) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}

export const useRecentlyViewed = () => {
    return useMutation({
        mutationFn: (productId: string) => recentlyViewed(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
        onError: (error: any) => {
            console.log(error);
        }
    });
}

export const useGetRecentlyViewed = () => {
    return useQuery({
        queryKey: ["getRecentlyViewed"],
        queryFn: () => getRecentlyViewed(),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        staleTime: 0,
        gcTime: 0,
        enabled: !!localStorage.getItem("token"),
    });
}

export const useLoginActivity = () => {
    return useQuery({
        queryKey: ["loginActivity"],
        queryFn: () => getLoginActivity(),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        staleTime: 0,
        gcTime: 0,
        enabled: !!localStorage.getItem("token"),
    });
}

export const useGetAllSessions = () => {
    return useQuery({
        queryKey: ["getAllSessions"],
        queryFn: () => getAllSessions(),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        staleTime: 0,
        gcTime: 0,
        enabled: !!localStorage.getItem("token"),
    });
}

export const useLogoutOtherDevices = () => {
    return useMutation({
        mutationFn: () => logoutOtherDevices(),
        onSuccess: (data: any) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["getAllSessions"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}

export const useRevokeToken = () => {
    return useMutation({
        mutationFn: (tokenId: string) => revokeToken(tokenId),
        onSuccess: (data: any) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["getAllSessions"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}

export const useLogoutCurrentDevice = () => {
    return useMutation({
        mutationFn: () => logoutCurrentDevice(),
        onSuccess: (data: any) => {
            toast.success(data.message, { duration: 1500 });
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}

export const useCreateAddress = () => {
    return useMutation({
        mutationFn: (addressData: {
            label: string,
            addressLine1: string,
            addressLine2: string,
            city: string,
            state: string,
            country: string,
            pincode: string
        }) => addAddress(addressData),
        onSuccess: (data: any) => {
            toast.success(data.message, { duration: 1500 });
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            queryClient.invalidateQueries({ queryKey: ["getAllAddresses"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}

export const useUpdateAddress = () => {
    return useMutation({
        mutationFn: ({ id, addressData }: {
            id: string,
            addressData: {
                label: string,
                addressLine1: string,
                addressLine2: string,
                city: string,
                state: string,
                country: string,
                pincode: string
            }
        }) => updateAddress(id, addressData),
        onSuccess: (data: any) => {
            toast.success(data.message, { duration: 1500 });
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            queryClient.invalidateQueries({ queryKey: ["getAllAddresses"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}

export const useGetAllAddresses = () => {
    return useQuery({
        queryKey: ["getAllAddresses"],
        queryFn: () => getAllAddresses(),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        staleTime: 0,
        gcTime: 0,
        enabled: !!localStorage.getItem("token"),
    });
}

export const useDeleteAddress = () => {
    return useMutation({
        mutationFn: (id: string) => deleteAddress(id),
        onSuccess: (data: any) => {
            toast.success(data.message, { duration: 1500 });
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            queryClient.invalidateQueries({ queryKey: ["getAllAddresses"] });
        },
        onError: (error: any) => {
            toast.error(error.message, { duration: 1500 });
        }
    });
}

export const useSetDefaultAddress = () => {
    return useMutation({
        mutationFn: (id: string) => setDefaultAddress(id),
        onSuccess: (data: any) => {
            toast.success(data.message, { duration: 1500 });
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            queryClient.invalidateQueries({ queryKey: ["getAllAddresses"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}

export const useGetDefaultAddress = () => {
    return useQuery({
        queryKey: ["getDefaultAddress"],
        queryFn: () => getDefaultAddress(),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        staleTime: 0,
        gcTime: 0,
        enabled: !!localStorage.getItem("token"),
    });
}

export const useContact = () => {
    return useMutation({
        mutationFn: (contactData: {
            name: string,
            email: string,
            message: string
        }) => createContact(contactData),
        onSuccess: (data: any) => {
            toast.success(data.message, { duration: 1500 });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}

export const useSubscribeMail = () => {
    return useMutation({
        mutationFn: (email: string) => subscribeMail(email),
        onSuccess: (data: any) => {
            toast.success(data.message, { duration: 1500 });
            queryClient.invalidateQueries({ queryKey: ["subscribeMail"] });
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });
}

export const useAddMoneyToWallet = () => {
    return useMutation({
        mutationFn: (amount: number) => addMoneyToWallet(amount),
        onSuccess: (data: any) => {
            toast.success(data.message, { duration: 1500 });
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
        onError: (error: any) => {
            toast.error(error.message, { duration: 1500 });
        }
    });
}

export const useVerifyRazorpaySignature = () => {
    return useMutation({
        mutationFn: (response: {
            amount: number;
            razorpayOrderId: string;
            razorpayPaymentId: string;
            razorpaySignature: string;
        }) => verifyRazorpaySignature(response),
        onSuccess: (data: any) => {
            toast.success(data.message, { duration: 1500 });
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
        onError: (error: any) => {
            toast.error(error.message, { duration: 1500 });
        }
    });
}

export const useDebitMoneyFromWallet = () => {
    return useMutation({
        mutationFn: (amount: number) => debitMoneyFromWallet(amount),
        onSuccess: (data: any) => {
            toast.success(data.message, { duration: 1500 });
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
        onError: (error: any) => {
            toast.error(error.message, { duration: 1500 });
        }
    });
}

export const useGetWalletInfo = () => {
    return useQuery({
        queryKey: ["getWalletInfo"],
        queryFn: () => getWalletInfo(),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        staleTime: 0,
        gcTime: 0,
        enabled: !!localStorage.getItem("token"),
    });
}

export const useWalletTransactions = () => {
    return useQuery({
        queryKey: ["walletTransactions"],
        queryFn: () => getWalletTransactions(),
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        staleTime: 0,
        gcTime: 0,
        enabled: !!localStorage.getItem("token"),
    });
}