import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error("API ERROR:", err.response?.data || err.message);
        if (err.response?.data?.code === "CLINIC_INACTIVE") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("role");
            localStorage.removeItem("passwordResetRequired");
            localStorage.removeItem("totpRequired");
            sessionStorage.clear();
            if (window.location.pathname !== "/login") window.location.assign("/login");
        }
        return Promise.reject(err);
    }
);

export default API;
