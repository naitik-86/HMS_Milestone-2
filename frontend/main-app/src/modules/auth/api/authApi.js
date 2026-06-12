
import API from "../../../shared/api/axios"


export const authApi = async (loginData) => {
    try {

        const res = await API.post("/auth/login", loginData);

        console.log("LOGIN RESPONSE:", res.data);

        if (res.data?.token) {
            localStorage.setItem("token", res.data.token);
        }

        return res.data;
    } catch (error) {
        console.log("this is from Login page frontend " + error.response.data);

        throw error.response?.data || { message: "Login failed" };
    }
};