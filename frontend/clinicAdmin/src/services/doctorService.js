import axios from "axios";

const API_URL = "http://localhost:5000/api/doctors";

export const getDoctors = async () => {
    return await axios.get(API_URL);
};

export const createDoctor = async (formData) => {
    return await axios.post(API_URL, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};