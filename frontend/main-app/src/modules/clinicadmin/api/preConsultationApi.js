import API from "../../../shared/api/axios";

const BASE_URL = "/clinic/pre-consultation";

/* GET ALL PENDING PETS */
export const getPendingPets = async () => {
    const res = await API.get(`${BASE_URL}/pending`);
    console.log("Pending Pets");
    console.log(res.data);
    return res.data;
};

export const completePreConsultation = async (petData) => {

    console.log("this is the id from preconsulatation pets  ", petData);

    const id = petData._id

    console.log(`${BASE_URL}/${id}`);


    const res = await API.put(
        `${BASE_URL}/${id}`,
        petData
    );

    return res.data;
};

export const getCompletedPets = async () => {
    const res = await API.get(`${BASE_URL}/completed`);
    return res.data;
};

export const getHistoryPets = async () => {
    const res = await API.get(`${BASE_URL}/history`);
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

