const Staff = require("../models/Staff.js");

const generateStaffId = async () => {
    const count = await Staff.countDocuments();

    return `STF${String(count + 1).padStart(4, "0")}`;
};

module.exports = generateStaffId;