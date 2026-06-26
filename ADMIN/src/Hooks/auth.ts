import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../Api/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAdmin } from "../redux/authSlice";

export const useLogin = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: loginApi,
        onSuccess: (data: any) => {
            dispatch(
                setAdmin({
                    adminToken: data.data.token
                })
            )
            toast.success(data.message, {
                duration: 2000
            });
            setTimeout(() => {
                navigate("/admin");
            }, 2000);
        },
        onError: (error: any) => {
            const msg = error.message || "Login failed. Please try again.";
            toast.error(msg, {
                duration: 2000
            });
        }
    });
};