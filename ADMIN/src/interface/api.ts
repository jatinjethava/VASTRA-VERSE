import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_URL,
});

api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem("adminToken");
        if (token) {
            if (token.startsWith('"') && token.endsWith('"')) {
                token = token.slice(1, -1);
            }

            config.headers.Authorization = `Bearer ${token}`;
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
            localStorage.removeItem("adminToken");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);