import mongoose from "mongoose";

const emergencyContactSchema =
    new mongoose.Schema(
        {
            contactPersonName: {
                type: String,
            },

            contactNumber: {
                type: String,
            },
        },
        { _id: false }
    );

const staffSchema = new mongoose.Schema(
    {
        personalInfo: {
            fullName: {
                type: String,
                required: true,
            },

            profilePhoto: {
                type: String,
            },

            email: {
                type: String,
                required: true,
                unique: true,
            },

            mobileNumber: {
                type: String,
                required: true,
            },

            dateOfBirth: {
                type: Date,
                required: true,
            },

            gender: {
                type: String,
                enum: [
                    "Male",
                    "Female",
                    "Other",
                ],
            },

            emergencyContacts: [
                emergencyContactSchema,
            ],
        },

        employmentInfo: {
            role: {
                type: String,
                required: true,
            },

            dateOfJoining: Date,

            staffId: {
                type: String,
                unique: true,
            },

            reportingTo: {
                type:
                    mongoose.Schema.Types.ObjectId,
                ref: "Staff",
            },

            department: String,

            employmentType: String,

            accessLevel: String,
        },

        moduleAccess: {
            opd: {
                type: Boolean,
                default: false,
            },

            surgery: {
                type: Boolean,
                default: false,
            },

            lab: {
                type: Boolean,
                default: false,
            },

            icu: {
                type: Boolean,
                default: false,
            },

            grooming: {
                type: Boolean,
                default: false,
            },

            kennel: {
                type: Boolean,
                default: false,
            },

            pharmacy: {
                type: Boolean,
                default: false,
            },

            reports: {
                type: Boolean,
                default: false,
            },

            settings: {
                type: Boolean,
                default: false,
            },
        },

        accountInfo: {
            username: {
                type: String,
                unique: true,
            },

            password: {
                type: String,
                required: true,
            },

            temporaryPassword: String,

            accountExpiryDate: Date,

            accountActive: {
                type: Boolean,
                default: true,
            },

            forcePasswordReset: {
                type: Boolean,
                default: true,
            },
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Staff = mongoose.model(
    "Staff",
    staffSchema
);

export default Staff;