const Doctor = require("../models/DoctorDetails.js");

const generateDoctorId = async () => {
    const count = await Doctor.countDocuments();

    return `DOC-${String(count + 1).padStart(4, "0")}`;
};

module.exports = generateDoctorId;