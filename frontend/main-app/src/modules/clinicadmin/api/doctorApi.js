import API from "../../../shared/api/axios";


export const getDoctors = async () => {
    const res = await API.get("/doctors");
    return res.data;
};



export const createDoctor = async (data) => {
    const res = await API.post("/doctors/create", data);
    return res.data;
};