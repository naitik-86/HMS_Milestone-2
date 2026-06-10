import API from "./axios";

/* 🔹 helper to convert object → FormData */
const buildFormData = (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });

    return formData;
};

/* 🔹 API CALL */
export const createClinic = async (clinicData) => {
    // Map form data to backend expected format for Clinic
    let subscriptionType = "FREE_TIER";
    if (clinicData.plan === "Standard" || clinicData.billing === "Monthly") subscriptionType = "6_MONTHS";
    if (clinicData.plan === "Professional" || clinicData.plan === "Enterprise" || clinicData.billing === "Annual") subscriptionType = "12_MONTHS";

    const res = await API.post("/clinics", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

export const getClinics = async () => {
    const res = await API.get("/clinics");
    return res.data;
};