import { buildFormData } from "../util/buildFormData";
import API from "./axios";

/* 🔹 API CALL */
export const createDoctor = async (doctorData) => {
    const formData = buildFormData(doctorData);
    console.log("Docotr form fired : submitted");

    const res = await API.post("/veterinarian", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return res.data;
};