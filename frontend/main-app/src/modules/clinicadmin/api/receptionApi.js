import API from "../../../shared/api/axios";

const BASE_URL = "/clinic-admin/reception";


export const registerOwnerAndPet = async (data) => {

    // use a builder form to convert data into multi part form data (needs to be done)

    console.log(data);

    return "demo success";

};


export const searchOwner = async (query) => {
    const response = await API.get(
        `${BASE_URL}/owners/search`,
        {
            params: query,
        }
    );
    return response.data;
};


export const getClinicQueue = async () => {
    const response = await API.get(
        `${BASE_URL}/appointments/queue`
    );
    return response.data;
};


export const bookAppointment = async (data) => {
    const response = await API.post(
        `${BASE_URL}/appointments/book`,
        data
    );
    return response.data;
};

export const updateAppointmentStatus = async (
    appointmentId,
    statusData
) => {
    const response = await API.put(
        `${BASE_URL}/appointments/${appointmentId}/status`,
        statusData
    );
    return response.data;
};