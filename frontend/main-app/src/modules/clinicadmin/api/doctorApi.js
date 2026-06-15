import API from "../../../shared/api/axios";

/* GET ALL DOCTORS */
export const getDoctors = async () => {
    const res = await API.get("/doctors");
    return res.data;
};

/* GET SINGLE DOCTOR */
export const getDoctorById = async (id) => {
    const res = await API.get(`/doctors/${id}`);
    return res.data;
};

/* CREATE DOCTOR */
export const createDoctor = async (doctorData) => {
    const formData = new FormData();

    // Basic Details
    formData.append("name", doctorData.name);
    formData.append("experience", doctorData.experience);
    formData.append("fees", doctorData.fees);
    formData.append("regNumber", doctorData.regNumber);
    formData.append("state", doctorData.state);
    formData.append("certValidity", doctorData.certValidity);
    formData.append("reminderDays", doctorData.reminderDays);
    formData.append("avgDuration", doctorData.avgDuration);
    formData.append("emergency", doctorData.emergency);

    // Arrays
    formData.append(
        "selectedSpecs",
        JSON.stringify(doctorData.selectedSpecs)
    );

    formData.append(
        "selectedLangs",
        JSON.stringify(doctorData.selectedLangs)
    );

    formData.append(
        "degrees",
        JSON.stringify(doctorData.degrees)
    );

    // Multiple Degree Certificates
    if (doctorData.degreeCertificates?.length) {
        doctorData.degreeCertificates.forEach((file) => {
            formData.append("degreeCertificates", file);
        });
    }

    // Single Files
    if (doctorData.registrationCertificate) {
        formData.append(
            "registrationCertificate",
            doctorData.registrationCertificate
        );
    }

    if (doctorData.digitalSignature) {
        formData.append(
            "digitalSignature",
            doctorData.digitalSignature
        );
    }

    if (doctorData.doctorLetterhead) {
        formData.append(
            "doctorLetterhead",
            doctorData.doctorLetterhead
        );
    }

    const res = await API.post(
        "/doctors/create",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
};

/* UPDATE DOCTOR */
export const updateDoctor = async (id, data) => {
    const res = await API.put(`/doctors/${id}`, data);
    return res.data;
};

/* DELETE DOCTOR */
export const deleteDoctor = async (id) => {
    const res = await API.delete(`/doctors/${id}`);
    return res.data;
};