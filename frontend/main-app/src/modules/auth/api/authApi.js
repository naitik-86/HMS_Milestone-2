
import API from "../../../shared/api/axios"


export const authApi = async (loginData) => {
    try {

        const res = await API.post("/auth/login", loginData);

        // console.log("LOGIN RESPONSE:", res.data);

        // /auth/login in this project is OTP/TOTP-gated for most roles.
        // Avoid storing token here because token is issued only after OTP verify.
        return res.data;
    } catch (error) {
        console.log("this is from Login page frontend " + error.response.data);

        throw error.response?.data || { message: "Login failed" };
    }
}; 