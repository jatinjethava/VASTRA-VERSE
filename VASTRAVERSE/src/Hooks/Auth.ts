import { useMutation, useQuery } from "@tanstack/react-query";
import { LoginAPI, SignUpAPI, OtpAPI, resendOtpAPI } from "../Api/Auth";

export const register = () => {
    return useMutation({
        mutationFn: SignUpAPI,
        onSuccess: (data) => {
            if (!data || !data.success) return;
            localStorage.setItem("token", data.data.token);
        }
    });
}

export const verifyOtp = () => {
    return useMutation({
        mutationFn: OtpAPI,
    });
}

export const resendOtp = () => {
    return useMutation({
        mutationFn: resendOtpAPI,
    });
}

export const Login = () => {
    return useMutation({
        mutationFn: (data: Parameters<typeof LoginAPI>[0]) =>
            LoginAPI(data),
        onSuccess: (data) => {
            if (!data || !data.success) return;
            localStorage.setItem("token", data.data.token);
        }
    });
}