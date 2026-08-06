import API from "../../../shared/api/axios";

export const getPublicPlans = async (accountType = "Clinic") => {
    const res = await API.get("/public/clinic-registration/plans", { params: { type: accountType } });
    return res.data;
};

export const sendAdminOtp = async (adminPhone) => {
    const res = await API.post("/public/clinic-registration/admin-otp/send", { adminPhone });
    return res.data;
};

export const verifyAdminOtp = async (adminPhone, otp) => {
    const res = await API.post("/public/clinic-registration/admin-otp/verify", { adminPhone, otp });
    return res.data;
};

export const registerClinic = async (payload) => {
    const res = await API.post("/public/clinic-registration/register", payload);
    return res.data;
};
