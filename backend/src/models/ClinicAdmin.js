const mongoose = require("mongoose");

const clinicAdminSchema = new mongoose.Schema(
    {
        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            default: "CLINIC_ADMIN",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ClinicAdmin", clinicAdminSchema);