import API from "../../../shared/api/axios";

const BASE_URL = "/clinic/reception";

// Create Registration
export const registerOwnerAndPet = async (createRegistration) => {
    const response = await API.post(
        `${BASE_URL}/new-registration`,
        createRegistration,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

// Get Owner Details by Owner ID
export const searchOwner = async (ownerId) => {
    const response = await API.get(
        `${BASE_URL}/new-registration/owner/${ownerId}`
    );

    return response.data;
};

// Get Customer Details by Mobile Number
export const searchCustomer = async (mobileNumber) => {
    const response = await API.get(
        `${BASE_URL}/new-registration/mobile/${mobileNumber}`
    );

    return response.data;
};

// Add New Pet for Existing Owner
export const addPet = async (ownerId, petData) => {
    const response = await API.post(
        `${BASE_URL}/new-registration/owner/${ownerId}/pets`,
        petData
    );

    return response.data;
};

// Add Visit for Existing Pet
export const addVisit = async (ownerId, petId, visitData) => {
    const response = await API.post(
        `${BASE_URL}/new-registration/owner/${ownerId}/pets/${petId}/visit`,
        visitData
    );

    return response.data;
};

// To Get Pet History
export const getPetHistory = async (ownerId, petId) => {
    const response = await API.get(
        `${BASE_URL}/new-registration/owner/${ownerId}/pets/${petId}/history`
    );

    return response.data;
};

// Dashboard Stats
export const getDashboardStats = async () => {
    const response = await API.get(
        `${BASE_URL}/existing-customers/stats`
    );

    return response.data;
};

// Existing Customers List
export const getExistingCustomers = async (params = {}) => {
    const response = await API.get(
        `${BASE_URL}/existing-customers`,
        {
            params,
        }
    );

    return response.data;
};

// Single Pet Details
export const getPetDetails = async (ownerId, petId) => {
    const response = await API.get(
        `${BASE_URL}/existing-customers/${ownerId}/pets/${petId}`
    );

    return response.data;
};

// Register Owner & Pet
// export const registerOwnerAndPet = async (data) => {
//     const response = await API.post(
//         `${BASE_URL}/owners/register`,
//         data
//     );

//     return response.data;
// };

// Search Owner
// export const searchOwner = async (params) => {
//     const response = await API.get(
//         `${BASE_URL}/owners/search`,
//         {
//             params,
//         }
//     );

//     return response.data;
// };

// Get Clinic Queue
export const getClinicQueue = async () => {
    const response = await API.get(
        `${BASE_URL}/appointments/queue`
    );

    return response.data;
};

// Book Appointment
export const bookAppointment = async (appointmentData) => {
    const response = await API.post(
        `${BASE_URL}/appointments/book`,
        appointmentData
    );

    return response.data;
};

// Update Appointment Status
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