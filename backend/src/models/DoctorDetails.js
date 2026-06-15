const mongoose = require("mongoose")

const degreeSchema = new mongoose.Schema(
    {
        degreeName: {
            type: String,
            required: true,
            trim: true,
        },

        degreeCertificate: {
            type: String,
            default: "",
        },
    },
    { _id: false }
);

const doctorSchema = new mongoose.Schema(
    {
        doctorId: {
            type: String,
            unique: true,
        },

        // Qualifications
        degrees: {
            type: [degreeSchema],
            default: [],
        },

        specializations: {
            type: [String],
            default: [],
        },

        experience: {
            type: Number,
            required: true,
            min: 0,
        },

        // Vet Council Registration
        registrationNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        stateVetCouncil: {
            type: String,
            required: true,
            trim: true,
        },

        registrationCertificate: {
            type: String,
            default: "",
        },

        certificateValidityDate: {
            type: Date,
        },

        renewalReminderDays: {
            type: Number,
            default: 30,
        },

        // Practice Settings
        consultationFees: {
            type: Number,
            required: true,
            min: 0,
        },

        avgConsultationDuration: {
            type: Number,
            default: 15,
        },

        emergencyAvailability: {
            type: Boolean,
            default: false,
        },

        digitalSignature: {
            type: String,
            default: "",
        },

        doctorLetterhead: {
            type: String,
            default: "",
        },

        prescriptionLanguages: {
            type: [String],
            default: [],
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
    },
    {
        timestamps: true,
    }
);

module.exports =
    mongoose.models.Doctor ||
    mongoose.model("Doctor", doctorSchema);