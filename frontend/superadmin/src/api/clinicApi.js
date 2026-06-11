import { buildFormData } from "../util/buildFormData";
import API from "./axios";

/* 🔹 API CALL */
export const createClinic = async (clinicData) => {
    // Map form data to backend expected format for Clinic
    let subscriptionType = "FREE_TIER";
    if (clinicData.plan === "Standard" || clinicData.billing === "Monthly") subscriptionType = "6_MONTHS";
    if (clinicData.plan === "Professional" || clinicData.plan === "Enterprise" || clinicData.billing === "Annual") subscriptionType = "12_MONTHS";
    const formData = buildFormData(clinicData);
    const res = await API.post("/clinics", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const getClinics = async () => {
    const res = await API.get("/clinics");
    return res.data;
};