import API from "../../../shared/api/axios";

const buildFormData = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    });
    return formData;
};

export const createClinic = async (clinicData) => {
    let subscriptionType = "FREE_TIER";
    if (clinicData.plan === "Standard" || clinicData.billing === "Monthly") subscriptionType = "6_MONTHS";
    if (clinicData.plan === "Professional" || clinicData.plan === "Enterprise" || clinicData.billing === "Annual") subscriptionType = "12_MONTHS";

    const addressString = `${clinicData.address1 || ""}, ${clinicData.city || ""}, ${clinicData.state || ""}`;

    const jsonPayload = {
        name: clinicData.clinicName,
        facilityType: clinicData.facilityType,
        yearOfEstablishment: clinicData.year,
        address: addressString,
        contactEmail: clinicData.email,
        email: clinicData.email,
        phone: clinicData.phone,
        altPhone: clinicData.altPhone,
        website: clinicData.website,
        subscriptionType,
        billingCycle: clinicData.billing,
        planStartDate: clinicData.startDate,
        planEndDate: clinicData.endDate,
        
        licenseLimits: {
            maxDoctors: clinicData.maxDoctors || 5,
            maxStaff: clinicData.maxStaff || 10,
            maxPets: clinicData.maxPets,
            storageLimit: clinicData.storageLimit
        },
        addressDetails: {
            addressLine1: clinicData.address1,
            addressLine2: clinicData.address2,
            city: clinicData.city,
            district: clinicData.district,
            state: clinicData.state,
            pincode: clinicData.pincode,
            serviceAreas: clinicData.serviceAreas
        },
        adminDetails: {
            adminName: clinicData.adminName,
            adminEmail: clinicData.adminEmail,
            adminPhone: clinicData.adminPhone,
            designation: clinicData.designation,
            govtIdType: clinicData.govtIdType,
            govtIdNumber: clinicData.govtIdNumber
        },
        taxDetails: {
            gstNumber: clinicData.gst,
            panNumber: clinicData.pan,
            bankName: clinicData.bankName,
            accountNumber: clinicData.accountNumber,
            ifscCode: clinicData.ifsc
        },
        registrationDetails: {
            vetRegistrationNumber: clinicData.vetReg,
            stateCouncil: clinicData.stateCouncil,
            vetExpiry: clinicData.vetExpiry,
            tradeLicenseNumber: clinicData.tradeLicense,
            tradeExpiry: clinicData.tradeExpiry,
            drugLicenseNumber: clinicData.drugLicense,
            drugExpiry: clinicData.drugExpiry
        },
        features: {
            labModule: clinicData.labModule,
            groomingModule: clinicData.groomingModule,
            kennelModule: clinicData.kennelModule,
            pharmacyModule: clinicData.pharmacyModule,
            inventoryModule: clinicData.inventoryModule,
            telemedicineModule: clinicData.telemedicineModule,
            apiAccess: clinicData.apiAccess,
            whiteLabel: clinicData.whiteLabel
        }
    };

    const createRes = await API.post("/super-admin/clinics", jsonPayload);
    const clinic = createRes.data?.data;
    const clinicId = clinic?._id;

    if (!clinicId) {
        throw new Error("Failed to retrieve clinic ID from response");
    }

    const hasFiles = clinicData.logo || clinicData.vetCert || clinicData.tradeDoc || clinicData.cheque || clinicData.profile || clinicData.drugDoc || clinicData.idDoc;

    if (hasFiles) {
        const fileData = {
            clinicLogo: clinicData.logo,
            vetCouncilCertificate: clinicData.vetCert,
            tradeLicense: clinicData.tradeDoc,
            cancelledCheque: clinicData.cheque,
            adminProfile: clinicData.profile,
            drugLicense: clinicData.drugDoc,
            idDocument: clinicData.idDoc
        };
        const formData = buildFormData(fileData);

        API.post(`/super-admin/clinics/${clinicId}/documents`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }).catch((error) => console.warn("Clinic document upload failed", error));
    }

    return createRes.data;
};

export const getClinics = async () => {
    const res = await API.get("/super-admin/clinics");
    return res.data;
};

export const updateClinic = async (id, clinicData) => {
    const res = await API.put(`/super-admin/clinics/${id}`, clinicData);
    return res.data;
};

export const deleteClinic = async (id) => {
    const res = await API.delete(`/super-admin/clinics/${id}`);
    return res.data;
};