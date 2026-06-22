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
        email: clinicData.email,
        subscriptionType,
        maxDoctors: clinicData.maxDoctors || 5,
        maxStaff: clinicData.maxStaff || 10
    };

    // 1. Create the clinic
    const createRes = await API.post("/super-admin/clinics", jsonPayload);
    const clinic = createRes.data?.data;
    const clinicId = clinic?._id;

    if (!clinicId) {
        throw new Error("Failed to retrieve clinic ID from response");
    }

    // 2. Upload the files if any exist
    const hasFiles = clinicData.vetCert || clinicData.tradeDoc || clinicData.cheque;

    if (hasFiles) {
        const fileData = {
            vetCouncilCertificate: clinicData.vetCert,
            tradeLicense: clinicData.tradeDoc,
            cancelledCheque: clinicData.cheque
        };
        const formData = buildFormData(fileData);

        await API.post(`/super-admin/clinics/${clinicId}/documents`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    return createRes.data;
};

export const getClinics = async () => {
    const res = await API.get("/super-admin/clinics");
    return res.data;
};