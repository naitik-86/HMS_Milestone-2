import API from "./axios";

export const createClinic = async (clinicData) => {
    // Make sure you have your Super Admin JWT token stored in localStorage
    // Using a fallback dev token for Super Admin if not logged in
    const token = localStorage.getItem("token") && localStorage.getItem("token") !== "null" 
        ? localStorage.getItem("token") 
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InN1cGVyYWRtaW5faWQiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3ODExMDYzNTMsImV4cCI6NDkzNjg2NjM1M30.jIloKijmEx64fN6BpFUko2w7ud5Np_Im_sNG3udshhY"; 
        
    const headers = {
        Authorization: `Bearer ${token}`
    };

    // STEP 1: Create the Clinic Record (JSON Request)
    const jsonPayload = {
        name: clinicData.name,
        address: clinicData.address,
        subscriptionType: clinicData.subscriptionType,
        maxDoctors: clinicData.maxDoctors,
        maxStaff: clinicData.maxStaff
    };

    // Backend routes are mounted under `/api/v1`
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const res = await API.post(`${baseUrl}/api/v1/clinics`, jsonPayload, { headers });
    
    // Get the newly created clinic ID from the response
    const newClinicId = res.data.data._id;

    // STEP 2: Upload the Documents using the new Clinic ID
    if (clinicData.files) {
        const formData = new FormData();
        
        // These names MUST match the upload.fields() in your backend api.js exactly
        if (clinicData.files.vetCouncilCertificate) {
            formData.append("vetCouncilCertificate", clinicData.files.vetCouncilCertificate);
        }
        if (clinicData.files.tradeLicense) {
            formData.append("tradeLicense", clinicData.files.tradeLicense);
        }
        if (clinicData.files.cancelledCheque) {
            formData.append("cancelledCheque", clinicData.files.cancelledCheque);
        }

        // Only make the second request if there are files attached
        if (formData.entries().next().value) {
            await API.post(`${baseUrl}/api/v1/clinics/${newClinicId}/documents`, formData, {
                headers: {
                    ...headers,
                    "Content-Type": "multipart/form-data",
                },
            });
        }
    }

    return res.data;
};

export const getAllClinics = async () => {
    const token = localStorage.getItem("token") && localStorage.getItem("token") !== "null" 
        ? localStorage.getItem("token") 
        : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InN1cGVyYWRtaW5faWQiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3ODExMDYzNTMsImV4cCI6NDkzNjg2NjM1M30.jIloKijmEx64fN6BpFUko2w7ud5Np_Im_sNG3udshhY"; 
        
    const headers = {
        Authorization: `Bearer ${token}`
    };

    const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const res = await API.get(`${baseUrl}/api/v1/clinics`, { headers });
    return res.data;
};