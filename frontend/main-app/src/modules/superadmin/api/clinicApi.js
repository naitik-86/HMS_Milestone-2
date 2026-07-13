import API from "../../../shared/api/axios";

/* 🔹 helper to convert object → FormData */
const buildFormData = (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });

    return formData;
};

/* 🔹 API CALL */
export const createClinic = async (clinicData) => {
    // Map form data to backend expected format for Clinic
    let subscriptionType = "FREE_TIER";
    if (clinicData.plan === "Standard" || clinicData.billing === "Monthly") subscriptionType = "6_MONTHS";
    if (clinicData.plan === "Professional" || clinicData.plan === "Enterprise" || clinicData.billing === "Annual") subscriptionType = "12_MONTHS";

    const addressString = `${clinicData.address1 || ""}, ${clinicData.city || ""}, ${clinicData.state || ""}`;

    const jsonPayload = {
        name: clinicData.clinicName,
        address: addressString,
        subscriptionType,
        maxDoctors: clinicData.maxDoctors || 5,
        maxStaff: clinicData.maxStaff || 10,
        latitude: clinicData.latitude,
        longitude: clinicData.longitude,
        addressDetails: {
            addressLine1: clinicData.address1,
            addressLine2: clinicData.address2,
            city: clinicData.city,
            district: clinicData.district,
            state: clinicData.state,
            pincode: clinicData.pincode,
            serviceArea: clinicData.serviceArea
        }
    };

    // 1. Create the clinic (Updated endpoint)
    const createRes = await API.post("/super-admin/clinics", jsonPayload);
    const clinic = createRes.data?.data;
    const clinicId = clinic?._id;

    if (!clinicId) {
        throw new Error("Failed to retrieve clinic ID from response");
    }

    // 2. Upload the files if any exist
    const hasFiles = clinicData.logo || clinicData.vetCert || clinicData.tradeDoc || clinicData.cheque || clinicData.profile;

    if (hasFiles) {
        const fileData = {
            clinicLogo: clinicData.logo,
            vetCouncilCertificate: clinicData.vetCert,
            tradeLicense: clinicData.tradeDoc,
            cancelledCheque: clinicData.cheque,
            adminProfile: clinicData.profile
        };
        const formData = buildFormData(fileData);

        // Updated endpoint for document upload
        await API.post(`/super-admin/clinics/${clinicId}/documents`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    return createRes.data;
};

export const getClinics = async () => {
    // 3. Fetch clinics (Updated endpoint)
    const res = await API.get("/super-admin/clinics");
    return res.data;
};
