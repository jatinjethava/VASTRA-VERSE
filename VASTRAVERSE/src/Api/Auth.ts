import axios from "axios";

const BASE_API = import.meta.env.VITE_URL;

export interface SignUp {
    name: string,
    email: string,
    mobileNumber: string,
    password: string,
    confirmPassword: string
}

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

export const SignUpAPI = async (data: Required<SignUp>): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${BASE_API}/register`, data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export interface Otp {
    email: string,
    otp: string
}

export const OtpAPI = async (data: Otp): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${BASE_API}/verify`, data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export interface ResendOtp {
    email: string
}

export const resendOtpAPI = async (data: ResendOtp): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${BASE_API}/resend-otp`, data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export interface Login {
    email: string,
    password: string
}

export const LoginAPI = async (data: Login): Promise<ApiResponse> => {
    try {
        const response = await axios.post(`${BASE_API}/login`, data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
