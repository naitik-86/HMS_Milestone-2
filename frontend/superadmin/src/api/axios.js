import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

API.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error("API ERROR:", err.response?.data || err.message);
        return Promise.reject(err);
    }
);


export default API;