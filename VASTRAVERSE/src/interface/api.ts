import { store } from "../Redux/store";
import { logout } from "../Redux/authSlice";
import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_URL,
});

api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem("token");
        if (token) {
            if (token.startsWith('"') && token.endsWith('"')) {
                token = token.slice(1, -1);
            }

            if (config.headers && typeof config.headers.set === 'function') {
                config.headers.set('Authorization', `Bearer ${token}`);
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);