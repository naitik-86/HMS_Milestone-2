import API from "../../../shared/api/axios"


export const authApi = async (loginData) => {
    try {

        const res = await API.post("/auth/login", loginData);

        // console.log("LOGIN RESPONSE:", res.data);

        // /auth/login in this project is OTP/TOTP-gated for most roles.
        // Avoid storing token here because token is issued only after OTP verify.
        return res.data;
    } catch (error) {
        // A network failure (backend unreachable, CORS block, timeout, DNS
        // failure) never gets an HTTP response at all, so error.response is
        // undefined here - this debug log used to access error.response.data
        // without optional chaining, which threw its own new TypeError
        // ("Cannot read properties of undefined (reading 'data')") on any
        // network-level login failure. That masked the real error: the
        // throw below never ran, and the login page's catch block showed
        // this unrelated crash message instead of the actual failure
        // reason.
        console.log("Login request failed:", error.response?.data || error.message);

        throw error.response?.data || { message: "Login failed" };
    }
};

export const googleLoginApi = async (credential) => {
    try {
        const res = await API.post("/auth/google-login", { credential });
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Google login failed" };
    }
};

export const changePassword = async (passwordData) => {
    try {
        const res = await API.post("/auth/change-password", passwordData);
        return res.data;
    } catch (error) {
        throw error.response?.data || { message: "Password update failed" };
    }
};
