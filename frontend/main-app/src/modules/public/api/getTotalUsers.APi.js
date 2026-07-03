import API from "../../../shared/api/axios";

/* GET ALL users */
export const getDoctors = async () => {
    const res = await API.get("/total-users");

    console.log(res.data);
    return res.data;
};