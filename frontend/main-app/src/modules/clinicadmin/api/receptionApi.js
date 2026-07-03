import API from "../../../shared/api/axios";

const BASE_URL = "/clinic/reception";

// Create Registration
export const registerOwnerAndPet = async (data) => {
    console.log("RAW FORM DATA:", data);

    const formData = {
        mobileNumber: data.mobileNumber,
        ownerName: data.ownerName,
        visitType: data.visitType,
        ownerIdType: data.ownerIdType,
        email: data.email,
        address: data.address,
        state: data.state,
        city: data.city,
        district: data.district,
        pincode: data.pincode,

        // ✅ PET
        pet: {
            petName: data.petName,
            species: data.species,
            breed: data.breed,
            gender: data.gender,
            age: data.age,
            color: data.color,
            sterilized: data.sterilized === "Yes"
        },

        // ✅ VISIT
        visit: {
            primaryReason: data.primaryReason,
            complaint: data.complaint,
            condition: data.condition,
            treatment: data.treatment,
            treatmentDate: data.treatmentDate,
            appointmentDate: data.appointmentDate,
            appointmentTime: data.appointmentTime,
            assignedDoctor: data.assignedDoctor,
            hospital: data.hospital,
            status: "Pending"
        },

        // ✅ HISTORY
        history: {
            vaccinations: data.vaccinationDate
                ? [{ date: data.vaccinationDate, name: data.vaccineName }]
                : [],

            dewormings: data.dewormingDate
                ? [{ date: data.dewormingDate, product: data.dewormingProduct }]
                : [],

            surgeries: data.surgeryDate
                ? [{ date: data.surgeryDate, procedure: data.surgicalProcedure }]
                : [],

            treatments: data.treatmentDate
                ? [{ date: data.treatmentDate, details: data.treatment }]
                : [],

            allergies: data.allergies,
            currentMedications: data.medications
        }
    };

    console.log("FINAL PAYLOAD:", formData);

    const response = await API.post(
        `${BASE_URL}/new-registration`,
        formData
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
export const getPetHistory = async () => {
    console.log("API reached ...")
    const response = await API.get(
        `${BASE_URL}/petHistory`
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

// Single Pet Details
export const getPetDetails = async (ownerId, petId) => {
    const response = await API.get(
        `${BASE_URL}/existing-customers/${ownerId}/pets/${petId}`
    );

    return response.data;
};

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