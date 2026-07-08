import API from "../../../shared/api/axios";

const BASE_URL = "/clinic/doctor-module";

/* GET PENDING PETS */
export const getPendingPets = async () => {
    const res = await API.get(`${BASE_URL}/pending-pets`);
    return res.data;
};

/* GET COMPLETED PETS */
export const getCompletedPets = async () => {
    const res = await API.get(`${BASE_URL}/completed-pets`);
    return res.data;
};

/* GET DASHBOARD */
export const getDashboard = async () => {
    const res = await API.get(`${BASE_URL}/dashboard`);
    return res.data;
};

/* GET HISTORY */
export const getHistory = async () => {
    const res = await API.get(`${BASE_URL}/history`);
    return res.data;
};

/* GET SINGLE PATIENT */
export const getPatient = async (id) => {
    const res = await API.get(`${BASE_URL}/patient/${id}`);
    return res.data;
};

/* UPDATE PATIENT */
export const updatePatient = async (id, patientData) => {
    console.log("from update patient from doctor : ", patientData);
    console.log(id);

    const res = await API.put(
        `${BASE_URL}/patient/${id}`,
        patientData
    );

    return res.data;
};

/* CREATE PATIENT */
export const createPatient = async (patientData) => {
    const res = await API.post(
        `${BASE_URL}/patient`,
        patientData
    );

    return res.data;
};