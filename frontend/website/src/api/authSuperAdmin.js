import API from "./axios";

export const loginSuperAdmin = async (loginData) => {
    try {

        const res = await API.post("/auth/login-superadmin", loginData);

        // console.log("LOGIN RESPONSE:", res.data);
        alert(res.data)
        if (res.data?.token) {
            localStorage.setItem("token", res.data.token);

        }

        return res.data;
    } catch (error) {
        console.log("this is from loginSuperadmin frontend " + error.response.data);

        throw error.response?.data || { message: "Login failed" };
    }
};