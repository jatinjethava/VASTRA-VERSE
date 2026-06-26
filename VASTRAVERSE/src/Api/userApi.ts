import axios from "axios";
import { api } from "../interface/api";
import type { Product } from "./productApi";
export interface User {
    _id: string;
    email: string;
    fullName?: string;
    mobileNumber?: string;
    role: string;
    isEmailVerified?: boolean;
    isActive?: boolean;
    isBlocked?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Address {
    _id: string;
    userId: string;
    fullName: string;
    mobileNumber: string;
    email: string;
    label: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Contact {
    _id: string;
    name: string;
    email: string;
    message: string;
    isRead: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface SubscribeMail {
    _id: string;
    email: string;
    isSubscribed: boolean;
}

export interface Wallet {
    _id: string;
    userId: string;
    amount: number;
    currency: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    walletBalance: number;
    status: "success" | "failed" | "pending",
    isDeleted: Boolean,
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    token?: string;
    error?: string;
}

export const googleLogin = async (token: string): Promise<ApiResponse<User>> => {
    try {
        const { data } = await api.post("/google-login", { token });

        if (!data.success) {
            throw new Error(data.message || "Google login failed (success=false)");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Google Login API Error:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "Google login failed (network or server error)");
        } else {
            console.error("Google Login Unknown Error:", error);
            throw error;
        }
    }
}

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
    try {
        const { data } = await api.get("/get-user");

        if (!data.success) {
            throw new Error(data.message || "Failed to get current user (success=false)");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Get Current User API Error:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "Failed to get current user (network or server error)");
        } else {
            console.error("Get Current User Unknown Error:", error);
            throw error;
        }
    }
}

export const updateUserProfile = async (formData: FormData): Promise<ApiResponse<User>> => {
    try {
        const { data } = await api.put("/update-user", formData);

        if (!data.success) {
            throw new Error(data.message || "Failed to update profile");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update profile");
        } else {
            throw error;
        }
    }
}

export const changePassword = async (passwordData: {
    email: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}): Promise<ApiResponse<User>> => {
    try {
        const { data } = await api.put("/change-password", passwordData);

        if (!data.success) {
            throw new Error(data.message || "Failed to change password");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to change password");
        } else {
            throw error;
        }
    }
}

export const recentlyViewed = async (productId: string): Promise<ApiResponse<User>> => {
    try {
        const { data } = await api.post(`/recently-viewed/${productId}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to add product to recently viewed");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to add product to recently viewed");
        } else {
            throw error;
        }
    }
}

export const getRecentlyViewed = async (): Promise<Product[]> => {
    try {
        const { data } = await api.get("/recently-viewed");

        if (!data.success) {
            throw new Error(data.message || "Failed to get recently viewed");
        }

        return data.data.recentlyViewed;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to get recently viewed");
        } else {
            throw error;
        }
    }
}

export const getLoginActivity = async (): Promise<User[]> => {
    try {
        const { data } = await api.get("/get-login-activity");

        if (!data.success) {
            throw new Error(data.message || "Failed to get login activity");
        }

        return data.data.loginActivities;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to get login activity");
        } else {
            throw error;
        }
    }
}

export const getAllSessions = async (): Promise<User[]> => {
    try {
        const { data } = await api.get("/get-all-sessions");

        if (!data.success) {
            throw new Error(data.message || "Failed to get all sessions");
        }

        return data.data.sessions;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to get session activity");
        } else {
            throw error;
        }
    }
}

export const logoutOtherDevices = async (): Promise<ApiResponse<User>> => {
    try {
        const { data } = await api.post("/logout-other-devices");

        if (!data.success) {
            throw new Error(data.message || "Failed to logout from other devices");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to logout from other devices");
        } else {
            throw error;
        }
    }
}

export const revokeToken = async (tokenId: string): Promise<ApiResponse<User>> => {
    try {
        const { data } = await api.delete(`/revoke-token/${tokenId}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to revoke session");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to revoke session");
        } else {
            throw error;
        }
    }
}

export const logoutCurrentDevice = async (): Promise<ApiResponse<User>> => {
    try {
        const { data } = await api.post("/logout");

        if (!data.success) {
            throw new Error(data.message || "Failed to logout from current device");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to logout");
        } else {
            throw error;
        }
    }
}

export const addAddress = async (addressData: {
    label: string,
    addressLine1: string,
    addressLine2: string,
    city: string,
    state: string,
    country: string,
    pincode: string
}): Promise<ApiResponse<Address>> => {
    try {
        const { data } = await api.post("/create-address", addressData);

        if (!data.success) {
            throw new Error(data.message || "Failed to create address");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create address");
        } else {
            throw error;
        }
    }
};

export const updateAddress = async (id: string, addressData: {
    label: string,
    addressLine1: string,
    addressLine2: string,
    city: string,
    state: string,
    country: string,
    pincode: string
}): Promise<ApiResponse<Address>> => {
    try {
        const { data } = await api.put(`/update-address/${id}`, addressData);

        if (!data.success) {
            throw new Error(data.message || "Failed to update address");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to update address");
        } else {
            throw error;
        }
    }
};

export const getAllAddresses = async (): Promise<Address[]> => {
    try {
        const { data } = await api.get("/get-all-address");

        if (!data.success) {
            throw new Error(data.message || "Failed to get all addresses");
        }

        return data.data.address;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to get all addresses");
        } else {
            throw error;
        }
    }
};

export const deleteAddress = async (id: string): Promise<ApiResponse<Address>> => {
    try {
        const { data } = await api.put(`/delete-address/${id}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to delete address");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete address");
        } else {
            throw error;
        }
    }
};

export const setDefaultAddress = async (id: string): Promise<ApiResponse<Address>> => {
    try {
        const { data } = await api.put(`/set-default-address/${id}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to set default address");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to set default address");
        } else {
            throw error;
        }
    }
};

export const getDefaultAddress = async (): Promise<Address> => {
    try {
        const { data } = await api.get("/get-default-address");

        if (!data.success) {
            throw new Error(data.message || "Failed to get default address");
        }

        return data.data.address;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to get default address");
        } else {
            throw error;
        }
    }
};

export const createContact = async (contactData: {
    name: string,
    email: string,
    message: string
}): Promise<ApiResponse<Contact>> => {
    try {
        const { data } = await api.post("/createContact", contactData);

        if (!data.success) {
            throw new Error(data.message || "Failed to create contact");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to create contact");
        } else {
            throw error;
        }
    }
};

export const subscribeMail = async (email: string): Promise<ApiResponse<SubscribeMail>> => {
    try {
        const { data } = await api.post("/subscribe-mail", { email });

        if (!data.success) {
            throw new Error(data.message || "Failed to subscribe mail");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to subscribe mail");
        } else {
            throw error;
        }
    }
};

export const addMoneyToWallet = async (amount: number): Promise<ApiResponse<Wallet>> => {
    try {
        const { data } = await api.post("/add-money-to-wallet", { amount });

        if (!data.success) {
            throw new Error(data.message || "Failed to add money to wallet");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to add money to wallet");
        } else {
            throw error;
        }
    }
};

export const verifyRazorpaySignature = async (response: {
    amount: number;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}): Promise<ApiResponse<{ isValid: boolean; wallet?: Wallet }>> => {
    try {
        const { data } = await api.post("/verify-razorpay-signature", response);

        if (!data.success) {
            throw new Error(data.message || "Failed to verify razorpay signature");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to verify razorpay signature");
        } else {
            throw error;
        }
    }
};

export const debitMoneyFromWallet = async (amount: number): Promise<ApiResponse<Wallet>> => {
    try {
        const { data } = await api.post("/debit-money-from-wallet", { amount });

        if (!data.success) {
            throw new Error(data.message || "Failed to debit money from wallet");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to debit money from wallet");
        } else {
            throw error;
        }
    }
};

export const getWalletInfo = async (): Promise<Wallet> => {
    try {
        const { data } = await api.get("/get-wallet-info");

        if (!data.success) {
            throw new Error(data.message || "Failed to get wallet info");
        }

        return data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to get wallet info");
        } else {
            throw error;
        }
    }
};

export interface WalletTransaction {
    _id: string;
    user: string;
    amount: number;
    transactionType: "CREDIT" | "DEBIT" | "REFUND";
    status: "success" | "failed" | "pending";
    createdAt: string;
}

export const getWalletTransactions = async (): Promise<ApiResponse<WalletTransaction[]>> => {
    try {
        const { data } = await api.get("/get-wallet-transactions");

        if (!data.success) {
            throw new Error(data.message || "Failed to get wallet transactions");
        }

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to get wallet transactions");
        } else {
            throw error;
        }
    }
}