import API from "../../../shared/api/axios";

const BASE_URL = "/pre-consultation";

/* GET ALL PENDING PETS */
export const getPendingPets = async () => {
    const res = await API.get(`${BASE_URL}/pending`);
    console.log("Pending Pets");
    console.log(res.data);
    return res.data;
};

export const completePreConsultation = async (id) => {
    const res = await API.patch(
        `/pre-consultation/${id}/complete`
    );

    return res.data;
};

// /* GET SINGLE PENDING PET */
// export const getPendingPetById = async (id) => {
//     const res = await API.get(`${BASE_URL}/${id}`);
//     return res.data;
// };

// /* UPDATE PRE CONSULTATION */
// export const updatePreConsultation = async (id, data) => {
//     const res = await API.put(`${BASE_URL}/${id}`, data);
//     return res.data;
// };

// /* MARK PRE CONSULTATION AS COMPLETED */
// export const completePreConsultation = async (id) => {
//     const res = await API.patch(`${BASE_URL}/${id}/complete`);
//     return res.data;
// };