import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_URL,
});

export interface ApiResponse {
    status: number,
    success: boolean,
    message: string,
    data: {
        user: { name: string, email: string, mobileNumber: string },
        token: string
    },
    error: any
}

export interface Login {
    email: string;
    password: string;
}

export const loginApi = async (data: Login): Promise<ApiResponse> => {
    try {
        const response = await api.post(`/admin/login`, data);
        return response.data;
    } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        const msg = err.response?.data?.message || "Login failed. Please try again.";
        throw new Error(msg);
    }
}