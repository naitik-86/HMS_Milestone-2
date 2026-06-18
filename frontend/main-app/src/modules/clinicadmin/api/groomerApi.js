import API from "../../../shared/api/axios";

const BASE_URL = "/clinic-admin/groomers";

export const getGroomers = async () => {
    const res = await API.get(BASE_URL);
    return res.data;
};

export const getGroomerById = async (id) => {
    const res = await API.get(`${BASE_URL}/${id}`);
    return res.data;
};

export const createGroomer = async (groomerData) => {
    const formData = buildGroomerFormData(groomerData);

    const res = await API.post(
        BASE_URL,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return res.data;
};

export const updateGroomer = async (id, groomerData) => {
    const formData = buildGroomerFormData(groomerData);

    const res = await API.put(
        `${BASE_URL}/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return res.data;
};

export const deleteGroomer = async (id) => {
    const res = await API.delete(`${BASE_URL}/${id}`);
    return res.data;
};

const buildGroomerFormData = (groomer) => {
    const formData = new FormData();

    formData.append(
        "personalInfo",
        JSON.stringify({
            fullName: groomer.fullName,
            email: groomer.email,
            mobileNumber: groomer.mobileNumber,
            gender: groomer.gender,
            specialization: groomer.specialization,
            experience: groomer.experience
        })
    );

    formData.append(
        "availability",
        JSON.stringify({
            workingDays: groomer.workingDays || [],
            shiftStart: groomer.shiftStart,
            shiftEnd: groomer.shiftEnd
        })
    );

    formData.append(
        "accountInfo",
        JSON.stringify({
            accountActive: groomer.accountActive,
            forcePasswordReset: groomer.forcePasswordReset
        })
    );

    if (groomer.profilePhoto) {
        formData.append(
            "profilePhoto",
            groomer.profilePhoto
        );
    }

    return formData;
};