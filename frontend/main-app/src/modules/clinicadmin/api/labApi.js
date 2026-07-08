import API from "../../../shared/api/axios";

const BASE_URL = "/clinic/lab-module";

/* GET PENDING PETS (LAB QUEUE) */
export const getLabPendingPets = async () => {
    const res = await API.get(`${BASE_URL}/pending-pets`);
    return res.data;
};

export const uploadLabReports = async (formData) => {
    const res = await API.post(
        `${BASE_URL}/upload-lab-reports`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
};

export const getRequiredLabTests = async (petId, visitId) => {
    const res = await API.get(`${BASE_URL}/required-tests`, {
        params: {
            petId,
            visitId
        }
    });
    return res.data;
};

/* GET COMPLETED LAB CASES */
export const getLabCompletedPets = async () => {
    const res = await API.get(`${BASE_URL}/completed-pets`);
    return res.data;
};

/* GET LAB DASHBOARD */
export const getLabDashboard = async () => {
    const res = await API.get(`${BASE_URL}/dashboard`);
    return res.data;
};

/* GET LAB HISTORY */
export const getLabHistory = async () => {
    const res = await API.get(`${BASE_URL}/history`);
    return res.data;
};

/* GET SINGLE LAB PATIENT */
export const getLabPatient = async (id) => {
    const res = await API.get(`${BASE_URL}/patient/${id}`);
    return res.data;
};

/* UPDATE LAB RESULTS */
export const updateLabPatient = async (id, labData) => {
    console.log("from update patient from lab : ", labData);
    console.log(id);

    const res = await API.put(
        `${BASE_URL}/patient/${id}`,
        labData
    );

    return res.data;
};