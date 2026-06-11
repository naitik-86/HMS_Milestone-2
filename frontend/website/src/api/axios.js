import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
    withCredentials: true,
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        console.log("AXIOS TOKEN:", token);
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

API.interceptors.response.use(
    (res) => res,
    (err) => {
        if (import.meta.env.DEV) {
            console.error("API ERROR:", err.response?.data || err.message);
        }

        if (err.response?.status === 401) {
            localStorage.removeItem("token");
        }

        return Promise.reject(err);
    }
);

export default API;