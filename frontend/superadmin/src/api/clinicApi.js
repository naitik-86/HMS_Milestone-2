import API from "./axios";

/* 🔹 helper to convert object → FormData */
const buildFormData = (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
    });

    return formData;
};

/* 🔹 API CALL */
export const createClinic = async (clinicData) => {
    const formData = buildFormData(clinicData);

    const res = await API.post("/clinics", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;
};